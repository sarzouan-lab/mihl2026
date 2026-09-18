import { useState } from "react";
import { trpc } from "../lib/trpc";

function ApplyPanel() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "referee" as "referee" | "scorekeeper",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const apply = trpc.staff.publicApply.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Application submitted!</h2>
        <p className="text-gray-600">
          An admin will review it and email you once approved. If you don't
          already have an account, create one at any time — approval will
          apply automatically once you sign up with the same email.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Apply to be a referee or scorekeeper — no account needed to apply. An
        admin will review your application and email you once approved.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          apply.mutate(form);
        }}
        className="space-y-4 max-w-sm"
      >
        <input
          placeholder="First name"
          required
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Last name"
          required
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as any })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="referee">Referee</option>
          <option value="scorekeeper">Scorekeeper</option>
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={apply.isPending}
          className="bg-[var(--color-mihl-blue)] text-white px-4 py-2 rounded text-sm"
        >
          {apply.isPending ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

function OpenSlotsPanel() {
  const utils = trpc.useUtils();
  const { data: slots, isLoading } = trpc.staff.openSlots.useQuery();
  const claim = trpc.staff.claimSlot.useMutation({
    onSuccess: () => utils.staff.openSlots.invalidate(),
  });

  if (isLoading) return <p>Loading open slots...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Open Game Slots</h2>
      <div className="space-y-2">
        {slots?.map((game) => (
          <div key={game.id} className="border rounded-lg p-3 flex items-center justify-between text-sm">
            <span>{game.gameDate} — 9:30 PM</span>
            <div className="flex gap-2">
              {!game.refereeUserId && (
                <button
                  onClick={() => claim.mutate({ gameId: game.id, slot: "referee" })}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Claim Referee
                </button>
              )}
              {!game.scorekeeperUserId && (
                <button
                  onClick={() => claim.mutate({ gameId: game.id, slot: "scorekeeper" })}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Claim Scorekeeper
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyGamesPanel() {
  const { data: slots, isLoading } = trpc.staff.openSlots.useQuery();
  const { data: me } = trpc.auth.me.useQuery();

  if (isLoading) return <p>Loading...</p>;

  const myGames = slots?.filter(
    (g) => g.scorekeeperUserId === me?.id || g.refereeUserId === me?.id
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">My Assigned Games</h2>
      {(!myGames || myGames.length === 0) && (
        <p className="text-gray-500">No games claimed yet.</p>
      )}
      <div className="space-y-2">
        {myGames?.map((game) => (
          <div key={game.id} className="border rounded-lg p-3 flex items-center justify-between text-sm">
            <span>{game.gameDate} — 9:30 PM</span>
            {game.scorekeeperUserId === me?.id && (
              <a
                href={`/staff/game/${game.id}`}
                className="bg-[var(--color-mihl-blue)] text-white px-3 py-1 rounded"
              >
                Enter Live Stats
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StaffPortal() {
  const { data: me, isLoading } = trpc.auth.me.useQuery();
  const [tab, setTab] = useState<"apply" | "slots" | "mygames">("apply");

  if (isLoading) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Referee &amp; Scorekeeper Portal</h1>
      <div className="flex gap-4 border-b mb-6 text-sm">
        <button
          onClick={() => setTab("apply")}
          className={`pb-2 ${tab === "apply" ? "border-b-2 border-[var(--color-mihl-blue)] font-semibold" : "text-gray-500"}`}
        >
          Apply
        </button>
        {me && (me.role === "staff" || me.role === "admin") && (
          <>
            <button
              onClick={() => setTab("slots")}
              className={`pb-2 ${tab === "slots" ? "border-b-2 border-[var(--color-mihl-blue)] font-semibold" : "text-gray-500"}`}
            >
              Open Slots
            </button>
            <button
              onClick={() => setTab("mygames")}
              className={`pb-2 ${tab === "mygames" ? "border-b-2 border-[var(--color-mihl-blue)] font-semibold" : "text-gray-500"}`}
            >
              My Games
            </button>
          </>
        )}
      </div>
      {tab === "apply" && <ApplyPanel />}
      {tab === "slots" &&
        (me && (me.role === "staff" || me.role === "admin") ? (
          <OpenSlotsPanel />
        ) : (
          <p className="text-gray-600">Log in as approved staff to view open slots.</p>
        ))}
      {tab === "mygames" &&
        (me && (me.role === "staff" || me.role === "admin") ? (
          <MyGamesPanel />
        ) : (
          <p className="text-gray-600">Log in as approved staff to view your games.</p>
        ))}
    </div>
  );
}
