// app/inventory/import/page.tsx
import DashboardLayout from "@/layout/DasboardLayout";
import dynamic from "next/dynamic";

const InventoryImportListClient = dynamic(
  () =>
    import(
      "@/components/_inventory/_import/InventoryImportListClient"    ),
  { ssr: false }
);


export default function InventoryImportListPage() {
  return (
    <DashboardLayout>
      <InventoryImportListClient />
    </DashboardLayout>
  );
}
