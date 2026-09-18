"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server/_core/index.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_node_path = __toESM(require("node:path"));
var import_express2 = require("@trpc/server/adapters/express");

// server/_core/trpc.ts
var import_server = require("@trpc/server");

// server/db.ts
var import_promise = __toESM(require("mysql2/promise"));
var import_mysql2 = require("drizzle-orm/mysql2");

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  gameStats: () => gameStats,
  games: () => games,
  gamesRelations: () => gamesRelations,
  newsPosts: () => newsPosts,
  passwordSetupTokens: () => passwordSetupTokens,
  registrations: () => registrations,
  staffApplications: () => staffApplications,
  starsOfWeek: () => starsOfWeek,
  teams: () => teams,
  teamsRelations: () => teamsRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  venues: () => venues
});
var import_mysql_core = require("drizzle-orm/mysql-core");
var import_drizzle_orm = require("drizzle-orm");
var users = (0, import_mysql_core.mysqlTable)("users", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  email: (0, import_mysql_core.varchar)("email", { length: 255 }).notNull().unique(),
  passwordHash: (0, import_mysql_core.varchar)("password_hash", { length: 255 }).notNull(),
  firstName: (0, import_mysql_core.varchar)("first_name", { length: 100 }).notNull(),
  lastName: (0, import_mysql_core.varchar)("last_name", { length: 100 }).notNull(),
  phone: (0, import_mysql_core.varchar)("phone", { length: 30 }),
  role: (0, import_mysql_core.mysqlEnum)("role", ["player", "staff", "admin"]).notNull().default("player"),
  createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
});
var teams = (0, import_mysql_core.mysqlTable)("teams", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  name: (0, import_mysql_core.varchar)("name", { length: 100 }).notNull(),
  logoUrl: (0, import_mysql_core.varchar)("logo_url", { length: 500 }),
  isFinal: (0, import_mysql_core.boolean)("is_final").default(false).notNull()
  // locked after Sep 19
});
var venues = (0, import_mysql_core.mysqlTable)("venues", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  name: (0, import_mysql_core.varchar)("name", { length: 150 }).notNull(),
  // "Samuel Moscovitch Arena" / "Memorial Rink"
  address: (0, import_mysql_core.varchar)("address", { length: 255 })
});
var registrations = (0, import_mysql_core.mysqlTable)("registrations", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  userId: (0, import_mysql_core.int)("user_id").notNull().references(() => users.id),
  jerseyNumberPref: (0, import_mysql_core.int)("jersey_number_pref"),
  position: (0, import_mysql_core.mysqlEnum)("position", ["forward", "defense", "goalie"]).notNull(),
  jerseySize: (0, import_mysql_core.mysqlEnum)("jersey_size", ["M", "L", "XL", "XXL", "XXXL"]).notNull(),
  waiverAccepted: (0, import_mysql_core.boolean)("waiver_accepted").notNull().default(false),
  paymentPlan: (0, import_mysql_core.mysqlEnum)("payment_plan", ["full", "split"]).notNull(),
  status: (0, import_mysql_core.mysqlEnum)("status", ["pending", "approved", "waitlisted", "rejected"]).notNull().default("pending"),
  teamId: (0, import_mysql_core.int)("team_id").references(() => teams.id),
  // temporary/provisional until locked
  paymentStatus: (0, import_mysql_core.mysqlEnum)("payment_status", [
    "unpaid",
    "deposit_paid",
    "paid_in_full"
  ]).notNull().default("unpaid"),
  spondEmailSentAt: (0, import_mysql_core.timestamp)("spond_email_sent_at"),
  createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull(),
  reviewedAt: (0, import_mysql_core.timestamp)("reviewed_at"),
  reviewedByUserId: (0, import_mysql_core.int)("reviewed_by_user_id").references(() => users.id)
});
var staffApplications = (0, import_mysql_core.mysqlTable)("staff_applications", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  userId: (0, import_mysql_core.int)("user_id").references(() => users.id),
  // null until they create/link an account
  applicantEmail: (0, import_mysql_core.varchar)("applicant_email", { length: 255 }),
  applicantFirstName: (0, import_mysql_core.varchar)("applicant_first_name", { length: 100 }),
  applicantLastName: (0, import_mysql_core.varchar)("applicant_last_name", { length: 100 }),
  applicantPhone: (0, import_mysql_core.varchar)("applicant_phone", { length: 30 }),
  role: (0, import_mysql_core.mysqlEnum)("staff_role", ["referee", "scorekeeper"]).notNull(),
  status: (0, import_mysql_core.mysqlEnum)("status", ["pending", "approved", "rejected"]).notNull().default("pending"),
  createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull(),
  reviewedAt: (0, import_mysql_core.timestamp)("reviewed_at"),
  reviewedByUserId: (0, import_mysql_core.int)("reviewed_by_user_id").references(() => users.id)
});
var games = (0, import_mysql_core.mysqlTable)("games", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  gameDate: (0, import_mysql_core.date)("game_date").notNull(),
  gameTime: (0, import_mysql_core.time)("game_time").notNull(),
  // 9:30 PM
  venueId: (0, import_mysql_core.int)("venue_id").notNull().references(() => venues.id),
  homeTeamId: (0, import_mysql_core.int)("home_team_id").references(() => teams.id),
  awayTeamId: (0, import_mysql_core.int)("away_team_id").references(() => teams.id),
  homeScore: (0, import_mysql_core.int)("home_score"),
  awayScore: (0, import_mysql_core.int)("away_score"),
  status: (0, import_mysql_core.mysqlEnum)("status", ["scheduled", "final", "cancelled"]).notNull().default("scheduled"),
  label: (0, import_mysql_core.varchar)("label", { length: 100 }),
  // e.g. "Championship Game", "3rd Place Game"
  refereeUserId: (0, import_mysql_core.int)("referee_user_id").references(() => users.id),
  scorekeeperUserId: (0, import_mysql_core.int)("scorekeeper_user_id").references(() => users.id)
});
var gameStats = (0, import_mysql_core.mysqlTable)("game_stats", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  gameId: (0, import_mysql_core.int)("game_id").notNull().references(() => games.id),
  playerUserId: (0, import_mysql_core.int)("player_user_id").notNull().references(() => users.id),
  teamId: (0, import_mysql_core.int)("team_id").notNull().references(() => teams.id),
  goals: (0, import_mysql_core.int)("goals").notNull().default(0),
  assists: (0, import_mysql_core.int)("assists").notNull().default(0),
  penaltyMinutes: (0, import_mysql_core.int)("penalty_minutes").notNull().default(0),
  shotsAgainst: (0, import_mysql_core.int)("shots_against"),
  // goalies only
  saves: (0, import_mysql_core.int)("saves")
  // goalies only
});
var newsPosts = (0, import_mysql_core.mysqlTable)("news_posts", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  title: (0, import_mysql_core.varchar)("title", { length: 255 }).notNull(),
  bodyHtml: (0, import_mysql_core.text)("body_html").notNull(),
  isAutoGenerated: (0, import_mysql_core.boolean)("is_auto_generated").notNull().default(false),
  status: (0, import_mysql_core.mysqlEnum)("status", ["draft", "published"]).notNull().default("draft"),
  createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull(),
  publishedAt: (0, import_mysql_core.timestamp)("published_at"),
  authorUserId: (0, import_mysql_core.int)("author_user_id").references(() => users.id)
});
var starsOfWeek = (0, import_mysql_core.mysqlTable)("stars_of_week", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  weekStartDate: (0, import_mysql_core.date)("week_start_date").notNull(),
  playerUserId: (0, import_mysql_core.int)("player_user_id").notNull().references(() => users.id),
  teamId: (0, import_mysql_core.int)("team_id").references(() => teams.id),
  note: (0, import_mysql_core.varchar)("note", { length: 500 }),
  // e.g. "3 goals, 2 assists this week"
  status: (0, import_mysql_core.mysqlEnum)("status", ["draft", "approved"]).notNull().default("draft"),
  createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull(),
  approvedAt: (0, import_mysql_core.timestamp)("approved_at"),
  approvedByUserId: (0, import_mysql_core.int)("approved_by_user_id").references(() => users.id)
});
var passwordSetupTokens = (0, import_mysql_core.mysqlTable)("password_setup_tokens", {
  id: (0, import_mysql_core.int)("id").autoincrement().primaryKey(),
  userId: (0, import_mysql_core.int)("user_id").notNull().references(() => users.id),
  token: (0, import_mysql_core.varchar)("token", { length: 128 }).notNull().unique(),
  expiresAt: (0, import_mysql_core.timestamp)("expires_at").notNull(),
  usedAt: (0, import_mysql_core.timestamp)("used_at"),
  createdAt: (0, import_mysql_core.timestamp)("created_at").defaultNow().notNull()
});
var usersRelations = (0, import_drizzle_orm.relations)(users, ({ many }) => ({
  registrations: many(registrations),
  staffApplications: many(staffApplications)
}));
var teamsRelations = (0, import_drizzle_orm.relations)(teams, ({ many }) => ({
  registrations: many(registrations),
  homeGames: many(games, { relationName: "homeTeam" }),
  awayGames: many(games, { relationName: "awayTeam" })
}));
var gamesRelations = (0, import_drizzle_orm.relations)(games, ({ one, many }) => ({
  venue: one(venues, { fields: [games.venueId], references: [venues.id] }),
  homeTeam: one(teams, {
    fields: [games.homeTeamId],
    references: [teams.id],
    relationName: "homeTeam"
  }),
  awayTeam: one(teams, {
    fields: [games.awayTeamId],
    references: [teams.id],
    relationName: "awayTeam"
  }),
  referee: one(users, { fields: [games.refereeUserId], references: [users.id] }),
  scorekeeper: one(users, {
    fields: [games.scorekeeperUserId],
    references: [users.id]
  }),
  stats: many(gameStats)
}));

