import "dotenv/config";
import { db, pool } from "../db";
import { teams, venues, games } from "../../shared/schema";

// Full season schedule as given: Sep 19 - Apr 17, Saturday nights, 9:30-10:50 PM
const SEASON_DATES = [
  "2026-09-19",
  "2026-10-10", "2026-10-17", "2026-10-24", "2026-10-31",
  "2026-11-07", "2026-11-14", "2026-11-21", "2026-11-28",
  "2026-12-05", "2026-12-12", "2026-12-19",
  "2027-01-09", "2027-01-16", "2027-01-23",
  "2027-02-06", "2027-02-13", "2027-02-20",
  "2027-03-06", "2027-03-13", "2027-03-20", "2027-03-27",
  "2027-04-03", "2027-04-10", "2027-04-17",
];

async function seed() {
  console.log(`Seeding ${SEASON_DATES.length} game nights x 2 rinks = ${SEASON_DATES.length * 2} game slots`);

  // 1. Teams
  const teamRows = [
    { name: "Iron Lions", logoUrl: "/logos/iron-lions.png" },
    { name: "Golan Guards", logoUrl: "/logos/golan-guards.png" },
    { name: "H Hammers", logoUrl: "/logos/h-hammers.png" },
    { name: "Schvitz Saints", logoUrl: "/logos/schvitz-saints.png" },
  ];
  await db.insert(teams).values(teamRows);
  console.log(`- Inserted ${teamRows.length} teams`);

  // 2. Venues
  const venueRows = [
    { name: "Samuel Moscovitch Arena" },
    { name: "Memorial Rink (Montreal West)" },
  ];
  await db.insert(venues).values(venueRows);
  const insertedVenues = await db.select().from(venues);
  console.log(`- Inserted ${venueRows.length} venues`);

  // 3. Game slots — 2 per date, one per rink, teams unassigned until scheduled
  const gameRows = SEASON_DATES.flatMap((date) =>
    insertedVenues.map((venue) => ({
      gameDate: new Date(date),
      gameTime: "21:30:00",
      venueId: venue.id,
      status: "scheduled" as const,
    }))
  );
  await db.insert(games).values(gameRows);
  console.log(`- Inserted ${gameRows.length} game slots`);

  console.log("Seed complete.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
