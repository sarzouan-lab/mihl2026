import { useState } from "react";
import { trpc } from "../lib/trpc";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const requestReset = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-gray-600">
          If an account exists for {email}, we've sent a link to reset your
          password. It expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
      <p className="text-sm text-gray-600 mb-6">
        Enter your email and we'll send you a link to reset it.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestReset.mutate({ email });
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
        <button
          type="submit"
          disabled={requestReset.isPending}
          className="w-full bg-[var(--color-mihl-blue)] text-white py-2 rounded font-semibold"
        >
          {requestReset.isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
