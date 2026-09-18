import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, authedProcedure, adminProcedure } from "../_core/trpc";
import { db } from "../db";
import { registrations, users } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { sendApprovalEmail, sendWaitlistEmail, sendRegistrationReceivedEmail } from "../_core/emailService";

export const registrationRouter = router({
  // Player submits their registration
  submit: authedProcedure
    .input(
      z.object({
        jerseyNumberPref: z.number().int().min(0).max(99).optional(),
        position: z.enum(["forward", "defense", "goalie"]),
        jerseySize: z.enum(["M", "L", "XL", "XXL", "XXXL"]),
        waiverAccepted: z.literal(true, {
          errorMap: () => ({ message: "You must accept the waiver to register" }),
        }),
        paymentPlan: z.enum(["full", "split"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await db
        .select()
        .from(registrations)
        .where(eq(registrations.userId, ctx.user.id));
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already submitted a registration",
        });
      }

      await db.insert(registrations).values({
        userId: ctx.user.id,
        jerseyNumberPref: input.jerseyNumberPref,
        position: input.position,
        jerseySize: input.jerseySize,
        waiverAccepted: input.waiverAccepted,
        paymentPlan: input.paymentPlan,
        status: "pending",
      });

      await sendRegistrationReceivedEmail(
        ctx.user.email,
        ctx.user.firstName,
        input.paymentPlan
      ).catch((err) =>
        console.error("Failed to send registration received email:", err)
      );

      return { success: true };
    }),

  myRegistration: authedProcedure.query(async ({ ctx }) => {
    const [reg] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.userId, ctx.user.id));
    return reg ?? null;
  }),

  // Admin: list pending registrations
  listPending: adminProcedure.query(async () => {
    return db
      .select({
        registration: registrations,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
        },
      })
      .from(registrations)
      .innerJoin(users, eq(registrations.userId, users.id))
      .where(eq(registrations.status, "pending"));
  }),

  // Admin: list all registrations (any status), for the admin dashboard
  listAll: adminProcedure.query(async () => {
    return db
      .select({
        registration: registrations,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
        },
      })
      .from(registrations)
      .innerJoin(users, eq(registrations.userId, users.id));
  }),

  // Admin: approve a registration -> assign temp team + send Spond email
  approve: adminProcedure
    .input(z.object({ registrationId: z.number(), teamId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const [reg] = await db
        .select({ registration: registrations, user: users })
        .from(registrations)
        .innerJoin(users, eq(registrations.userId, users.id))
        .where(eq(registrations.id, input.registrationId));

      if (!reg) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
      }

      await db
        .update(registrations)
        .set({
          status: "approved",
          teamId: input.teamId,
          reviewedAt: new Date(),
          reviewedByUserId: ctx.user.id,
          spondEmailSentAt: new Date(),
        })
        .where(eq(registrations.id, input.registrationId));

      await sendApprovalEmail(
        reg.user.email,
        reg.user.firstName,
        reg.registration.paymentPlan,
        reg.registration.paymentStatus
      ).catch((err) =>
        console.error("Failed to send approval email:", err)
      );

      return { success: true };
    }),

  // Admin: waitlist a registration -> automatic waitlist email
  waitlist: adminProcedure
    .input(z.object({ registrationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const [reg] = await db
        .select({ registration: registrations, user: users })
        .from(registrations)
        .innerJoin(users, eq(registrations.userId, users.id))
        .where(eq(registrations.id, input.registrationId));

      if (!reg) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
      }

      await db
        .update(registrations)
        .set({
          status: "waitlisted",
          reviewedAt: new Date(),
          reviewedByUserId: ctx.user.id,
        })
        .where(eq(registrations.id, input.registrationId));

      await sendWaitlistEmail(reg.user.email, reg.user.firstName).catch((err) =>
        console.error("Failed to send waitlist email:", err)
      );

      return { success: true };
    }),

  // Admin: move a player between (still-provisional) teams
  reassignTeam: adminProcedure
    .input(z.object({ registrationId: z.number(), teamId: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .update(registrations)
        .set({ teamId: input.teamId })
        .where(eq(registrations.id, input.registrationId));
      return { success: true };
    }),

  // Admin: update bookkeeping-only payment status
  updatePaymentStatus: adminProcedure
    .input(
      z.object({
        registrationId: z.number(),
        paymentStatus: z.enum(["unpaid", "deposit_paid", "paid_in_full"]),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(registrations)
        .set({ paymentStatus: input.paymentStatus })
        .where(eq(registrations.id, input.registrationId));
      return { success: true };
    }),
});
