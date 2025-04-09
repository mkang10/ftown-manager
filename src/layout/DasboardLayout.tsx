// app/(dashboard)/layout.tsx
import DashboardShell from "./Client Shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Đây là Server Component: vẫn prerender/SSG tốt
  return <DashboardShell>{children}</DashboardShell>;
}
