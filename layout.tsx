import "@/styles/globals.css";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="it">
      <body className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Green4Life · B2B Portal – Harley Dikkinson Partners</div>
            <nav className="text-sm flex gap-4">
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              {!session ? <Link href="/login">Login</Link> : <span>Benvenuto, {(session.user as any)?.name}</span>}
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 py-6">© {new Date().getFullYear()} Green4Life & Management Consulting • Codice ordine G4L obbligatorio</div>
        </footer>
      </body>
    </html>
  );
}
