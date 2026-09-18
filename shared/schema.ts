import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
  mysqlEnum,
  text,
  date,
  time,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// ---------- USERS (players, refs/scorekeepers, admins) ----------
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  role: mysqlEnum("role", ["player", "staff", "admin"]).notNull().default("player"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- TEAMS ----------
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  isFinal: boolean("is_final").default(false).notNull(), // locked after Sep 19
});

// ---------- VENUES ----------
export const venues = mysqlTable("venues", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(), // "Samuel Moscovitch Arena" / "Memorial Rink"
  address: varchar("address", { length: 255 }),
});

// ---------- PLAYER REGISTRATIONS ----------
export const registrations = mysqlTable("registrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  jerseyNumberPref: int("jersey_number_pref"),
  position: mysqlEnum("position", ["forward", "defense", "goalie"]).notNull(),
  jerseySize: mysqlEnum("jersey_size", ["M", "L", "XL", "XXL", "XXXL"]).notNull(),
  waiverAccepted: boolean("waiver_accepted").notNull().default(false),
  paymentPlan: mysqlEnum("payment_plan", ["full", "split"]).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "waitlisted", "rejected"])
    .notNull()
    .default("pending"),
  teamId: int("team_id").references(() => teams.id), // temporary/provisional until locked
  paymentStatus: mysqlEnum("payment_status", [
    "unpaid",
    "deposit_paid",
    "paid_in_full",
  ])
    .notNull()
    .default("unpaid"),
  spondEmailSentAt: timestamp("spond_email_sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedByUserId: int("reviewed_by_user_id").references(() => users.id),
});

// ---------- REFEREE / SCOREKEEPER APPLICATIONS ----------
export const staffApplications = mysqlTable("staff_applications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id), // null until they create/link an account
  applicantEmail: varchar("applicant_email", { length: 255 }),
  applicantFirstName: varchar("applicant_first_name", { length: 100 }),
  applicantLastName: varchar("applicant_last_name", { length: 100 }),
  applicantPhone: varchar("applicant_phone", { length: 30 }),
  role: mysqlEnum("staff_role", ["referee", "scorekeeper"]).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"])
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedByUserId: int("reviewed_by_user_id").references(() => users.id),
});

// ---------- GAMES ----------
export const games = mysqlTable("games", {
  id: int("id").autoincrement().primaryKey(),
  gameDate: date("game_date").notNull(),
  gameTime: time("game_time").notNull(), // 9:30 PM
  venueId: int("venue_id").notNull().references(() => venues.id),
  homeTeamId: int("home_team_id").references(() => teams.id),
  awayTeamId: int("away_team_id").references(() => teams.id),
  homeScore: int("home_score"),
  awayScore: int("away_score"),
  status: mysqlEnum("status", ["scheduled", "final", "cancelled"])
    .notNull()
    .default("scheduled"),
  label: varchar("label", { length: 100 }), // e.g. "Championship Game", "3rd Place Game"
  refereeUserId: int("referee_user_id").references(() => users.id),
  scorekeeperUserId: int("scorekeeper_user_id").references(() => users.id),
});

// ---------- GAME STATS (per player, per game) ----------
export const gameStats = mysqlTable("game_stats", {
  id: int("id").autoincrement().primaryKey(),
  gameId: int("game_id").notNull().references(() => games.id),
  playerUserId: int("player_user_id").notNull().references(() => users.id),
  teamId: int("team_id").notNull().references(() => teams.id),
  goals: int("goals").notNull().default(0),
  assists: int("assists").notNull().default(0),
  penaltyMinutes: int("penalty_minutes").notNull().default(0),
  shotsAgainst: int("shots_against"), // goalies only
  saves: int("saves"), // goalies only
});

// ---------- NEWS / BLOG POSTS ----------
export const newsPosts = mysqlTable("news_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  bodyHtml: text("body_html").notNull(),
  isAutoGenerated: boolean("is_auto_generated").notNull().default(false),
  status: mysqlEnum("status", ["draft", "published"]).notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
  authorUserId: int("author_user_id").references(() => users.id),
});

// ---------- STARS OF THE WEEK ----------
export const starsOfWeek = mysqlTable("stars_of_week", {
  id: int("id").autoincrement().primaryKey(),
  weekStartDate: date("week_start_date").notNull(),
  playerUserId: int("player_user_id").notNull().references(() => users.id),
  teamId: int("team_id").references(() => teams.id),
  note: varchar("note", { length: 500 }), // e.g. "3 goals, 2 assists this week"
  status: mysqlEnum("status", ["draft", "approved"]).notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  approvedByUserId: int("approved_by_user_id").references(() => users.id),
});

// ---------- PASSWORD SETUP TOKENS (for auto-created staff accounts) ----------
export const passwordSetupTokens = mysqlTable("password_setup_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- RELATIONS ----------
export const usersRelations = relations(users, ({ many }) => ({
  registrations: many(registrations),
  staffApplications: many(staffApplications),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  registrations: many(registrations),
  homeGames: many(games, { relationName: "homeTeam" }),
  awayGames: many(games, { relationName: "awayTeam" }),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  venue: one(venues, { fields: [games.venueId], references: [venues.id] }),
  homeTeam: one(teams, {
    fields: [games.homeTeamId],
    references: [teams.id],
    relationName: "homeTeam",
  }),
  awayTeam: one(teams, {
    fields: [games.awayTeamId],
    references: [teams.id],
    relationName: "awayTeam",
  }),
  referee: one(users, { fields: [games.refereeUserId], references: [users.id] }),
  scorekeeper: one(users, {
    fields: [games.scorekeeperUserId],
    references: [users.id],
  }),
  stats: many(gameStats),
}));
