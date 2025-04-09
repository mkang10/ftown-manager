// app/dispatch/page.tsx

import dynamic from "next/dynamic";
const DispatchClient = dynamic(
  () =>
    import(
      "@/components/_dispatch/DispatchClient"
    ),
  { ssr: false }
);
import DashboardLayout from "@/layout/DasboardLayout";

export default function DispatchPage() {
  return (
    <DashboardLayout>
      <DispatchClient />
    </DashboardLayout>
  );
}

