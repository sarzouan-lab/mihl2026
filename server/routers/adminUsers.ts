import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

export const adminUsersRouter = router({
  listAdmins: adminProcedure.query(async () => {
    return db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, "admin"));
  }),

  promoteToAdmin: adminProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.email, input.email.toLowerCase()));
      return { success: true };
    }),
});
