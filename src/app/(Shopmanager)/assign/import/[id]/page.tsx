// app/staff-assign/page.tsx
import ImportDetailPage from "@/components/_staff-assign/_detail/ImportDetail";
import DashboardLayout from "@/layout/DasboardLayout";

import dynamic from "next/dynamic";


const StaffAssignClient = dynamic(
  () =>
    import(
      "@/components/_staff-assign/StaffAssignClient"
    ),
  { ssr: false }
);

export default function StaffAssignPage() {
  return (
    <DashboardLayout>
      <ImportDetailPage />
    </DashboardLayout>
  );
}
