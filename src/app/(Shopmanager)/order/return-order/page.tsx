// app/order/page.tsx
import ReturnRequestsPage from "@/components/_order/ReturnRequestsPage";
import DashboardLayout from "@/layout/DasboardLayout";
import dynamic from "next/dynamic";

const ManagerOrderPage = dynamic(
  () =>
    import(
      "@/components/_order/OrderManagerPage"    ),
  { ssr: false }
);


export default function OrderPage() {
  return (
    <DashboardLayout>
      <ReturnRequestsPage />
    </DashboardLayout>
  );
}
