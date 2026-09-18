import { trpc } from "../lib/trpc";

export default function Standings() {
  const { data, isLoading } = trpc.games.standings.useQuery();

  if (isLoading) return <div className="px-4 py-12 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Standings</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Team</th>
            <th className="py-2 pr-4">GP</th>
            <th className="py-2 pr-4">W</th>
            <th className="py-2 pr-4">L</th>
            <th className="py-2 pr-4">T</th>
            <th className="py-2 pr-4">PTS</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr key={row.teamId} className="border-b">
              <td className="py-2 pr-4 flex items-center gap-2">
                {row.team.logoUrl && (
                  <img src={row.team.logoUrl} alt="" className="h-6 w-6" />
                )}
                {row.team.name}
              </td>
              <td className="py-2 pr-4">{row.gp}</td>
              <td className="py-2 pr-4">{row.w}</td>
              <td className="py-2 pr-4">{row.l}</td>
              <td className="py-2 pr-4">{row.t}</td>
              <td className="py-2 pr-4 font-semibold">{row.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
