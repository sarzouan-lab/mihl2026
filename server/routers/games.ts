import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, authedProcedure, adminProcedure } from "../_core/trpc";
import { db } from "../db";
import { games, gameStats, teams, users, venues } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

export const gamesRouter = router({
  // Public: full season schedule
  schedule: publicProcedure.query(async () => {
    const rows = await db
      .select({ game: games, venue: venues })
      .from(games)
      .innerJoin(venues, eq(games.venueId, venues.id))
      .orderBy(games.gameDate, games.venueId);

    const allTeams = await db.select().from(teams);
    const teamById = new Map(allTeams.map((t) => [t.id, t]));

    return rows.map(({ game, venue }) => ({
      game,
      venue,
      homeTeam: game.homeTeamId ? teamById.get(game.homeTeamId) ?? null : null,
      awayTeam: game.awayTeamId ? teamById.get(game.awayTeamId) ?? null : null,
    }));
  }),

  // Public: standings, computed from final games (2 pts win / 1 pt tie / 0 pts loss, no OT)
  standings: publicProcedure.query(async () => {
    const allTeams = await db.select().from(teams);
    const finalGames = await db
      .select()
      .from(games)
      .where(eq(games.status, "final"));

    const table = new Map<
      number,
      { teamId: number; gp: number; w: number; l: number; t: number; pts: number; gf: number; ga: number }
    >();
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
      team: allTeams.find((t) => t.id === row.teamId)!,
    }));
    rows.sort((a, b) => b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga));
    return rows;
  }),

  // Public: league leaders (goals, assists, points)
  leaders: publicProcedure.query(async () => {
    const allStats = await db
      .select({ stats: gameStats, player: users })
      .from(gameStats)
      .innerJoin(users, eq(gameStats.playerUserId, users.id));

    const byPlayer = new Map<
      number,
      { userId: number; name: string; goals: number; assists: number; points: number; pim: number }
    >();

    for (const row of allStats) {
      const existing = byPlayer.get(row.player.id) ?? {
        userId: row.player.id,
        name: `${row.player.firstName} ${row.player.lastName}`,
        goals: 0,
        assists: 0,
        points: 0,
        pim: 0,
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
    const allStats = await db
      .select({ stats: gameStats, player: users, teamId: gameStats.teamId })
      .from(gameStats)
      .innerJoin(users, eq(gameStats.playerUserId, users.id));

    const byTeamPlayer = new Map<
      string,
      {
        userId: number;
        teamId: number;
        name: string;
        goals: number;
        assists: number;
        points: number;
        pim: number;
      }
    >();

    for (const row of allStats) {
      const key = `${row.teamId}-${row.player.id}`;
      const existing = byTeamPlayer.get(key) ?? {
        userId: row.player.id,
        teamId: row.teamId,
        name: `${row.player.firstName} ${row.player.lastName}`,
        goals: 0,
        assists: 0,
        points: 0,
        pim: 0,
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
      leaders: Array.from(byTeamPlayer.values())
        .filter((p) => p.teamId === team.id)
        .sort((a, b) => b.points - a.points),
    }));
    return byTeam;
  }),

  // Public: goalie leaders -- saves, shots against, save percentage
  goalieLeaders: publicProcedure.query(async () => {
    const goalieStats = await db
      .select({ stats: gameStats, player: users })
      .from(gameStats)
      .innerJoin(users, eq(gameStats.playerUserId, users.id));

    const byGoalie = new Map<
      number,
      { userId: number; name: string; saves: number; shotsAgainst: number }
    >();

    for (const row of goalieStats) {
      if (row.stats.saves == null && row.stats.shotsAgainst == null) continue;
      const existing = byGoalie.get(row.player.id) ?? {
        userId: row.player.id,
        name: `${row.player.firstName} ${row.player.lastName}`,
        saves: 0,
        shotsAgainst: 0,
      };
      existing.saves += row.stats.saves ?? 0;
      existing.shotsAgainst += row.stats.shotsAgainst ?? 0;
      byGoalie.set(row.player.id, existing);
    }

    return Array.from(byGoalie.values())
      .map((g) => ({
        ...g,
        savePct: g.shotsAgainst > 0 ? g.saves / g.shotsAgainst : null,
      }))
      .sort((a, b) => (b.savePct ?? 0) - (a.savePct ?? 0));
  }),

  // Scorekeeper (assigned to this game) or admin: enter live stats
  recordStat: authedProcedure
    .input(
      z.object({
        gameId: z.number(),
        playerUserId: z.number(),
        teamId: z.number(),
        goals: z.number().int().min(0).default(0),
        assists: z.number().int().min(0).default(0),
        penaltyMinutes: z.number().int().min(0).default(0),
        shotsAgainst: z.number().int().min(0).optional(),
        saves: z.number().int().min(0).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [game] = await db.select().from(games).where(eq(games.id, input.gameId));
      if (!game) throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });

      const isAssignedScorekeeper = game.scorekeeperUserId === ctx.user.id;
      if (!isAssignedScorekeeper && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the assigned scorekeeper or an admin can enter stats for this game",
        });
      }

      const [existing] = await db
        .select()
        .from(gameStats)
        .where(
          and(
            eq(gameStats.gameId, input.gameId),
            eq(gameStats.playerUserId, input.playerUserId)
          )
        );

      if (existing) {
        await db
          .update(gameStats)
          .set({
            goals: input.goals,
            assists: input.assists,
            penaltyMinutes: input.penaltyMinutes,
            shotsAgainst: input.shotsAgainst,
            saves: input.saves,
          })
          .where(eq(gameStats.id, existing.id));
      } else {
        await db.insert(gameStats).values({
          gameId: input.gameId,
          playerUserId: input.playerUserId,
          teamId: input.teamId,
          goals: input.goals,
          assists: input.assists,
          penaltyMinutes: input.penaltyMinutes,
          shotsAgainst: input.shotsAgainst,
          saves: input.saves,
        });
      }
      return { success: true };
    }),

  // Scorekeeper or admin: finalize a game score
  finalizeScore: authedProcedure
    .input(z.object({ gameId: z.number(), homeScore: z.number().int(), awayScore: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const [game] = await db.select().from(games).where(eq(games.id, input.gameId));
      if (!game) throw new TRPCError({ code: "NOT_FOUND" });

      const isAssignedScorekeeper = game.scorekeeperUserId === ctx.user.id;
      if (!isAssignedScorekeeper && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db
        .update(games)
        .set({ homeScore: input.homeScore, awayScore: input.awayScore, status: "final" })
        .where(eq(games.id, input.gameId));
      return { success: true };
    }),

  // Admin: assign home/away teams to a slot once known
  assignTeams: adminProcedure
    .input(z.object({ gameId: z.number(), homeTeamId: z.number(), awayTeamId: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .update(games)
        .set({ homeTeamId: input.homeTeamId, awayTeamId: input.awayTeamId })
        .where(eq(games.id, input.gameId));
      return { success: true };
    }),
});
