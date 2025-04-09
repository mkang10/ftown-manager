// app/order/page.tsx
import DashboardLayout from "@/layout/DasboardLayout";
import dynamic from "next/dynamic";

const OrderClient = dynamic(
  () =>
    import(
      "@/components/_order/OrderClient"    ),
  { ssr: false }
);


export default function OrderPage() {
  return (
    <DashboardLayout>
      <OrderClient />
    </DashboardLayout>
  );
}
