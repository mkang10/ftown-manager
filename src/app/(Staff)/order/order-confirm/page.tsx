// app/order-staff/page.tsx
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
import dynamic from "next/dynamic";

const OrderStaffClient = dynamic(
  () =>
    import(
      "@/components/_staffcomponent/_order/OrderStaffClient"    ),
  { ssr: false }
);


export default function OrderStaffPage() {
  return (
    <DashboardLayoutStaff>
      <OrderStaffClient />
    </DashboardLayoutStaff>
  );
}
