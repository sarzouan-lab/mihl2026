import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";

export default function Logout() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
  });

  useEffect(() => {
    logout.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="px-4 py-24 text-center">Logging out...</div>;
}
