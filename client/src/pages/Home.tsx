import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { formatGameDate } from "../lib/dates";

function StandingsWidget() {
  const { data, isLoading } = trpc.games.standings.useQuery();
  if (isLoading || !data) return null;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-[var(--color-mihl-navy)] text-white px-4 py-2.5 text-sm font-semibold flex items-center justify-between">
        Standings
        <Link href="/standings" className="text-xs font-normal text-white/70 hover:text-white">
          Full table →
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b">
            <th className="py-2 px-4">Team</th>
            <th className="py-2 px-2 text-center">GP</th>
            <th className="py-2 px-2 text-center">PTS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.teamId} className="border-b last:border-0">
              <td className="py-2 px-4 flex items-center gap-2">
                {row.team.logoUrl && <img src={row.team.logoUrl} alt="" className="h-5 w-5" />}
                {row.team.name}
              </td>
              <td className="py-2 px-2 text-center text-gray-500">{row.gp}</td>
              <td className="py-2 px-2 text-center font-semibold">{row.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadersWidget() {
  const { data, isLoading } = trpc.games.leaders.useQuery();
  if (isLoading) return null;
  const top5 = (data ?? []).slice(0, 5);

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-[var(--color-mihl-navy)] text-white px-4 py-2.5 text-sm font-semibold flex items-center justify-between">
        Point Leaders
        <Link href="/stats" className="text-xs font-normal text-white/70 hover:text-white">
          Full stats →
        </Link>
      </div>
      {top5.length === 0 ? (
        <p className="text-sm text-gray-500 px-4 py-6 text-center">
          Stats will appear once games are underway.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="py-2 px-4">Player</th>
              <th className="py-2 px-2 text-center">G</th>
              <th className="py-2 px-2 text-center">A</th>
              <th className="py-2 px-2 text-center">PTS</th>
            </tr>
          </thead>
          <tbody>
            {top5.map((row) => (
              <tr key={row.userId} className="border-b last:border-0">
                <td className="py-2 px-4">{row.name}</td>
                <td className="py-2 px-2 text-center text-gray-500">{row.goals}</td>
                <td className="py-2 px-2 text-center text-gray-500">{row.assists}</td>
                <td className="py-2 px-2 text-center font-semibold">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function NextGameWidget() {
  const { data, isLoading } = trpc.games.schedule.useQuery();
  if (isLoading) return null;
  const upcoming = (data ?? []).filter((r) => r.game.status === "scheduled").slice(0, 2);

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-[var(--color-mihl-navy)] text-white px-4 py-2.5 text-sm font-semibold flex items-center justify-between">
        Next Game Night
        <Link href="/schedule" className="text-xs font-normal text-white/70 hover:text-white">
          Full schedule →
        </Link>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-500 px-4 py-6 text-center">Schedule coming soon.</p>
      ) : (
        <div className="divide-y">
          {upcoming.map(({ game, venue, homeTeam, awayTeam }) => (
            <div key={game.id} className="px-4 py-3">
              <div className="text-xs text-gray-500 mb-1">
                {formatGameDate(game.gameDate)} · {venue.name}
              </div>
              {game.label ? (
                <div className="font-semibold text-[var(--color-mihl-blue)] text-sm">
                  {game.label}
                </div>
              ) : homeTeam && awayTeam ? (
                <div className="flex items-center gap-2 text-sm font-medium">
                  {homeTeam.logoUrl && <img src={homeTeam.logoUrl} alt="" className="h-5 w-5" />}
                  {homeTeam.name}
                  <span className="text-gray-400 font-normal">vs</span>
                  {awayTeam.logoUrl && <img src={awayTeam.logoUrl} alt="" className="h-5 w-5" />}
                  {awayTeam.name}
                </div>
              ) : (
                <span className="text-sm text-gray-400">Matchup TBD</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsPreview() {
  const { data, isLoading } = trpc.content.newsFeed.useQuery();
  if (isLoading) return null;
  const posts = (data ?? []).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Latest News</h2>
        <Link href="/news" className="text-sm text-[var(--color-mihl-blue)] font-medium">
          View all →
        </Link>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/news/${post.id}`}>
            <article className="bg-white border rounded-lg p-5 hover:border-[var(--color-mihl-blue)] cursor-pointer transition-colors">
              <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
              <p className="text-xs text-gray-500 mb-3">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
              </p>
              <div
                className="prose prose-sm max-w-none text-gray-700 line-clamp-4"
                dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
              />
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--color-mihl-navy)] to-[#153057] text-white">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <img
              src="/logos/mihl-league.png"
              alt="MIHL"
              className="h-28 w-28 rounded-full bg-white/10 p-2 shrink-0"
            />
            <div>
              <p className="text-[var(--color-mihl-blue)] font-semibold text-sm tracking-wide uppercase mb-2">
                2026–27 Season · Registration Open
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Menshes Ice Hockey League
              </h1>
              <p className="text-white/85 max-w-2xl mb-6">
                Saturday nights, 9:30–10:50 PM, at Samuel Moscovitch Arena.
                A season-opening evaluation game on September 19th, then
                Iron Lions vs Golan Guards all season long, capped by the
                Championship Game on April 17th.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="bg-[var(--color-mihl-blue)] hover:brightness-110 px-6 py-3 rounded-md font-semibold"
                >
                  Register Now
                </Link>
                <Link
                  href="/schedule"
                  className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-md font-semibold"
                >
                  View Schedule
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick facts bar */}
      <div className="bg-[var(--color-mihl-ice)] border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Season</div>
            <div className="font-semibold">Sep 19 – Apr 17</div>
          </div>
          <div>
            <div className="text-gray-500">Cost</div>
            <div className="font-semibold">$850 (full, by Sep 11) / $875 (split)</div>
          </div>
          <div>
            <div className="text-gray-500">Teams</div>
            <div className="font-semibold">Iron Lions vs Golan Guards</div>
          </div>
          <div>
            <div className="text-gray-500">Venue</div>
            <div className="font-semibold">Samuel Moscovitch Arena</div>
          </div>
        </div>
      </div>

      {/* Main dashboard */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NewsPreview />
        </div>
        <div className="space-y-6">
          <NextGameWidget />
          <StandingsWidget />
          <LeadersWidget />
        </div>
      </div>
    </div>
  );
}
