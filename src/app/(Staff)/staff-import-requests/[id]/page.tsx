// app/dispatch/page.tsx

import dynamic from "next/dynamic";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";


const ImportStoreDetailPage = dynamic(
  () =>
    import(
    "@/components/_importstore/ImportStoreDetailPage"
    ),
  { ssr: false }
);

export default function DispatchPage() {
  return (
    <DashboardLayoutStaff>
      <ImportStoreDetailPage/>
    </DashboardLayoutStaff>
  );
}
