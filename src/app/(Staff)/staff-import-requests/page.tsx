// app/dispatch-store-detail/page.tsx
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
import dynamic from "next/dynamic";

const ImportListRequest = dynamic(
  () =>
    import(
      "@/components/_staffcomponent/_importreuquest/ImportListRequest"  ),
  { ssr: false }
);

export default function DispatchStoreDetailPage() {
  return (
    <DashboardLayoutStaff>
      <ImportListRequest />
    </DashboardLayoutStaff>
  );
}