// server/db.ts
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}
var pool = import_promise.default.createPool({
  uri: connectionString,
  connectionLimit: 10,
  charset: "utf8mb4"
});
var db = (0, import_mysql2.drizzle)(pool, { schema: schema_exports, mode: "default" });

// server/_core/trpc.ts
var import_drizzle_orm2 = require("drizzle-orm");

// server/_core/auth.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_node_crypto = __toESM(require("node:crypto"));
var SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}
var COOKIE_NAME = "mihl_session";
var SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1e3;
async function hashPassword(plain) {
  return import_bcryptjs.default.hash(plain, 12);
}
async function verifyPassword(plain, hash) {
  return import_bcryptjs.default.compare(plain, hash);
}
function sign(payload) {
  return import_node_crypto.default.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}
function createSessionToken(userId) {
  const payload = { userId, issuedAt: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}
function verifySessionToken(token) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const validSig = signature.length === expected.length && import_node_crypto.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!validSig) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8")
    );
    if (Date.now() - payload.issuedAt > SESSION_MAX_AGE_MS) return null;
    return payload.userId;
  } catch {
    return null;
  }
}
function setSessionCookie(res, userId) {
  const token = createSessionToken(userId);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/"
  });
}
function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}
function getUserIdFromRequest(req) {
  const token = req.cookies?.[COOKIE_NAME];
  return verifySessionToken(token);
}
function generateRandomToken() {
  return import_node_crypto.default.randomBytes(32).toString("hex");
}

// server/_core/trpc.ts
async function createContext({
  req,
  res
}) {
  const userId = getUserIdFromRequest(req);
  let user = null;
  if (userId) {
    const [row] = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.id, userId));
    user = row ?? null;
  }
  return { req, res, user };
}
var t = import_server.initTRPC.context().create();
var router = t.router;
var publicProcedure = t.procedure;
var authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new import_server.TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
var adminProcedure = authedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new import_server.TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// server/routers/auth.ts
var import_zod = require("zod");
var import_server2 = require("@trpc/server");
var import_drizzle_orm3 = require("drizzle-orm");

// server/_core/emailService.ts
var import_nodemailer = __toESM(require("nodemailer"));
var SPOND_INVITE_URL = "https://spond.com/invite/XCNVP";
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error(
      "SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables are required"
    );
  }
  return import_nodemailer.default.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}
