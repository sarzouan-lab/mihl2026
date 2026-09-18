import { trpc } from "../lib/trpc";
import { formatGameDate } from "../lib/dates";

export default function Schedule() {
  const { data, isLoading } = trpc.games.schedule.useQuery();

  if (isLoading) return <div className="px-4 py-12 text-center">Loading...</div>;

  // Group rows by date so each game night shows as one card with both rinks
  const byDate = new Map<string, typeof data>();
  for (const row of data ?? []) {
    const key = row.game.gameDate;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(row);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Season Schedule</h1>
      <p className="text-sm text-gray-600 mb-8">
        Iron Lions vs Golan Guards, all season at Samuel Moscovitch Arena.
        Season opens with an evaluation game on September 19th and closes
        with the Championship Game on April 17th, 2027.
      </p>

      <div className="space-y-4">
        {Array.from(byDate.entries()).map(([date, rows]) => (
          <div
            key={date}
            className={
              rows![0].game.label
                ? "border-2 border-[var(--color-mihl-blue)] rounded-lg overflow-hidden"
                : "border rounded-lg overflow-hidden"
            }
          >
            <div className="bg-[var(--color-mihl-navy)] text-white px-4 py-2 text-sm font-semibold flex items-center justify-between">
              <span>{formatGameDate(date)}</span>
              <span className="font-normal text-white/80">9:30 PM</span>
            </div>
            <div className="divide-y">
              {rows!.map(({ game, venue, homeTeam, awayTeam }) => (
                <div key={game.id} className="px-4 py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{venue.name}</div>
                    {game.label ? (
                      <div className="font-semibold text-[var(--color-mihl-blue)]">
                        {game.label}
                      </div>
                    ) : homeTeam && awayTeam ? (
                      <div className="flex items-center gap-2 font-medium">
                        {homeTeam.logoUrl && (
                          <img src={homeTeam.logoUrl} alt="" className="h-5 w-5" />
                        )}
                        {homeTeam.name}
                        <span className="text-gray-400 font-normal">vs</span>
                        {awayTeam.logoUrl && (
                          <img src={awayTeam.logoUrl} alt="" className="h-5 w-5" />
                        )}
                        {awayTeam.name}
                      </div>
                    ) : (
                      <span className="text-gray-400">Matchup TBD</span>
                    )}
                  </div>
                  <div className="text-right">
                    {game.status === "final" ? (
                      <span className="font-semibold">
                        {game.homeScore}–{game.awayScore}
                      </span>
                    ) : (
                      <span className="text-gray-400 capitalize text-xs">{game.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
