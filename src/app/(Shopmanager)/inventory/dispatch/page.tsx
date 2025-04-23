// app/dispatch/page.tsx
import DashboardLayout from "@/layout/DasboardLayout";
import dynamic from "next/dynamic";


const DispatchClient = dynamic(
  () =>
    import(
    "@/components/_dispatchAll/DispatchClient"
    ),
  { ssr: false }
);

export default function DispatchPage() {
  return (
    <DashboardLayout>
      <DispatchClient />
    </DashboardLayout>
  );
}
