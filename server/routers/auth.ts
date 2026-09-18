import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, authedProcedure } from "../_core/trpc";
import { db } from "../db";
import { users, staffApplications, passwordSetupTokens } from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  generateRandomToken,
} from "../_core/auth";
import { sendPasswordResetEmail } from "../_core/emailService";

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email.toLowerCase()));
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists",
        });
      }

      // If they were already approved as staff before signing up, grant that role now.
      const [approvedStaffApp] = await db
        .select()
        .from(staffApplications)
        .where(
          and(
            eq(staffApplications.applicantEmail, input.email.toLowerCase()),
            eq(staffApplications.status, "approved")
          )
        );

      const passwordHash = await hashPassword(input.password);
      const [result] = await db.insert(users).values({
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: approvedStaffApp ? "staff" : "player",
      });

      const userId = result.insertId;

      if (approvedStaffApp) {
        await db
          .update(staffApplications)
          .set({ userId })
          .where(eq(staffApplications.id, approvedStaffApp.id));
      }

      setSessionCookie(ctx.res, userId);
      return { userId };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email.toLowerCase()));

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }
      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      setSessionCookie(ctx.res, user.id);
      return { userId: user.id, role: user.role };
    }),

  logout: authedProcedure.mutation(async ({ ctx }) => {
    clearSessionCookie(ctx.res);
    return { success: true };
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const { passwordHash, ...safeUser } = ctx.user;
    return safeUser;
  }),

  // For accounts auto-created on staff approval -- they use the emailed
  // link to set their password and finish setting up their account.
  setPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [tokenRow] = await db
        .select()
        .from(passwordSetupTokens)
        .where(eq(passwordSetupTokens.token, input.token));

      if (!tokenRow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid or expired link" });
      }
      if (tokenRow.usedAt) {
        throw new TRPCError({ code: "CONFLICT", message: "This link has already been used" });
      }
      if (tokenRow.expiresAt < new Date()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This link has expired" });
      }

      const passwordHash = await hashPassword(input.password);
      await db.update(users).set({ passwordHash }).where(eq(users.id, tokenRow.userId));
      await db
        .update(passwordSetupTokens)
        .set({ usedAt: new Date() })
        .where(eq(passwordSetupTokens.id, tokenRow.id));

      setSessionCookie(ctx.res, tokenRow.userId);
      return { success: true };
    }),

  // Request a password reset -- always returns success regardless of
  // whether the email exists, so this can't be used to check who has
  // an account (standard practice).
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email.toLowerCase()));

      if (user) {
        const token = generateRandomToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await db.insert(passwordSetupTokens).values({
          userId: user.id,
          token,
          expiresAt,
        });
        await sendPasswordResetEmail(user.email, user.firstName, token).catch((err) =>
          console.error("Failed to send password reset email:", err)
        );
      }

      return { success: true };
    }),
});
