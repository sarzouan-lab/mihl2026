import { useState } from "react";
import { trpc } from "../../lib/trpc";

export function GamesPanel() {
  const utils = trpc.useUtils();
  const { data: schedule, isLoading } = trpc.games.schedule.useQuery();
  const { data: standings } = trpc.games.standings.useQuery();
  const assignTeams = trpc.games.assignTeams.useMutation({
    onSuccess: () => utils.games.schedule.invalidate(),
  });
  const [choice, setChoice] = useState<Record<number, { home?: number; away?: number }>>({});

  if (isLoading) return <p>Loading...</p>;

  const unassigned = schedule?.filter((s) => !s.game.homeTeamId && !s.game.label);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Assign Teams to Game Slots ({unassigned?.length ?? 0} unassigned)
      </h2>
      <div className="space-y-2">
        {unassigned?.map(({ game, venue }) => (
          <div key={game.id} className="border rounded-lg p-3 flex items-center gap-3 text-sm">
            <span className="w-48">
              {game.gameDate} — {venue.name}
            </span>
            <select
              className="border rounded px-2 py-1"
              onChange={(e) =>
                setChoice({
                  ...choice,
                  [game.id]: { ...choice[game.id], home: Number(e.target.value) },
                })
              }
            >
              <option value="">Home team...</option>
              {standings?.map((t) => (
                <option key={t.teamId} value={t.teamId}>
                  {t.team.name}
                </option>
              ))}
            </select>
            <span>vs</span>
            <select
              className="border rounded px-2 py-1"
              onChange={(e) =>
                setChoice({
                  ...choice,
                  [game.id]: { ...choice[game.id], away: Number(e.target.value) },
                })
              }
            >
              <option value="">Away team...</option>
              {standings?.map((t) => (
                <option key={t.teamId} value={t.teamId}>
                  {t.team.name}
                </option>
              ))}
            </select>
            <button
              disabled={!choice[game.id]?.home || !choice[game.id]?.away}
              onClick={() =>
                assignTeams.mutate({
                  gameId: game.id,
                  homeTeamId: choice[game.id].home!,
                  awayTeamId: choice[game.id].away!,
                })
              }
              className="bg-[var(--color-mihl-blue)] text-white text-xs px-3 py-1.5 rounded disabled:opacity-40 ml-auto"
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RostersPanel() {
  const utils = trpc.useUtils();
  const { data: allRegs, isLoading } = trpc.registration.listAll.useQuery();
  const { data: standings } = trpc.games.standings.useQuery();
  const reassign = trpc.registration.reassignTeam.useMutation({
    onSuccess: () => utils.registration.listAll.invalidate(),
  });
  const updatePayment = trpc.registration.updatePaymentStatus.useMutation({
    onSuccess: () => utils.registration.listAll.invalidate(),
  });

  if (isLoading) return <p>Loading...</p>;

  const approved = allRegs?.filter((r) => r.registration.status === "approved");

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Rosters — Provisional until Sep 19 ({approved?.length ?? 0} approved)
      </h2>
      <div className="space-y-2">
        {approved?.map(({ registration, user }) => (
          <div key={registration.id} className="border rounded-lg p-3 flex items-center gap-3 text-sm">
            <span className="w-40">
              {user.firstName} {user.lastName}
            </span>
            <select
              className="border rounded px-2 py-1"
              defaultValue={registration.teamId ?? ""}
              onChange={(e) =>
                reassign.mutate({
                  registrationId: registration.id,
                  teamId: Number(e.target.value),
                })
              }
            >
              {standings?.map((t) => (
                <option key={t.teamId} value={t.teamId}>
                  {t.team.name}
                </option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1"
              defaultValue={registration.paymentStatus}
              onChange={(e) =>
                updatePayment.mutate({
                  registrationId: registration.id,
                  paymentStatus: e.target.value as any,
                })
              }
            >
              <option value="unpaid">Unpaid</option>
              <option value="deposit_paid">Deposit paid</option>
              <option value="paid_in_full">Paid in full</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
