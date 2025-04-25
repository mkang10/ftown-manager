// app/staff-assign/page.tsx
import DashboardLayout from "@/layout/DasboardLayout";

import dynamic from "next/dynamic";


const ImportDetailPage = dynamic(
  () =>
    import(
     "@/components/_staff-assign/_detail/ImportDetail"
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