async function send(to, subject, html, text2) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Menshes Ice Hockey League" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text: text2
  });
}
async function sendApprovalEmail(toEmail, firstName, paymentPlan, paymentStatus) {
  const subject = "You're approved \u2014 join the MIHL Spond group";
  const paymentReminder = paymentStatus === "paid_in_full" ? "" : paymentPlan === "split" ? "\n\nReminder: your first payment ($450) is due by September 11th, and your second payment ($425) is due by December 19th. If you haven't sent your first payment yet, please make sure it's in by September 11th. Payment by e-transfer to payments@mihl.ca." : "\n\nReminder: if you haven't sent your full payment ($850) yet, please make sure it's in by September 11th. Payment by e-transfer to payments@mihl.ca.";
  const paymentReminderHtml = paymentStatus === "paid_in_full" ? "" : paymentPlan === "split" ? `<p><strong>Reminder:</strong> your first payment ($450) is due by <strong>September 11th</strong>, and your second payment ($425) is due by December 19th. If you haven't sent your first payment yet, please make sure it's in by September 11th. Payment by e-transfer to payments@mihl.ca.</p>` : `<p><strong>Reminder:</strong> if you haven't sent your full payment ($850) yet, please make sure it's in by <strong>September 11th</strong>. Payment by e-transfer to payments@mihl.ca.</p>`;
  const text2 = `Hi ${firstName},

You've been approved to play in the Menshes Ice Hockey League 2026-27 season.

Join our Spond group here to see your team, schedule, and roster:
${SPOND_INVITE_URL}

Important: your team placement is temporary and may change until September 19, when rosters are finalized for the season. You'll be notified in Spond of any changes before then.${paymentReminder}

See you on the ice!
MIHL Admin`;
  const html = `
    <p>Hi ${firstName},</p>
    <p>You've been approved to play in the <strong>Menshes Ice Hockey League 2026-27 season</strong>.</p>
    <p>Join our Spond group here to see your team, schedule, and roster:</p>
    <p><a href="${SPOND_INVITE_URL}">${SPOND_INVITE_URL}</a></p>
    <p><strong>Important:</strong> your team placement is temporary and may change until <strong>September 19</strong>, when rosters are finalized for the season. You'll be notified in Spond of any changes before then.</p>
    ${paymentReminderHtml}
    <p>See you on the ice!<br/>MIHL Admin</p>
  `;
  await send(toEmail, subject, html, text2);
}
async function sendRegistrationReceivedEmail(toEmail, firstName, paymentPlan) {
  const subject = "We've got your MIHL registration \u2014 pending approval";
  const paymentLine = paymentPlan === "split" ? "You selected the split payment plan: $450 due by September 11th, and $425 due by December 19th (total $875)." : "You selected full payment: $850, due by September 11th.";
  const text2 = `Hi ${firstName},

Thanks for registering for the Menshes Ice Hockey League 2026-27 season! Your registration is now pending review by league admin.

Once you're approved, you'll receive another email with an invite to join our Spond group, where you'll see your team, schedule, and roster.

${paymentLine} Payment by e-transfer to payments@mihl.ca.

MIHL Admin`;
  const html = `
    <p>Hi ${firstName},</p>
    <p>Thanks for registering for the <strong>Menshes Ice Hockey League 2026-27 season</strong>! Your registration is now pending review by league admin.</p>
    <p>Once you're approved, you'll receive another email with an invite to join our Spond group, where you'll see your team, schedule, and roster.</p>
    <p><strong>${paymentLine}</strong> Payment by e-transfer to payments@mihl.ca.</p>
    <p>MIHL Admin</p>
  `;
  await send(toEmail, subject, html, text2);
}
async function sendWaitlistEmail(toEmail, firstName) {
  const subject = "You've been added to the MIHL waitlist";
  const text2 = `Hi ${firstName},

The league is currently full. You've been added to the waitlist and will be notified by email as soon as a spot opens up.

Thanks for your patience,
MIHL Admin`;
  const html = `
    <p>Hi ${firstName},</p>
    <p>The league is currently full. You've been added to the waitlist and will be notified by email as soon as a spot opens up.</p>
    <p>Thanks for your patience,<br/>MIHL Admin</p>
  `;
  await send(toEmail, subject, html, text2);
}
async function sendStaffApprovalEmail(toEmail, firstName, role) {
  const subject = `You're approved as a ${role} \u2014 MIHL`;
  const text2 = `Hi ${firstName},

You've been approved as a ${role} for the Menshes Ice Hockey League. Log in to the portal to view and claim open game slots for the season.

MIHL Admin`;
  const html = `<p>Hi ${firstName},</p><p>You've been approved as a <strong>${role}</strong> for the Menshes Ice Hockey League. Log in to the portal to view and claim open game slots for the season.</p><p>MIHL Admin</p>`;
  await send(toEmail, subject, html, text2);
}
async function sendSetPasswordEmail(toEmail, firstName, role, token) {
  const baseUrl = process.env.APP_URL ?? "https://mihl.ca";
  const link = `${baseUrl}/set-password?token=${token}`;
  const subject = `You're approved as a ${role} \u2014 set up your MIHL account`;
  const text2 = `Hi ${firstName},

You've been approved as a ${role} for the Menshes Ice Hockey League! We've created your portal account -- just set a password to finish setting it up:

${link}

Once that's done, you'll be able to log in and claim open game slots for the season.

MIHL Admin`;
  const html = `
    <p>Hi ${firstName},</p>
    <p>You've been approved as a <strong>${role}</strong> for the Menshes Ice Hockey League! We've created your portal account &mdash; just set a password to finish setting it up:</p>
    <p><a href="${link}">${link}</a></p>
    <p>Once that's done, you'll be able to log in and claim open game slots for the season.</p>
    <p>MIHL Admin</p>
  `;
  await send(toEmail, subject, html, text2);
}
async function sendPasswordResetEmail(toEmail, firstName, token) {
  const baseUrl = process.env.APP_URL ?? "https://mihl.ca";
  const link = `${baseUrl}/set-password?token=${token}`;
  const subject = "Reset your MIHL password";
  const text2 = `Hi ${firstName},

We received a request to reset your MIHL portal password. Click the link below to choose a new one:

${link}

This link expires in 1 hour. If you didn't request this, you can safely ignore this email -- your password won't change.

MIHL Admin`;
  const html = `
    <p>Hi ${firstName},</p>
    <p>We received a request to reset your MIHL portal password. Click the link below to choose a new one:</p>
    <p><a href="${link}">${link}</a></p>
    <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email &mdash; your password won't change.</p>
    <p>MIHL Admin</p>
  `;
  await send(toEmail, subject, html, text2);
}

