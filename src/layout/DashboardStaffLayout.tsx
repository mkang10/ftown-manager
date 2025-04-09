// app/(staff)/layout.tsx
import DashboardStaffShell from "./DashboardStaffShell";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Đây là Server Component → Next.js sẽ prerender bình thường
  return <DashboardStaffShell>{children}</DashboardStaffShell>;
}
