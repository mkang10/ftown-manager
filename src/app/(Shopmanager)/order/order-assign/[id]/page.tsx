// app/dispatch/page.tsx

import dynamic from "next/dynamic";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";


const OrderDetailPage = dynamic(
  () =>
    import(
    "@/components/_orderDetail/OrderDetailPage"
    ),
  { ssr: false }
);

export default function DispatchPage() {
  return (
    <DashboardLayoutStaff>
      <OrderDetailPage/>
    </DashboardLayoutStaff>
  );
}