// server/routers/auth.ts
var authRouter = router({
  signup: publicProcedure.input(
    import_zod.z.object({
      email: import_zod.z.string().email(),
      password: import_zod.z.string().min(8, "Password must be at least 8 characters"),
      firstName: import_zod.z.string().min(1),
      lastName: import_zod.z.string().min(1),
      phone: import_zod.z.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const existing = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.email, input.email.toLowerCase()));
    if (existing.length > 0) {
      throw new import_server2.TRPCError({
        code: "CONFLICT",
        message: "An account with this email already exists"
      });
    }
    const [approvedStaffApp] = await db.select().from(staffApplications).where(
      (0, import_drizzle_orm3.and)(
        (0, import_drizzle_orm3.eq)(staffApplications.applicantEmail, input.email.toLowerCase()),
        (0, import_drizzle_orm3.eq)(staffApplications.status, "approved")
      )
    );
    const passwordHash = await hashPassword(input.password);
    const [result] = await db.insert(users).values({
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: approvedStaffApp ? "staff" : "player"
    });
    const userId = result.insertId;
    if (approvedStaffApp) {
      await db.update(staffApplications).set({ userId }).where((0, import_drizzle_orm3.eq)(staffApplications.id, approvedStaffApp.id));
    }
    setSessionCookie(ctx.res, userId);
    return { userId };
  }),
  login: publicProcedure.input(import_zod.z.object({ email: import_zod.z.string().email(), password: import_zod.z.string() })).mutation(async ({ input, ctx }) => {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.email, input.email.toLowerCase()));
    if (!user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
    }
    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
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
  setPassword: publicProcedure.input(
    import_zod.z.object({
      token: import_zod.z.string(),
      password: import_zod.z.string().min(8, "Password must be at least 8 characters")
    })
  ).mutation(async ({ input, ctx }) => {
    const [tokenRow] = await db.select().from(passwordSetupTokens).where((0, import_drizzle_orm3.eq)(passwordSetupTokens.token, input.token));
    if (!tokenRow) {
      throw new import_server2.TRPCError({ code: "NOT_FOUND", message: "Invalid or expired link" });
    }
    if (tokenRow.usedAt) {
      throw new import_server2.TRPCError({ code: "CONFLICT", message: "This link has already been used" });
    }
    if (tokenRow.expiresAt < /* @__PURE__ */ new Date()) {
      throw new import_server2.TRPCError({ code: "FORBIDDEN", message: "This link has expired" });
    }
    const passwordHash = await hashPassword(input.password);
    await db.update(users).set({ passwordHash }).where((0, import_drizzle_orm3.eq)(users.id, tokenRow.userId));
    await db.update(passwordSetupTokens).set({ usedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm3.eq)(passwordSetupTokens.id, tokenRow.id));
    setSessionCookie(ctx.res, tokenRow.userId);
    return { success: true };
  }),
  // Request a password reset -- always returns success regardless of
  // whether the email exists, so this can't be used to check who has
  // an account (standard practice).
  requestPasswordReset: publicProcedure.input(import_zod.z.object({ email: import_zod.z.string().email() })).mutation(async ({ input }) => {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.email, input.email.toLowerCase()));
    if (user) {
      const token = generateRandomToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1e3);
      await db.insert(passwordSetupTokens).values({
        userId: user.id,
        token,
        expiresAt
      });
      await sendPasswordResetEmail(user.email, user.firstName, token).catch(
        (err) => console.error("Failed to send password reset email:", err)
      );
    }
    return { success: true };
  })
});

// server/routers/registration.ts
var import_zod2 = require("zod");
var import_server3 = require("@trpc/server");
var import_drizzle_orm4 = require("drizzle-orm");
var registrationRouter = router({
  // Player submits their registration
  submit: authedProcedure.input(
    import_zod2.z.object({
      jerseyNumberPref: import_zod2.z.number().int().min(0).max(99).optional(),
      position: import_zod2.z.enum(["forward", "defense", "goalie"]),
      jerseySize: import_zod2.z.enum(["M", "L", "XL", "XXL", "XXXL"]),
      waiverAccepted: import_zod2.z.literal(true, {
        errorMap: () => ({ message: "You must accept the waiver to register" })
      }),
      paymentPlan: import_zod2.z.enum(["full", "split"])
    })
  ).mutation(async ({ input, ctx }) => {
    const existing = await db.select().from(registrations).where((0, import_drizzle_orm4.eq)(registrations.userId, ctx.user.id));
    if (existing.length > 0) {
      throw new import_server3.TRPCError({
        code: "CONFLICT",
        message: "You have already submitted a registration"
      });
    }
    await db.insert(registrations).values({
      userId: ctx.user.id,
      jerseyNumberPref: input.jerseyNumberPref,
      position: input.position,
      jerseySize: input.jerseySize,
      waiverAccepted: input.waiverAccepted,
      paymentPlan: input.paymentPlan,
      status: "pending"
    });
    await sendRegistrationReceivedEmail(
      ctx.user.email,
      ctx.user.firstName,
      input.paymentPlan
    ).catch(
      (err) => console.error("Failed to send registration received email:", err)
    );
    return { success: true };
  }),
  myRegistration: authedProcedure.query(async ({ ctx }) => {
    const [reg] = await db.select().from(registrations).where((0, import_drizzle_orm4.eq)(registrations.userId, ctx.user.id));
    return reg ?? null;
  }),
  // Admin: list pending registrations
  listPending: adminProcedure.query(async () => {
    return db.select({
      registration: registrations,
      user: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone
      }
    }).from(registrations).innerJoin(users, (0, import_drizzle_orm4.eq)(registrations.userId, users.id)).where((0, import_drizzle_orm4.eq)(registrations.status, "pending"));
  }),
  // Admin: list all registrations (any status), for the admin dashboard
  listAll: adminProcedure.query(async () => {
    return db.select({
      registration: registrations,
      user: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone
      }
    }).from(registrations).innerJoin(users, (0, import_drizzle_orm4.eq)(registrations.userId, users.id));
  }),
  // Admin: approve a registration -> assign temp team + send Spond email
  approve: adminProcedure.input(import_zod2.z.object({ registrationId: import_zod2.z.number(), teamId: import_zod2.z.number() })).mutation(async ({ input, ctx }) => {
    const [reg] = await db.select({ registration: registrations, user: users }).from(registrations).innerJoin(users, (0, import_drizzle_orm4.eq)(registrations.userId, users.id)).where((0, import_drizzle_orm4.eq)(registrations.id, input.registrationId));
    if (!reg) {
      throw new import_server3.TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
    }
    await db.update(registrations).set({
      status: "approved",
      teamId: input.teamId,
      reviewedAt: /* @__PURE__ */ new Date(),
      reviewedByUserId: ctx.user.id,
      spondEmailSentAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm4.eq)(registrations.id, input.registrationId));
    await sendApprovalEmail(
      reg.user.email,
      reg.user.firstName,
      reg.registration.paymentPlan,
      reg.registration.paymentStatus
    ).catch(
      (err) => console.error("Failed to send approval email:", err)
    );
    return { success: true };
  }),
  // Admin: waitlist a registration -> automatic waitlist email
  waitlist: adminProcedure.input(import_zod2.z.object({ registrationId: import_zod2.z.number() })).mutation(async ({ input, ctx }) => {
    const [reg] = await db.select({ registration: registrations, user: users }).from(registrations).innerJoin(users, (0, import_drizzle_orm4.eq)(registrations.userId, users.id)).where((0, import_drizzle_orm4.eq)(registrations.id, input.registrationId));
    if (!reg) {
      throw new import_server3.TRPCError({ code: "NOT_FOUND", message: "Registration not found" });
    }
    await db.update(registrations).set({
      status: "waitlisted",
      reviewedAt: /* @__PURE__ */ new Date(),
      reviewedByUserId: ctx.user.id
    }).where((0, import_drizzle_orm4.eq)(registrations.id, input.registrationId));
    await sendWaitlistEmail(reg.user.email, reg.user.firstName).catch(
      (err) => console.error("Failed to send waitlist email:", err)
    );
    return { success: true };
  }),
  // Admin: move a player between (still-provisional) teams
  reassignTeam: adminProcedure.input(import_zod2.z.object({ registrationId: import_zod2.z.number(), teamId: import_zod2.z.number() })).mutation(async ({ input }) => {
    await db.update(registrations).set({ teamId: input.teamId }).where((0, import_drizzle_orm4.eq)(registrations.id, input.registrationId));
    return { success: true };
  }),
  // Admin: update bookkeeping-only payment status
  updatePaymentStatus: adminProcedure.input(
    import_zod2.z.object({
      registrationId: import_zod2.z.number(),
      paymentStatus: import_zod2.z.enum(["unpaid", "deposit_paid", "paid_in_full"])
    })
  ).mutation(async ({ input }) => {
    await db.update(registrations).set({ paymentStatus: input.paymentStatus }).where((0, import_drizzle_orm4.eq)(registrations.id, input.registrationId));
    return { success: true };
  })
});

