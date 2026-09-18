import { z } from "zod";
import { router, authedProcedure } from "../_core/trpc";
import { db } from "../db";
import { registrations, users, games, gameStats } from "../../shared/schema";
import { eq, or } from "drizzle-orm";

export const rosterRouter = router({
  // For a given game, list approved players on either team (home/away),
  // plus any stats already recorded this game, so the scorekeeper can enter live.
  forGame: authedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ input }) => {
      const [game] = await db.select().from(games).where(eq(games.id, input.gameId));
      if (!game) return { game: null, roster: [], existingStats: [] };

      const teamIds = [game.homeTeamId, game.awayTeamId].filter(
        (id): id is number => id != null
      );

      const roster =
        teamIds.length === 0
          ? []
          : await db
              .select({
                registration: registrations,
                user: {
                  id: users.id,
                  firstName: users.firstName,
                  lastName: users.lastName,
                },
              })
              .from(registrations)
              .innerJoin(users, eq(registrations.userId, users.id))
              .where(
                or(...teamIds.map((id) => eq(registrations.teamId, id)))
              );

      const existingStats = await db
        .select()
        .from(gameStats)
        .where(eq(gameStats.gameId, input.gameId));

      return { game, roster, existingStats };
    }),
});
