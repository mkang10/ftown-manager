// app/staff-assign/page.tsx
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
      <StaffAssignClient />
    </DashboardLayout>
  );
}
