import { useState } from "react";
import { trpc } from "../lib/trpc";

export default function Registration() {
  const { data: me, isLoading: meLoading } = trpc.auth.me.useQuery();
  const { data: existingReg, isLoading: regLoading } =
    trpc.registration.myRegistration.useQuery(undefined, { enabled: !!me });

  const [form, setForm] = useState({
    jerseyNumberPref: "",
    position: "forward" as "forward" | "defense" | "goalie",
    jerseySize: "L" as "M" | "L" | "XL" | "XXL" | "XXXL",
    waiverAccepted: false,
    paymentPlan: "full" as "full" | "split",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = trpc.registration.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  if (meLoading) return null;

  if (!me) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Register to play</h1>
        <p className="mb-4">Create an account first to fill out your registration.</p>
        <a
          href="/signup"
          className="inline-block bg-[var(--color-mihl-blue)] text-white px-6 py-3 rounded-md font-semibold"
        >
          Sign up
        </a>
      </div>
    );
  }

  if (!regLoading && existingReg) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">You're already registered</h1>
        <p>
          Status: <strong className="capitalize">{existingReg.status}</strong>
        </p>
        {existingReg.status === "approved" && (
          <p className="mt-2 text-sm text-gray-600">
            Check your email for your Spond invite link.
          </p>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Registration submitted!</h1>
        <p>
          You'll receive an email once league admin reviews your
          registration.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Player Registration</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          submit.mutate({
            jerseyNumberPref: form.jerseyNumberPref
              ? Number(form.jerseyNumberPref)
              : undefined,
            position: form.position,
            jerseySize: form.jerseySize,
            waiverAccepted: form.waiverAccepted as true,
            paymentPlan: form.paymentPlan,
          });
        }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Jersey number preference (optional)
          </label>
          <input
            type="number"
            min={0}
            max={99}
            value={form.jerseyNumberPref}
            onChange={(e) =>
              setForm({ ...form, jerseyNumberPref: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <select
            value={form.position}
            onChange={(e) =>
              setForm({ ...form, position: e.target.value as any })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="forward">Forward</option>
            <option value="defense">Defense</option>
            <option value="goalie">Goalie</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Jersey size</label>
          <select
            value={form.jerseySize}
            onChange={(e) =>
              setForm({ ...form, jerseySize: e.target.value as any })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Payment plan
          </label>
          <select
            value={form.paymentPlan}
            onChange={(e) =>
              setForm({ ...form, paymentPlan: e.target.value as any })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="full">Full payment ($850 if paid by Sep 11) — e-transfer to payments@mihl.ca</option>
            <option value="split">
              Split payment — $450 by Sep 11, $425 by Dec 19
            </option>
          </select>
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.waiverAccepted}
            onChange={(e) =>
              setForm({ ...form, waiverAccepted: e.target.checked })
            }
            className="mt-1"
          />
          I acknowledge the league's liability waiver and agree to abide by
          the League Rules.
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submit.isPending || !form.waiverAccepted}
          className="w-full bg-[var(--color-mihl-blue)] text-white py-3 rounded font-semibold disabled:opacity-50"
        >
          {submit.isPending ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}
