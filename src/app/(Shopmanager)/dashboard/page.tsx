// app/dashboard/page.tsx
import DashboardLayout from "@/layout/DasboardLayout";
import dynamic from "next/dynamic";


const DashboardShopManagerClient = dynamic(
  () =>
    import(
      "@/components/DashboardShopManagerClient"
    ),
  { ssr: false }
);
export default function DashboardPageShopManager() {
  return (
    <DashboardLayout>
      <DashboardShopManagerClient />
    </DashboardLayout>
  );
}
