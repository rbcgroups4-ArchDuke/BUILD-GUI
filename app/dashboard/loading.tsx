export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="border-b border-slate-500/10 bg-slate-950/72">
        <div className="mx-auto h-16 max-w-7xl px-4 sm:px-6 lg:px-8" />
      </div>
      <div className="flex">
        <aside className="hidden w-72 shrink-0 border-r border-slate-500/10 bg-slate-950/60 p-4 lg:block">
          <div className="mb-8 h-12 animate-pulse rounded-md bg-slate-900/80" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-md bg-slate-900/70" />
            ))}
          </div>
        </aside>
        <section className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-900/80" />
            <div className="mt-4 h-10 max-w-xl animate-pulse rounded bg-slate-900/80" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-xl border border-slate-500/10 bg-slate-950/50" />
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div className="h-80 animate-pulse rounded-xl border border-slate-500/10 bg-slate-950/50" />
            <div className="h-80 animate-pulse rounded-xl border border-slate-500/10 bg-slate-950/50" />
          </div>
          <div className="mt-6 h-[520px] animate-pulse rounded-xl border border-slate-500/10 bg-slate-950/50" />
        </section>
      </div>
    </main>
  );
}
