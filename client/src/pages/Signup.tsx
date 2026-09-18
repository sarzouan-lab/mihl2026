import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";

export default function Signup() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const signup = trpc.auth.signup.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/register");
    },
    onError: (err) => setError(err.message),
  });

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (form.password !== form.confirmPassword) {
            setError("Passwords don't match");
            return;
          }
          const { confirmPassword, ...payload } = form;
          signup.mutate(payload);
        }}
        className="space-y-4"
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
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Confirm password"
          required
          minLength={8}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={signup.isPending}
          className="w-full bg-[var(--color-mihl-blue)] text-white py-2 rounded font-semibold"
        >
          {signup.isPending ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
