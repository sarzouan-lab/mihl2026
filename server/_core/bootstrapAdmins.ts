import "dotenv/config";
import { db, pool } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

// Run this ONCE, after admin@mihl.ca and aharon@mihl.ca have each signed up
// normally through the site's signup form (so they set their own passwords).
// This just flips their role from "player" to "admin".
const ADMIN_EMAILS = ["admin@mihl.ca", "aharon@mihl.ca"];

async function bootstrapAdmins() {
  for (const email of ADMIN_EMAILS) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      console.warn(`No account found for ${email} yet -- sign up first, then re-run.`);
      continue;
    }
    await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
    console.log(`Promoted ${email} to admin.`);
  }
  await pool.end();
}

bootstrapAdmins().catch((err) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});