// server/routers/staff.ts
var import_zod3 = require("zod");
var import_server4 = require("@trpc/server");
var import_drizzle_orm5 = require("drizzle-orm");
var import_node_crypto2 = __toESM(require("node:crypto"));
var staffRouter = router({
  // Anyone applies to be a referee or scorekeeper -- no login required.
  // If they're already logged in, we link the application to their account;
  // otherwise we just record their contact info and link it later when they sign up.
  publicApply: publicProcedure.input(
    import_zod3.z.object({
      firstName: import_zod3.z.string().min(1),
      lastName: import_zod3.z.string().min(1),
      email: import_zod3.z.string().email(),
      phone: import_zod3.z.string().optional(),
      role: import_zod3.z.enum(["referee", "scorekeeper"])
    })
  ).mutation(async ({ input, ctx }) => {
    const existing = await db.select().from(staffApplications).where(
      (0, import_drizzle_orm5.and)(
        (0, import_drizzle_orm5.eq)(staffApplications.applicantEmail, input.email.toLowerCase()),
        (0, import_drizzle_orm5.eq)(staffApplications.role, input.role)
      )
    );
    if (existing.length > 0) {
      throw new import_server4.TRPCError({
        code: "CONFLICT",
        message: "You have already applied for this role"
      });
    }
    await db.insert(staffApplications).values({
      userId: ctx.user?.id,
      applicantEmail: input.email.toLowerCase(),
      applicantFirstName: input.firstName,
      applicantLastName: input.lastName,
      applicantPhone: input.phone,
      role: input.role,
      status: "pending"
    });
    return { success: true };
  }),
  myApplications: authedProcedure.query(async ({ ctx }) => {
    return db.select().from(staffApplications).where((0, import_drizzle_orm5.eq)(staffApplications.userId, ctx.user.id));
  }),
  // Admin: list pending staff applications (applicant may or may not have an account yet)
  listPending: adminProcedure.query(async () => {
    const rows = await db.select({ application: staffApplications, user: users }).from(staffApplications).leftJoin(users, (0, import_drizzle_orm5.eq)(staffApplications.userId, users.id)).where((0, import_drizzle_orm5.eq)(staffApplications.status, "pending"));
    return rows.map(({ application, user }) => ({
      application,
      displayName: user ? `${user.firstName} ${user.lastName}` : `${application.applicantFirstName} ${application.applicantLastName}`,
      email: user?.email ?? application.applicantEmail ?? ""
    }));
  }),
  // Admin: approve a referee/scorekeeper application
  approve: adminProcedure.input(import_zod3.z.object({ applicationId: import_zod3.z.number() })).mutation(async ({ input, ctx }) => {
    const [application] = await db.select().from(staffApplications).where((0, import_drizzle_orm5.eq)(staffApplications.id, input.applicationId));
    if (!application) {
      throw new import_server4.TRPCError({ code: "NOT_FOUND", message: "Application not found" });
    }
    await db.update(staffApplications).set({
      status: "approved",
      reviewedAt: /* @__PURE__ */ new Date(),
      reviewedByUserId: ctx.user.id
    }).where((0, import_drizzle_orm5.eq)(staffApplications.id, input.applicationId));
    let linkedUser = application.userId ? (await db.select().from(users).where((0, import_drizzle_orm5.eq)(users.id, application.userId)))[0] : void 0;
    if (!linkedUser && application.applicantEmail) {
      linkedUser = (await db.select().from(users).where((0, import_drizzle_orm5.eq)(users.email, application.applicantEmail)))[0];
      if (linkedUser) {
        await db.update(staffApplications).set({ userId: linkedUser.id }).where((0, import_drizzle_orm5.eq)(staffApplications.id, input.applicationId));
      }
    }
    if (linkedUser) {
      await db.update(users).set({ role: "staff" }).where((0, import_drizzle_orm5.eq)(users.id, linkedUser.id));
      try {
        await sendStaffApprovalEmail(linkedUser.email, linkedUser.firstName, application.role);
      } catch (err) {
        console.error("Failed to send staff approval email:", err);
      }
    } else if (application.applicantEmail && application.applicantFirstName && application.applicantLastName) {
      const randomPasswordHash = await hashPassword(import_node_crypto2.default.randomBytes(32).toString("hex"));
      const [result] = await db.insert(users).values({
        email: application.applicantEmail,
        passwordHash: randomPasswordHash,
        firstName: application.applicantFirstName,
        lastName: application.applicantLastName,
        phone: application.applicantPhone ?? void 0,
        role: "staff"
      });
      const newUserId = result.insertId;
      await db.update(staffApplications).set({ userId: newUserId }).where((0, import_drizzle_orm5.eq)(staffApplications.id, input.applicationId));
      const token = generateRandomToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
      await db.insert(passwordSetupTokens).values({
        userId: newUserId,
        token,
        expiresAt
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
      throw new import_server4.TRPCError({ code: "FORBIDDEN", message: "Approved staff access required" });
    }
    return db.select().from(games).where(
      (0, import_drizzle_orm5.or)((0, import_drizzle_orm5.isNull)(games.refereeUserId), (0, import_drizzle_orm5.isNull)(games.scorekeeperUserId))
    );
  }),
  // Approved staff: claim a referee or scorekeeper slot on a game
  claimSlot: authedProcedure.input(import_zod3.z.object({ gameId: import_zod3.z.number(), slot: import_zod3.z.enum(["referee", "scorekeeper"]) })).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "staff" && ctx.user.role !== "admin") {
      throw new import_server4.TRPCError({ code: "FORBIDDEN", message: "Approved staff access required" });
    }
    const [game] = await db.select().from(games).where((0, import_drizzle_orm5.eq)(games.id, input.gameId));
    if (!game) {
      throw new import_server4.TRPCError({ code: "NOT_FOUND", message: "Game not found" });
    }
    if (input.slot === "referee") {
      if (game.refereeUserId) {
        throw new import_server4.TRPCError({ code: "CONFLICT", message: "Referee slot already claimed" });
      }
      await db.update(games).set({ refereeUserId: ctx.user.id }).where((0, import_drizzle_orm5.eq)(games.id, input.gameId));
    } else {
      if (game.scorekeeperUserId) {
        throw new import_server4.TRPCError({ code: "CONFLICT", message: "Scorekeeper slot already claimed" });
      }
      await db.update(games).set({ scorekeeperUserId: ctx.user.id }).where((0, import_drizzle_orm5.eq)(games.id, input.gameId));
    }
    return { success: true };
  }),
  // Approved staff: release a slot they previously claimed
  releaseSlot: authedProcedure.input(import_zod3.z.object({ gameId: import_zod3.z.number(), slot: import_zod3.z.enum(["referee", "scorekeeper"]) })).mutation(async ({ input, ctx }) => {
    const [game] = await db.select().from(games).where((0, import_drizzle_orm5.eq)(games.id, input.gameId));
    if (!game) throw new import_server4.TRPCError({ code: "NOT_FOUND" });
    const ownsSlot = input.slot === "referee" && game.refereeUserId === ctx.user.id || input.slot === "scorekeeper" && game.scorekeeperUserId === ctx.user.id;
    if (!ownsSlot && ctx.user.role !== "admin") {
      throw new import_server4.TRPCError({ code: "FORBIDDEN" });
    }
    if (input.slot === "referee") {
      await db.update(games).set({ refereeUserId: null }).where((0, import_drizzle_orm5.eq)(games.id, input.gameId));
    } else {
      await db.update(games).set({ scorekeeperUserId: null }).where((0, import_drizzle_orm5.eq)(games.id, input.gameId));
    }
    return { success: true };
  })
});

