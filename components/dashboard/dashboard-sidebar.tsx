import Link from "next/link";
import { Activity, BarChart3, FileWarning, Network, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Ringkasan", icon: BarChart3 },
  { href: "/dashboard/hybrid-fds", label: "FDS Hybrid", icon: Activity },
  { href: "/dashboard/cases", label: "Kasus", icon: FileWarning },
  { href: "/dashboard/graph", label: "Graf", icon: Network },
  { href: "/dashboard/reports", label: "Laporan", icon: FileWarning },
  { href: "/rekber/create", label: "Rekber", icon: Wallet }
];

export function DashboardSidebar({ active }: { active?: string }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-500/10 bg-slate-950/60 p-4 lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/15 text-cyan-200">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold">Konsol Staff Bank</p>
          <p className="text-xs text-slate-400">Peran Analis Fraud</p>
        </div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800/70 hover:text-white",
                selected && "bg-blue-500/15 text-cyan-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-lg border border-slate-500/20 bg-slate-900/50 p-4 text-xs text-slate-400">
        Data demo saja. Tidak ada integrasi aktif ke bank, regulator, kurir, atau marketplace nyata.
      </div>
    </aside>
  );
}
