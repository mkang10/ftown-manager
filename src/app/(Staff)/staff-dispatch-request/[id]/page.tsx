// app/dispatch/page.tsx

import dynamic from "next/dynamic";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";

const DispatchStoreExportDetailPage = dynamic(
  () =>
    import(
    "@/components/_storeexport/DispatchStoreExportDetailPage"
    ),
  { ssr: false }
);

export default function DispatchPage() {
  return (
    <DashboardLayoutStaff>
      <DispatchStoreExportDetailPage/>
    </DashboardLayoutStaff>
  );
}