// server/routers/games.ts
var import_zod4 = require("zod");
var import_server5 = require("@trpc/server");
var import_drizzle_orm6 = require("drizzle-orm");
var gamesRouter = router({
  // Public: full season schedule
  schedule: publicProcedure.query(async () => {
    const rows = await db.select({ game: games, venue: venues }).from(games).innerJoin(venues, (0, import_drizzle_orm6.eq)(games.venueId, venues.id)).orderBy(games.gameDate, games.venueId);
    const allTeams = await db.select().from(teams);
    const teamById = new Map(allTeams.map((t2) => [t2.id, t2]));
    return rows.map(({ game, venue }) => ({
      game,
      venue,
      homeTeam: game.homeTeamId ? teamById.get(game.homeTeamId) ?? null : null,
      awayTeam: game.awayTeamId ? teamById.get(game.awayTeamId) ?? null : null
    }));
  }),
  // Public: standings, computed from final games (2 pts win / 1 pt tie / 0 pts loss, no OT)
  standings: publicProcedure.query(async () => {
    const allTeams = await db.select().from(teams);
    const finalGames = await db.select().from(games).where((0, import_drizzle_orm6.eq)(games.status, "final"));
    const table = /* @__PURE__ */ new Map();
    for (const team of allTeams) {
      table.set(team.id, { teamId: team.id, gp: 0, w: 0, l: 0, t: 0, pts: 0, gf: 0, ga: 0 });
    }
    for (const g of finalGames) {
      if (!g.homeTeamId || !g.awayTeamId || g.homeScore === null || g.awayScore === null) continue;
      const home = table.get(g.homeTeamId);
      const away = table.get(g.awayTeamId);
      if (!home || !away) continue;
      home.gp += 1;
      away.gp += 1;
      home.gf += g.homeScore;
      home.ga += g.awayScore;
      away.gf += g.awayScore;
      away.ga += g.homeScore;
      if (g.homeScore > g.awayScore) {
        home.w += 1;
        home.pts += 2;
        away.l += 1;
      } else if (g.awayScore > g.homeScore) {
        away.w += 1;
        away.pts += 2;
        home.l += 1;
      } else {
        home.t += 1;
        away.t += 1;
        home.pts += 1;
        away.pts += 1;
      }
    }
    const rows = Array.from(table.values()).map((row) => ({
      ...row,
      team: allTeams.find((t2) => t2.id === row.teamId)
    }));
    rows.sort((a, b) => b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga));
    return rows;
  }),
  // Public: league leaders (goals, assists, points)
  leaders: publicProcedure.query(async () => {
    const allStats = await db.select({ stats: gameStats, player: users }).from(gameStats).innerJoin(users, (0, import_drizzle_orm6.eq)(gameStats.playerUserId, users.id));
    const byPlayer = /* @__PURE__ */ new Map();
    for (const row of allStats) {
      const existing = byPlayer.get(row.player.id) ?? {
        userId: row.player.id,
        name: `${row.player.firstName} ${row.player.lastName}`,
        goals: 0,
        assists: 0,
        points: 0,
        pim: 0
      };
      existing.goals += row.stats.goals;
      existing.assists += row.stats.assists;
      existing.points += row.stats.goals + row.stats.assists;
      existing.pim += row.stats.penaltyMinutes;
      byPlayer.set(row.player.id, existing);
    }
    return Array.from(byPlayer.values()).sort((a, b) => b.points - a.points);
  }),
  // Public: skater leaders broken out per team, for the Stats page team tabs
  teamLeaders: publicProcedure.query(async () => {
    const allStats = await db.select({ stats: gameStats, player: users, teamId: gameStats.teamId }).from(gameStats).innerJoin(users, (0, import_drizzle_orm6.eq)(gameStats.playerUserId, users.id));
    const byTeamPlayer = /* @__PURE__ */ new Map();
    for (const row of allStats) {
      const key = `${row.teamId}-${row.player.id}`;
      const existing = byTeamPlayer.get(key) ?? {
        userId: row.player.id,
        teamId: row.teamId,
        name: `${row.player.firstName} ${row.player.lastName}`,
        goals: 0,
        assists: 0,
        points: 0,
        pim: 0
      };
      existing.goals += row.stats.goals;
      existing.assists += row.stats.assists;
      existing.points += row.stats.goals + row.stats.assists;
      existing.pim += row.stats.penaltyMinutes;
      byTeamPlayer.set(key, existing);
    }
    const allTeams = await db.select().from(teams);
    const byTeam = allTeams.map((team) => ({
      team,
      leaders: Array.from(byTeamPlayer.values()).filter((p) => p.teamId === team.id).sort((a, b) => b.points - a.points)
    }));
    return byTeam;
  }),
  // Public: goalie leaders -- saves, shots against, save percentage
  goalieLeaders: publicProcedure.query(async () => {
    const goalieStats = await db.select({ stats: gameStats, player: users }).from(gameStats).innerJoin(users, (0, import_drizzle_orm6.eq)(gameStats.playerUserId, users.id));
    const byGoalie = /* @__PURE__ */ new Map();
    for (const row of goalieStats) {
      if (row.stats.saves == null && row.stats.shotsAgainst == null) continue;
      const existing = byGoalie.get(row.player.id) ?? {
        userId: row.player.id,
        name: `${row.player.firstName} ${row.player.lastName}`,
        saves: 0,
        shotsAgainst: 0
      };
      existing.saves += row.stats.saves ?? 0;
      existing.shotsAgainst += row.stats.shotsAgainst ?? 0;
      byGoalie.set(row.player.id, existing);
    }
    return Array.from(byGoalie.values()).map((g) => ({
      ...g,
      savePct: g.shotsAgainst > 0 ? g.saves / g.shotsAgainst : null
    })).sort((a, b) => (b.savePct ?? 0) - (a.savePct ?? 0));
  }),
  // Scorekeeper (assigned to this game) or admin: enter live stats
  recordStat: authedProcedure.input(
    import_zod4.z.object({
      gameId: import_zod4.z.number(),
      playerUserId: import_zod4.z.number(),
      teamId: import_zod4.z.number(),
      goals: import_zod4.z.number().int().min(0).default(0),
      assists: import_zod4.z.number().int().min(0).default(0),
      penaltyMinutes: import_zod4.z.number().int().min(0).default(0),
      shotsAgainst: import_zod4.z.number().int().min(0).optional(),
      saves: import_zod4.z.number().int().min(0).optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const [game] = await db.select().from(games).where((0, import_drizzle_orm6.eq)(games.id, input.gameId));
    if (!game) throw new import_server5.TRPCError({ code: "NOT_FOUND", message: "Game not found" });
    const isAssignedScorekeeper = game.scorekeeperUserId === ctx.user.id;
    if (!isAssignedScorekeeper && ctx.user.role !== "admin") {
      throw new import_server5.TRPCError({
        code: "FORBIDDEN",
        message: "Only the assigned scorekeeper or an admin can enter stats for this game"
      });
    }
    const [existing] = await db.select().from(gameStats).where(
      (0, import_drizzle_orm6.and)(
        (0, import_drizzle_orm6.eq)(gameStats.gameId, input.gameId),
        (0, import_drizzle_orm6.eq)(gameStats.playerUserId, input.playerUserId)
      )
    );
    if (existing) {
      await db.update(gameStats).set({
        goals: input.goals,
        assists: input.assists,
        penaltyMinutes: input.penaltyMinutes,
        shotsAgainst: input.shotsAgainst,
        saves: input.saves
      }).where((0, import_drizzle_orm6.eq)(gameStats.id, existing.id));
    } else {
      await db.insert(gameStats).values({
        gameId: input.gameId,
        playerUserId: input.playerUserId,
        teamId: input.teamId,
        goals: input.goals,
        assists: input.assists,
        penaltyMinutes: input.penaltyMinutes,
        shotsAgainst: input.shotsAgainst,
        saves: input.saves
      });
    }
    return { success: true };
  }),
  // Scorekeeper or admin: finalize a game score
  finalizeScore: authedProcedure.input(import_zod4.z.object({ gameId: import_zod4.z.number(), homeScore: import_zod4.z.number().int(), awayScore: import_zod4.z.number().int() })).mutation(async ({ input, ctx }) => {
    const [game] = await db.select().from(games).where((0, import_drizzle_orm6.eq)(games.id, input.gameId));
    if (!game) throw new import_server5.TRPCError({ code: "NOT_FOUND" });
    const isAssignedScorekeeper = game.scorekeeperUserId === ctx.user.id;
    if (!isAssignedScorekeeper && ctx.user.role !== "admin") {
      throw new import_server5.TRPCError({ code: "FORBIDDEN" });
    }
    await db.update(games).set({ homeScore: input.homeScore, awayScore: input.awayScore, status: "final" }).where((0, import_drizzle_orm6.eq)(games.id, input.gameId));
    return { success: true };
  }),
  // Admin: assign home/away teams to a slot once known
  assignTeams: adminProcedure.input(import_zod4.z.object({ gameId: import_zod4.z.number(), homeTeamId: import_zod4.z.number(), awayTeamId: import_zod4.z.number() })).mutation(async ({ input }) => {
    await db.update(games).set({ homeTeamId: input.homeTeamId, awayTeamId: input.awayTeamId }).where((0, import_drizzle_orm6.eq)(games.id, input.gameId));
    return { success: true };
  })
});

