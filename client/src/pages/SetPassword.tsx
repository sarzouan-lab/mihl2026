import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "../lib/trpc";

export default function SetPassword() {
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") ?? "";
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const setPasswordMutation = trpc.auth.setPassword.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => setError(err.message),
  });

  if (!token) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">
          This link is missing its token. Check the link in your email and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Set your password</h1>
      <p className="text-sm text-gray-600 mb-6">
        Choose a password to finish setting up your MIHL account.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (password !== confirm) {
            setError("Passwords don't match");
            return;
          }
          setPasswordMutation.mutate({ token, password });
        }}
        className="space-y-4"
      >
        <input
          type="password"
          placeholder="New password (min 8 characters)"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Confirm password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={setPasswordMutation.isPending}
          className="w-full bg-[var(--color-mihl-blue)] text-white py-2 rounded font-semibold"
        >
          {setPasswordMutation.isPending ? "Setting password..." : "Set Password & Log In"}
        </button>
      </form>
    </div>
  );
}
