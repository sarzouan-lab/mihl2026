import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, authedProcedure, adminProcedure } from "../_core/trpc";
import { db } from "../db";
import { staffApplications, users, games, passwordSetupTokens } from "../../shared/schema";
import { eq, and, isNull, or } from "drizzle-orm";
import { sendStaffApprovalEmail, sendSetPasswordEmail } from "../_core/emailService";
import { generateRandomToken, hashPassword } from "../_core/auth";
import crypto from "node:crypto";

export const staffRouter = router({
  // Anyone applies to be a referee or scorekeeper -- no login required.
  // If they're already logged in, we link the application to their account;
  // otherwise we just record their contact info and link it later when they sign up.
  publicApply: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        role: z.enum(["referee", "scorekeeper"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await db
        .select()
        .from(staffApplications)
        .where(
          and(
            eq(staffApplications.applicantEmail, input.email.toLowerCase()),
            eq(staffApplications.role, input.role)
          )
        );
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already applied for this role",
        });
      }

      await db.insert(staffApplications).values({
        userId: ctx.user?.id,
        applicantEmail: input.email.toLowerCase(),
        applicantFirstName: input.firstName,
        applicantLastName: input.lastName,
        applicantPhone: input.phone,
        role: input.role,
        status: "pending",
      });
      return { success: true };
    }),

  myApplications: authedProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(staffApplications)
      .where(eq(staffApplications.userId, ctx.user.id));
  }),

  // Admin: list pending staff applications (applicant may or may not have an account yet)
  listPending: adminProcedure.query(async () => {
    const rows = await db
      .select({ application: staffApplications, user: users })
      .from(staffApplications)
      .leftJoin(users, eq(staffApplications.userId, users.id))
      .where(eq(staffApplications.status, "pending"));

    return rows.map(({ application, user }) => ({
      application,
      displayName: user
        ? `${user.firstName} ${user.lastName}`
        : `${application.applicantFirstName} ${application.applicantLastName}`,
      email: user?.email ?? application.applicantEmail ?? "",
    }));
  }),

  // Admin: approve a referee/scorekeeper application
  approve: adminProcedure
    .input(z.object({ applicationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const [application] = await db
        .select()
        .from(staffApplications)
        .where(eq(staffApplications.id, input.applicationId));

      if (!application) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      }

      await db
        .update(staffApplications)
        .set({
          status: "approved",
          reviewedAt: new Date(),
          reviewedByUserId: ctx.user.id,
        })
        .where(eq(staffApplications.id, input.applicationId));

      // If they already have an account (applied while logged in, or one
      // already exists under that email), promote them right away.
      let linkedUser = application.userId
        ? (await db.select().from(users).where(eq(users.id, application.userId)))[0]
        : undefined;

      if (!linkedUser && application.applicantEmail) {
        linkedUser = (
          await db.select().from(users).where(eq(users.email, application.applicantEmail))
        )[0];
        if (linkedUser) {
          await db
            .update(staffApplications)
            .set({ userId: linkedUser.id })
            .where(eq(staffApplications.id, input.applicationId));
        }
      }

      if (linkedUser) {
        // Existing account -- just promote and notify.
        await db.update(users).set({ role: "staff" }).where(eq(users.id, linkedUser.id));
        try {
          await sendStaffApprovalEmail(linkedUser.email, linkedUser.firstName, application.role);
        } catch (err) {
          console.error("Failed to send staff approval email:", err);
        }
      } else if (
        application.applicantEmail &&
        application.applicantFirstName &&
        application.applicantLastName
      ) {
        // No account yet -- auto-create one now (unusable random password
        // until they set their own via the emailed link), and email them
        // a link to set their password and start using the portal.
        const randomPasswordHash = await hashPassword(crypto.randomBytes(32).toString("hex"));
        const [result] = await db.insert(users).values({
          email: application.applicantEmail,
          passwordHash: randomPasswordHash,
          firstName: application.applicantFirstName,
          lastName: application.applicantLastName,
          phone: application.applicantPhone ?? undefined,
          role: "staff",
        });
        const newUserId = result.insertId;

        await db
          .update(staffApplications)
          .set({ userId: newUserId })
          .where(eq(staffApplications.id, input.applicationId));

        const token = generateRandomToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await db.insert(passwordSetupTokens).values({
          userId: newUserId,
          token,
          expiresAt,
        });

        await sendSetPasswordEmail(
          application.applicantEmail,
          application.applicantFirstName,
          application.role,
          token
        ).catch((err) => console.error("Failed to send set-password email:", err));
      }

      return { success: true };
    }),

  // Approved staff: list open game slots they can claim (as referee or scorekeeper)
  openSlots: authedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "staff" && ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Approved staff access required" });
    }
    return db
      .select()
      .from(games)
      .where(
        or(isNull(games.refereeUserId), isNull(games.scorekeeperUserId))
      );
  }),

  // Approved staff: claim a referee or scorekeeper slot on a game
  claimSlot: authedProcedure
    .input(z.object({ gameId: z.number(), slot: z.enum(["referee", "scorekeeper"]) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "staff" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Approved staff access required" });
      }

      const [game] = await db.select().from(games).where(eq(games.id, input.gameId));
      if (!game) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });
      }

      if (input.slot === "referee") {
        if (game.refereeUserId) {
          throw new TRPCError({ code: "CONFLICT", message: "Referee slot already claimed" });
        }
        await db
          .update(games)
          .set({ refereeUserId: ctx.user.id })
          .where(eq(games.id, input.gameId));
      } else {
        if (game.scorekeeperUserId) {
          throw new TRPCError({ code: "CONFLICT", message: "Scorekeeper slot already claimed" });
        }
        await db
          .update(games)
          .set({ scorekeeperUserId: ctx.user.id })
          .where(eq(games.id, input.gameId));
      }

      return { success: true };
    }),

  // Approved staff: release a slot they previously claimed
  releaseSlot: authedProcedure
    .input(z.object({ gameId: z.number(), slot: z.enum(["referee", "scorekeeper"]) }))
    .mutation(async ({ input, ctx }) => {
      const [game] = await db.select().from(games).where(eq(games.id, input.gameId));
      if (!game) throw new TRPCError({ code: "NOT_FOUND" });

      const ownsSlot =
        (input.slot === "referee" && game.refereeUserId === ctx.user.id) ||
        (input.slot === "scorekeeper" && game.scorekeeperUserId === ctx.user.id);
      if (!ownsSlot && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (input.slot === "referee") {
        await db.update(games).set({ refereeUserId: null }).where(eq(games.id, input.gameId));
      } else {
        await db.update(games).set({ scorekeeperUserId: null }).where(eq(games.id, input.gameId));
      }
      return { success: true };
    }),
});
