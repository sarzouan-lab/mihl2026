import { trpc } from "../lib/trpc";

export default function StarsOfWeek() {
  const { data, isLoading } = trpc.content.currentStars.useQuery();

  if (isLoading) return <div className="px-4 py-12 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Stars of the Week</h1>
      <div className="space-y-4">
        {data?.length === 0 && <p className="text-gray-500">No stars picked yet.</p>}
        {data?.map(({ star, player, team }) => (
          <div key={star.id} className="border rounded-lg p-4 flex items-center gap-4">
            {team?.logoUrl && <img src={team.logoUrl} alt="" className="h-10 w-10" />}
            <div>
              <p className="font-semibold">
                {player.firstName} {player.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Week of {star.weekStartDate} {star.note && `— ${star.note}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
