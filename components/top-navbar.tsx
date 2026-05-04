import Link from "next/link";
import { Bell, Lock, Search, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export function TopNavbar({ mode = "public" }: { mode?: "public" | "dashboard" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-500/10 bg-slate-950/72 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-500/15 text-cyan-200">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>FraudGuard Rekber AI</span>
        </Link>
        {mode === "dashboard" ? (
          <div className="hidden min-w-80 items-center gap-2 rounded-md border border-slate-500/20 bg-slate-950/40 px-3 py-2 text-sm text-slate-400 md:flex">
            <Search className="h-4 w-4" />
            Cari rekening, kasus, atau ID transaksi
          </div>
        ) : (
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="/#features">Fitur</a>
            <a href="/#rekber">Rekber Link</a>
            <a href="/#workflow">Cara kerja</a>
          </nav>
        )}
        <div className="flex items-center gap-2">
          {mode === "dashboard" && (
            <Button size="icon" variant="ghost" aria-label="Notifikasi" title="Notifikasi">
              <Bell className="h-4 w-4" />
            </Button>
          )}
          <Link href="/fraud-check" className={buttonVariants({ variant: "outline", className: "hidden sm:inline-flex" })}>
            <Lock className="h-4 w-4" />
            Data demo saja
          </Link>
        </div>
      </div>
    </header>
  );
}
