import { Link, useLocation } from "wouter";
import { trpc } from "../lib/trpc";

const NAV_LINKS = [
  { href: "/schedule", label: "Schedule" },
  { href: "/standings", label: "Standings" },
  { href: "/stats", label: "Stats" },
  { href: "/news", label: "News" },
  { href: "/rules", label: "Rules" },
  { href: "/staff", label: "Officiate" },
];

export default function Header() {
  const { data: me } = trpc.auth.me.useQuery();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-20 bg-[var(--color-mihl-navy)] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight shrink-0">
            <img src="/logos/mihl-league.png" alt="MIHL" className="h-10 w-10 rounded-full bg-white/10 p-0.5" />
            <span className="hidden sm:inline">Menshes Ice Hockey League</span>
            <span className="sm:hidden">MIHL</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md transition-colors ${
                  location === link.href
                    ? "bg-white/15 font-semibold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            {me ? (
              <>
                {me.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/logout"
                  className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20"
                >
                  Log out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/10"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-md text-sm font-semibold bg-[var(--color-mihl-blue)] hover:brightness-110"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
