import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/header/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full min-h-dvh bg-[#F4F4F5]">
        <DashboardHeader />
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
