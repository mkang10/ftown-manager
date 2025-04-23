// app/order/page.tsx
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
      <ManagerOrderPage />
    </DashboardLayout>
  );
}
