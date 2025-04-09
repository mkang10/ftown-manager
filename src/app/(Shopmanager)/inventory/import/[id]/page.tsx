// app/inventory/import/[id]/page.tsx
import DashboardLayout from "@/layout/DasboardLayout";
import dynamic from "next/dynamic";

const ImportDetailClient = dynamic(
  () =>
    import(
"@/components/_inventory/_import/_detail/ImportDetailClient"    ),
  { ssr: false }
);


export default function ImportDetailPage() {
  return (
    <DashboardLayout>
      <ImportDetailClient />
    </DashboardLayout>
  );
}

