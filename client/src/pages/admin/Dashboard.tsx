import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { GamesPanel, RostersPanel } from "./GamesAndRosters";

function RegistrationsPanel() {
  const utils = trpc.useUtils();
  const { data: pending, isLoading } = trpc.registration.listPending.useQuery();
  const { data: teams } = trpc.games.standings.useQuery(); // reuse for team list w/ ids+names
  const [teamChoice, setTeamChoice] = useState<Record<number, number>>({});

  const approve = trpc.registration.approve.useMutation({
    onSuccess: () => utils.registration.listPending.invalidate(),
  });
  const waitlist = trpc.registration.waitlist.useMutation({
    onSuccess: () => utils.registration.listPending.invalidate(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Pending Registrations</h2>
      {pending?.length === 0 && <p className="text-gray-500">Nothing pending.</p>}
      <div className="space-y-4">
        {pending?.map(({ registration, user }) => (
          <div key={registration.id} className="border rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastName} — {user.email}
              </p>
              <p className="text-sm text-gray-600">
                {registration.position}, jersey {registration.jerseySize}
                {registration.jerseyNumberPref != null && `, #${registration.jerseyNumberPref}`}
                {" — "}
                {registration.paymentPlan === "full" ? "full payment" : "split payment"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                onChange={(e) =>
                  setTeamChoice({ ...teamChoice, [registration.id]: Number(e.target.value) })
                }
              >
                <option value="">Assign temp team...</option>
                {teams?.map((t) => (
                  <option key={t.teamId} value={t.teamId}>
                    {t.team.name}
                  </option>
                ))}
              </select>
              <button
                disabled={!teamChoice[registration.id]}
                onClick={() =>
                  approve.mutate({
                    registrationId: registration.id,
                    teamId: teamChoice[registration.id],
                  })
                }
                className="bg-[var(--color-mihl-blue)] text-white text-sm px-3 py-1.5 rounded disabled:opacity-40"
              >
                Approve
              </button>
              <button
                onClick={() => waitlist.mutate({ registrationId: registration.id })}
                className="bg-gray-200 text-sm px-3 py-1.5 rounded"
              >
                Waitlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffPanel() {
  const utils = trpc.useUtils();
  const { data: pending, isLoading } = trpc.staff.listPending.useQuery();
  const approve = trpc.staff.approve.useMutation({
    onSuccess: () => utils.staff.listPending.invalidate(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Referee / Scorekeeper Applications</h2>
      {pending?.length === 0 && <p className="text-gray-500">Nothing pending.</p>}
      <div className="space-y-4">
        {pending?.map(({ application, displayName, email }) => (
          <div key={application.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {displayName} — {email}
              </p>
              <p className="text-sm text-gray-600 capitalize">{application.role}</p>
            </div>
            <button
              onClick={() => approve.mutate({ applicationId: application.id })}
              className="bg-[var(--color-mihl-blue)] text-white text-sm px-3 py-1.5 rounded"
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StarsPanel() {
  const utils = trpc.useUtils();
  const { data: drafts, isLoading } = trpc.content.draftStars.useQuery();
  const approveStars = trpc.content.approveStars.useMutation({
    onSuccess: () => utils.content.draftStars.invalidate(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Stars of the Week (draft)</h2>
      {drafts?.length === 0 && <p className="text-gray-500">No draft this week.</p>}
      <div className="space-y-4">
        {drafts?.map(({ star, player, team }) => (
          <div key={star.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {player.firstName} {player.lastName} {team && `(${team.name})`}
              </p>
              <p className="text-sm text-gray-600">{star.note}</p>
            </div>
            <button
              onClick={() => approveStars.mutate({ starId: star.id })}
              className="bg-[var(--color-mihl-blue)] text-white text-sm px-3 py-1.5 rounded"
            >
              Approve &amp; publish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsPanel() {
  const utils = trpc.useUtils();
  const { data: drafts, isLoading } = trpc.content.listDraftPosts.useQuery();
  const publish = trpc.content.publishPost.useMutation({
    onSuccess: () => utils.content.listDraftPosts.invalidate(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">News drafts (auto-generated)</h2>
      {drafts?.length === 0 && <p className="text-gray-500">No drafts.</p>}
      <div className="space-y-4">
        {drafts?.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <p className="font-semibold mb-1">{post.title}</p>
            <div
              className="text-sm text-gray-700 mb-3"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
            <button
              onClick={() => publish.mutate({ postId: post.id })}
              className="bg-[var(--color-mihl-blue)] text-white text-sm px-3 py-1.5 rounded"
            >
              Publish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: me, isLoading } = trpc.auth.me.useQuery();
  const [tab, setTab] = useState<
    "registrations" | "staff" | "stars" | "news" | "games" | "rosters"
  >("registrations");

  if (isLoading) return null;
  if (!me || me.role !== "admin") {
    return <div className="px-4 py-24 text-center">Admin access required.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 border-b mb-6 text-sm flex-wrap">
        {(["registrations", "staff", "games", "rosters", "stars", "news"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 capitalize ${tab === t ? "border-b-2 border-[var(--color-mihl-blue)] font-semibold" : "text-gray-500"}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "registrations" && <RegistrationsPanel />}
      {tab === "staff" && <StaffPanel />}
      {tab === "games" && <GamesPanel />}
      {tab === "rosters" && <RostersPanel />}
      {tab === "stars" && <StarsPanel />}
      {tab === "news" && <NewsPanel />}
    </div>
  );
}
