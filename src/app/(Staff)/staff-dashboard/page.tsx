// app/order-staff/page.tsx
import dynamic from "next/dynamic";

const DashboardStaffClient = dynamic(
  () =>
    import(
      "@/components/DashboardStaffClient"    ),
  { ssr: false }
);



export default function StaffDashboard() {
  return (
      <DashboardStaffClient />
  );
}
