import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const login = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => setError(err.message),
  });

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Log in</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          login.mutate({ email, password });
        }}
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-[var(--color-mihl-blue)] text-white py-2 rounded font-semibold"
        >
          {login.isPending ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account?{" "}
        <a href="/signup" className="text-[var(--color-mihl-blue)]">
          Sign up
        </a>
      </p>
      <p className="mt-2 text-sm">
        <a href="/forgot-password" className="text-[var(--color-mihl-blue)]">
          Forgot your password?
        </a>
      </p>
    </div>
  );
}