// server/routers/content.ts
var import_zod5 = require("zod");
var import_drizzle_orm7 = require("drizzle-orm");
var contentRouter = router({
  // Public: published news posts, newest first
  newsFeed: publicProcedure.query(async () => {
    return db.select().from(newsPosts).where((0, import_drizzle_orm7.eq)(newsPosts.status, "published")).orderBy((0, import_drizzle_orm7.desc)(newsPosts.publishedAt));
  }),
  // Public: a single published post by id
  newsPost: publicProcedure.input(import_zod5.z.object({ id: import_zod5.z.number() })).query(async ({ input }) => {
    const [post] = await db.select().from(newsPosts).where((0, import_drizzle_orm7.and)((0, import_drizzle_orm7.eq)(newsPosts.id, input.id), (0, import_drizzle_orm7.eq)(newsPosts.status, "published")));
    return post ?? null;
  }),
  // Public: most recent approved Stars of the Week
  currentStars: publicProcedure.query(async () => {
    return db.select({
      star: starsOfWeek,
      player: { id: users.id, firstName: users.firstName, lastName: users.lastName },
      team: teams
    }).from(starsOfWeek).innerJoin(users, (0, import_drizzle_orm7.eq)(starsOfWeek.playerUserId, users.id)).leftJoin(teams, (0, import_drizzle_orm7.eq)(starsOfWeek.teamId, teams.id)).where((0, import_drizzle_orm7.eq)(starsOfWeek.status, "approved")).orderBy((0, import_drizzle_orm7.desc)(starsOfWeek.weekStartDate));
  }),
  // Admin: list draft posts awaiting review (auto-generated weekly recap, etc.)
  listDraftPosts: adminProcedure.query(async () => {
    return db.select().from(newsPosts).where((0, import_drizzle_orm7.eq)(newsPosts.status, "draft"));
  }),
  // Admin: publish a draft post as-is or after light editing
  publishPost: adminProcedure.input(import_zod5.z.object({ postId: import_zod5.z.number(), title: import_zod5.z.string().optional(), bodyHtml: import_zod5.z.string().optional() })).mutation(async ({ input }) => {
    await db.update(newsPosts).set({
      ...input.title ? { title: input.title } : {},
      ...input.bodyHtml ? { bodyHtml: input.bodyHtml } : {},
      status: "published",
      publishedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm7.eq)(newsPosts.id, input.postId));
    return { success: true };
  }),
  // Admin: create a manual post directly
  createPost: adminProcedure.input(import_zod5.z.object({ title: import_zod5.z.string(), bodyHtml: import_zod5.z.string(), publishNow: import_zod5.z.boolean() })).mutation(async ({ input, ctx }) => {
    await db.insert(newsPosts).values({
      title: input.title,
      bodyHtml: input.bodyHtml,
      isAutoGenerated: false,
      status: input.publishNow ? "published" : "draft",
      publishedAt: input.publishNow ? /* @__PURE__ */ new Date() : void 0,
      authorUserId: ctx.user.id
    });
    return { success: true };
  }),
  // Admin: this week's draft Stars of the Week pick, awaiting approval/edit
  draftStars: adminProcedure.query(async () => {
    return db.select({
      star: starsOfWeek,
      player: { id: users.id, firstName: users.firstName, lastName: users.lastName },
      team: teams
    }).from(starsOfWeek).innerJoin(users, (0, import_drizzle_orm7.eq)(starsOfWeek.playerUserId, users.id)).leftJoin(teams, (0, import_drizzle_orm7.eq)(starsOfWeek.teamId, teams.id)).where((0, import_drizzle_orm7.eq)(starsOfWeek.status, "draft"));
  }),
  // Admin: change the auto-picked player before approving
  changeStarPlayer: adminProcedure.input(import_zod5.z.object({ starId: import_zod5.z.number(), playerUserId: import_zod5.z.number(), teamId: import_zod5.z.number().optional() })).mutation(async ({ input }) => {
    await db.update(starsOfWeek).set({ playerUserId: input.playerUserId, teamId: input.teamId }).where((0, import_drizzle_orm7.eq)(starsOfWeek.id, input.starId));
    return { success: true };
  }),
  // Admin: approve (1-click) the draft Stars of the Week post
  approveStars: adminProcedure.input(import_zod5.z.object({ starId: import_zod5.z.number() })).mutation(async ({ input, ctx }) => {
    await db.update(starsOfWeek).set({ status: "approved", approvedAt: /* @__PURE__ */ new Date(), approvedByUserId: ctx.user.id }).where((0, import_drizzle_orm7.eq)(starsOfWeek.id, input.starId));
    return { success: true };
  })
});

