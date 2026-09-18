import { useState } from "react";
import { trpc } from "../lib/trpc";

function LeagueLeadersTab() {
  const { data, isLoading } = trpc.games.leaders.useQuery();
  if (isLoading) return <p className="text-center py-8">Loading...</p>;

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left border-b">
          <th className="py-2 pr-4">Player</th>
          <th className="py-2 pr-4">G</th>
          <th className="py-2 pr-4">A</th>
          <th className="py-2 pr-4">PTS</th>
          <th className="py-2 pr-4">PIM</th>
        </tr>
      </thead>
      <tbody>
        {data?.length === 0 && (
          <tr>
            <td colSpan={5} className="py-6 text-center text-gray-500">
              No stats recorded yet — check back once games are underway.
            </td>
          </tr>
        )}
        {data?.map((row) => (
          <tr key={row.userId} className="border-b">
            <td className="py-2 pr-4">{row.name}</td>
            <td className="py-2 pr-4">{row.goals}</td>
            <td className="py-2 pr-4">{row.assists}</td>
            <td className="py-2 pr-4 font-semibold">{row.points}</td>
            <td className="py-2 pr-4">{row.pim}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TeamLeadersTab() {
  const { data, isLoading } = trpc.games.teamLeaders.useQuery();
  const [teamId, setTeamId] = useState<number | null>(null);

  if (isLoading) return <p className="text-center py-8">Loading...</p>;

  const activeTeam = teamId ? data?.find((t) => t.team.id === teamId) : data?.[0];

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {data?.map(({ team }) => (
          <button
            key={team.id}
            onClick={() => setTeamId(team.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${
              (activeTeam?.team.id ?? data[0]?.team.id) === team.id
                ? "bg-[var(--color-mihl-navy)] text-white border-[var(--color-mihl-navy)]"
                : "bg-white text-gray-700"
            }`}
          >
            {team.logoUrl && <img src={team.logoUrl} alt="" className="h-4 w-4" />}
            {team.name}
          </button>
        ))}
      </div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Player</th>
            <th className="py-2 pr-4">G</th>
            <th className="py-2 pr-4">A</th>
            <th className="py-2 pr-4">PTS</th>
            <th className="py-2 pr-4">PIM</th>
          </tr>
        </thead>
        <tbody>
          {activeTeam?.leaders.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500">
                No stats recorded yet for this team.
              </td>
            </tr>
          )}
          {activeTeam?.leaders.map((row) => (
            <tr key={row.userId} className="border-b">
              <td className="py-2 pr-4">{row.name}</td>
              <td className="py-2 pr-4">{row.goals}</td>
              <td className="py-2 pr-4">{row.assists}</td>
              <td className="py-2 pr-4 font-semibold">{row.points}</td>
              <td className="py-2 pr-4">{row.pim}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GoalieLeadersTab() {
  const { data, isLoading } = trpc.games.goalieLeaders.useQuery();
  if (isLoading) return <p className="text-center py-8">Loading...</p>;

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left border-b">
          <th className="py-2 pr-4">Goalie</th>
          <th className="py-2 pr-4">Saves</th>
          <th className="py-2 pr-4">Shots Against</th>
          <th className="py-2 pr-4">Save %</th>
        </tr>
      </thead>
      <tbody>
        {data?.length === 0 && (
          <tr>
            <td colSpan={4} className="py-6 text-center text-gray-500">
              No goalie stats recorded yet.
            </td>
          </tr>
        )}
        {data?.map((row) => (
          <tr key={row.userId} className="border-b">
            <td className="py-2 pr-4">{row.name}</td>
            <td className="py-2 pr-4">{row.saves}</td>
            <td className="py-2 pr-4">{row.shotsAgainst}</td>
            <td className="py-2 pr-4 font-semibold">
              {row.savePct != null ? `${(row.savePct * 100).toFixed(1)}%` : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Stats() {
  const [tab, setTab] = useState<"league" | "team" | "goalies">("league");

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Stats</h1>
      <div className="flex gap-4 border-b mb-6 text-sm">
        <button
          onClick={() => setTab("league")}
          className={`pb-2 ${tab === "league" ? "border-b-2 border-[var(--color-mihl-blue)] font-semibold" : "text-gray-500"}`}
        >
          League Leaders
        </button>
        <button
          onClick={() => setTab("team")}
          className={`pb-2 ${tab === "team" ? "border-b-2 border-[var(--color-mihl-blue)] font-semibold" : "text-gray-500"}`}
        >
          Team Leaders
        </button>
        <button
          onClick={() => setTab("goalies")}
          className={`pb-2 ${tab === "goalies" ? "border-b-2 border-[var(--color-mihl-blue)] font-semibold" : "text-gray-500"}`}
        >
          Goalies
        </button>
      </div>
      {tab === "league" && <LeagueLeadersTab />}
      {tab === "team" && <TeamLeadersTab />}
      {tab === "goalies" && <GoalieLeadersTab />}
    </div>
  );
}
