"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiShoppingCart,
  FiCheckCircle,
  FiTruck,
  FiRotateCcw,
  FiMessageSquare,
  FiTrendingUp,
  FiBox,
  FiClipboard,
} from "react-icons/fi";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import Navbar from "@/components/Navbar/Navbar";

interface DashboardStaffShellProps {
  children: React.ReactNode;
}

export default function DashboardStaffShell({ children }: DashboardStaffShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-56" : "w-16"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <img
              src="/assets/logo.avif"
              alt="Funkytown Logo"
              className="h-8 w-8 object-contain cursor-pointer"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            />
            {isSidebarOpen && (
              <span className="text-xl font-extrabold text-black tracking-tight">
                FUNKYTOWN
              </span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <SidebarItem icon={<FiHome />} label="Trang Chủ" isOpen={isSidebarOpen} route="/staff-dashboard" />
          <SidebarDropdown
            id="warehouses"
            icon={<FiClipboard />}
            label="Kho Hàng"
            isOpen={isSidebarOpen}
            subItems={[
              { label: "Yêu Cầu Nhập", route: "/staff-import-requests" },
              { label: "Yêu Cầu Xuất", route: "/staff-dispatch-request" },
            ]}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
          <SidebarDropdown
            id="orders"
            icon={<FiShoppingCart />}
            label="Đơn Hàng"
            isOpen={isSidebarOpen}
            subItems={[
              // { label: "Nhận Đơn", route: "/orders/receive" },
              { label: "Xác Nhận Đơn", route: "/order/order-confirm" },
            ]}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
          {/* <SidebarDropdown
            id="packing"
            icon={<FiCheckCircle />}
            label="Đóng Gói"
            isOpen={isSidebarOpen}
            subItems={[{ label: "Đóng Gói & Cập Nhật", route: "/staff/packing" }]}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          /> */}
          <SidebarDropdown
            id="delivery"
            icon={<FiTruck />}
            label="Giao Hàng"
            isOpen={isSidebarOpen}
            subItems={[{ label: "Theo Dõi", route: "/staff/delivery" }]}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
          <SidebarDropdown
            id="returns"
            icon={<FiRotateCcw />}
            label="Hoàn Trả"
            isOpen={isSidebarOpen}
            subItems={[
              { label: "Yêu Cầu", route: "/staff/returns/requests" },
              { label: "Xử Lý", route: "/staff/returns/process" },
            ]}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
          {/* <SidebarItem icon={<FiMessageSquare />} label="Phản Hồi" isOpen={isSidebarOpen} route="/staff/feedback" /> */}
          {/* <SidebarDropdown
            id="reports"
            icon={<FiTrendingUp />}
            label="Báo Cáo"
            isOpen={isSidebarOpen}
            subItems={[{ label: "Thống Kê", route: "/staff/reports/statistics" }]}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          /> */}
          {/* <SidebarDropdown
            id="imports"
            icon={<FiBox />}
            label="Nhập Hàng"
            isOpen={isSidebarOpen}
            subItems={[{ label: "Nhập Hàng", route: "/staff/imports" }]}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          /> */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1">
          <div className="rounded-xl border border-gray-100 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
