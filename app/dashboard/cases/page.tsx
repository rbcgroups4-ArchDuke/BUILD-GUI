import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { CaseManagementTable } from "@/components/dashboard/case-management-table";
import { dashboardCases } from "@/lib/mock-data/store";

export default function CasesPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar mode="dashboard" />
      <div className="flex">
        <DashboardSidebar active="/dashboard/cases" />
        <section className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase text-cyan-300">Kasus</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">Antrean kasus fraud dan Rekber.</h1>
          </div>
          <CaseManagementTable cases={dashboardCases()} />
        </section>
      </div>
    </main>
  );
}
