// app/order/page.tsx
import dynamic from "next/dynamic";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";

const StaffOrderPage = dynamic(
  () =>
    import(
      "@/components/_order/OrderStaffPage"    ),
  { ssr: false }
);


export default function OrderPage() {
  return (
    <DashboardLayoutStaff>
      < StaffOrderPage/>
    </DashboardLayoutStaff>
  );
}
