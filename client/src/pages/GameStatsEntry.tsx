import { useState, useRef } from "react";
import { useParams } from "wouter";
import { trpc } from "../lib/trpc";

type StatDraft = {
  goals: number;
  assists: number;
  penaltyMinutes: number;
  saves?: number;
  shotsAgainst?: number;
};

function StatButton({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-9 w-9 rounded-md bg-gray-200 text-gray-700 text-lg font-bold active:bg-gray-300"
        >
          −
        </button>
        <span className="w-7 text-center font-bold text-lg tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-9 w-9 rounded-md bg-[var(--color-mihl-blue)] text-white text-lg font-bold active:brightness-110"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function GameStatsEntry() {
  const { gameId } = useParams<{ gameId: string }>();
  const id = Number(gameId);

  const { data, isLoading } = trpc.roster.forGame.useQuery({ gameId: id });
  const [draft, setDraft] = useState<Record<number, StatDraft>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const saveTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const recordStat = trpc.games.recordStat.useMutation({
    onSettled: () => setSavingId(null),
  });
  const finalize = trpc.games.finalizeScore.useMutation();

  if (isLoading) return <div className="px-4 py-12 text-center">Loading...</div>;
  if (!data?.game) return <div className="px-4 py-12 text-center">Game not found.</div>;

  const getDraft = (playerId: number): StatDraft => {
    const existing = data.existingStats.find((s) => s.playerUserId === playerId);
    return (
      draft[playerId] ?? {
        goals: existing?.goals ?? 0,
        assists: existing?.assists ?? 0,
        penaltyMinutes: existing?.penaltyMinutes ?? 0,
        saves: existing?.saves ?? undefined,
        shotsAgainst: existing?.shotsAgainst ?? undefined,
      }
    );
  };

  // Every tap immediately saves -- fastest possible flow for rink-side use.
  const updateAndSave = (playerId: number, teamId: number, field: keyof StatDraft, value: number) => {
    const next = { ...getDraft(playerId), [field]: value };
    setDraft((prev) => ({ ...prev, [playerId]: next }));

    // Debounce slightly so rapid taps don't fire a request per tap
    clearTimeout(saveTimers.current[playerId]);
    saveTimers.current[playerId] = setTimeout(() => {
      setSavingId(playerId);
      recordStat.mutate({
        gameId: id,
        playerUserId: playerId,
        teamId,
        goals: next.goals,
        assists: next.assists,
        penaltyMinutes: next.penaltyMinutes,
        saves: next.saves,
        shotsAgainst: next.shotsAgainst,
      });
    }, 350);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-1">Live Stats</h1>
      <p className="text-sm text-gray-600 mb-6">{data.game.gameDate} · Tap to score — saves automatically.</p>

      <div className="space-y-3 mb-10">
        {data.roster.map(({ registration, user }) => {
          const d = getDraft(user.id);
          const isGoalie = registration.position === "goalie";
          const isSaving = savingId === user.id;
          return (
            <div key={user.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">
                  {user.firstName} {user.lastName}
                  {registration.jerseyNumberPref != null && ` #${registration.jerseyNumberPref}`}
                </span>
                {isSaving && <span className="text-[10px] text-gray-400">saving…</span>}
              </div>
              <div className="flex flex-wrap gap-4">
                <StatButton
                  label="Goal"
                  value={d.goals}
                  onChange={(v) => updateAndSave(user.id, registration.teamId!, "goals", v)}
                />
                <StatButton
                  label="Assist"
                  value={d.assists}
                  onChange={(v) => updateAndSave(user.id, registration.teamId!, "assists", v)}
                />
                <StatButton
                  label="Penalty"
                  value={d.penaltyMinutes}
                  onChange={(v) => updateAndSave(user.id, registration.teamId!, "penaltyMinutes", v)}
                />
                {isGoalie && (
                  <>
                    <StatButton
                      label="Save"
                      value={d.saves ?? 0}
                      onChange={(v) => updateAndSave(user.id, registration.teamId!, "saves", v)}
                    />
                    <StatButton
                      label="Shot Vs"
                      value={d.shotsAgainst ?? 0}
                      onChange={(v) => updateAndSave(user.id, registration.teamId!, "shotsAgainst", v)}
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-6">
        <h2 className="font-semibold mb-3">Final Score</h2>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Home"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="w-20 border rounded px-2 py-2 text-center text-lg"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Away"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="w-20 border rounded px-2 py-2 text-center text-lg"
          />
          <button
            onClick={() =>
              finalize.mutate({
                gameId: id,
                homeScore: Number(homeScore),
                awayScore: Number(awayScore),
              })
            }
            disabled={homeScore === "" || awayScore === ""}
            className="bg-[var(--color-mihl-navy)] text-white px-4 py-2 rounded text-sm disabled:opacity-40"
          >
            Finalize Game
          </button>
        </div>
      </div>
    </div>
  );
}
