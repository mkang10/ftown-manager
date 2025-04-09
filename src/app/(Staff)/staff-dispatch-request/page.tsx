// app/dispatch-store-detail/page.tsx
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
import dynamic from "next/dynamic";
const DispatchStoreDetailClient = dynamic(
  () =>
    import(
      "@/components/_staffcomponent/_dispatchrequest/DispatchStoreDetailClient"    ),
  { ssr: false }
);


export default function DispatchStoreDetailPage() {
  return (
    <DashboardLayoutStaff>
      <DispatchStoreDetailClient />
    </DashboardLayoutStaff>
  );
}