// server/routers/adminUsers.ts
var import_zod6 = require("zod");
var import_drizzle_orm8 = require("drizzle-orm");
var adminUsersRouter = router({
  listAdmins: adminProcedure.query(async () => {
    return db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      createdAt: users.createdAt
    }).from(users).where((0, import_drizzle_orm8.eq)(users.role, "admin"));
  }),
  promoteToAdmin: adminProcedure.input(import_zod6.z.object({ email: import_zod6.z.string().email() })).mutation(async ({ input }) => {
    await db.update(users).set({ role: "admin" }).where((0, import_drizzle_orm8.eq)(users.email, input.email.toLowerCase()));
    return { success: true };
  })
});

// server/routers/roster.ts
var import_zod7 = require("zod");
var import_drizzle_orm9 = require("drizzle-orm");
var rosterRouter = router({
  // For a given game, list approved players on either team (home/away),
  // plus any stats already recorded this game, so the scorekeeper can enter live.
  forGame: authedProcedure.input(import_zod7.z.object({ gameId: import_zod7.z.number() })).query(async ({ input }) => {
    const [game] = await db.select().from(games).where((0, import_drizzle_orm9.eq)(games.id, input.gameId));
    if (!game) return { game: null, roster: [], existingStats: [] };
    const teamIds = [game.homeTeamId, game.awayTeamId].filter(
      (id) => id != null
    );
    const roster = teamIds.length === 0 ? [] : await db.select({
      registration: registrations,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName
      }
    }).from(registrations).innerJoin(users, (0, import_drizzle_orm9.eq)(registrations.userId, users.id)).where(
      (0, import_drizzle_orm9.or)(...teamIds.map((id) => (0, import_drizzle_orm9.eq)(registrations.teamId, id)))
    );
    const existingStats = await db.select().from(gameStats).where((0, import_drizzle_orm9.eq)(gameStats.gameId, input.gameId));
    return { game, roster, existingStats };
  })
});

// server/_core/appRouter.ts
var appRouter = router({
  auth: authRouter,
  registration: registrationRouter,
  staff: staffRouter,
  games: gamesRouter,
  content: contentRouter,
  adminUsers: adminUsersRouter,
  roster: rosterRouter
});

// server/_core/index.ts
var app = (0, import_express.default)();
var PORT = process.env.PORT ?? 3e3;
app.use(import_express.default.json());
app.use((0, import_cookie_parser.default)());
app.use(
  "/trpc",
  (0, import_express2.createExpressMiddleware)({
    router: appRouter,
    createContext
  })
);
var clientDist = import_node_path.default.resolve(__dirname, "public");
app.use(import_express.default.static(clientDist));
app.get("*", (req, res) => {
  res.sendFile(import_node_path.default.join(clientDist, "index.html"));
});
app.listen(PORT, () => {
  console.log(`MIHL portal server running on port ${PORT}`);
});
