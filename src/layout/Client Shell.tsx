"use client"
import React, { useState } from "react";
import {
  FiMenu,
  FiLogOut,
  FiHome,
  FiBox,
  FiShoppingCart,
  FiClipboard,
  FiUserCheck,
  FiTrendingUp,
  FiSettings,
} from "react-icons/fi";
import SidebarItem from "../components/Sidebar/SidebarItem";
import SidebarDropdown from "../components/Sidebar/SidebarDropdown";
import Navbar from "../components/Navbar/Navbar";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardShell: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="relative min-h-screen w-full font-sans">
      {/* Background gradient subtle */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-gray-100"
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative flex min-h-screen text-gray-700">
        {/* Sidebar */}
        <aside
          className={`${isSidebarOpen ? "w-64" : "w-20"
            } bg-white/70 backdrop-blur-lg shadow-lg flex flex-col transition-width duration-300 rounded-r-2xl`}
        >
          {/* Logo và toggle */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img
                src="/assets/logo.avif"
                alt="Funkytown Logo"
                className="h-8 w-8 object-contain cursor-pointer"
                onClick={() => setIsSidebarOpen((prev) => !prev)} // Thêm sự kiện mở/đóng sidebar
              />
              {isSidebarOpen && (
                <span className="text-xl font-extrabold text-black-600 tracking-tight">
                  FUNKYTOWN
                </span>
              )}
            </div>
          </div>


          {/* Menu */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
            <SidebarItem
              icon={<FiHome />}
              label="Tổng Quan"
              isOpen={isSidebarOpen}
              route="/dashboard"
            />
{/* 
            <SidebarDropdown
              id="products"
              icon={<FiBox />}
              label="Sản Phẩm"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Thêm Sản Phẩm", route: "/products/add" },
                { label: "Sửa / Xóa Sản Phẩm", route: "/products/edit" },
                { label: "Xem Kho", route: "/products/inventory" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            /> */}

            <SidebarDropdown
              id="orders"
              icon={<FiShoppingCart />}
              label="Đơn Hàng"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Phân Công Đơn Hàng", route: "/order/order-assign" },
                { label: "Xử Lý Khiếu Nại", route: "/order/return-order" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <SidebarDropdown
              id="inventory"
              icon={<FiClipboard />}
              label="Yêu Cầu Kho"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Nhập Kho", route: "/inventory/import" },
                { label: "Xuất Kho", route: "/inventory/dispatch" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <SidebarDropdown
              id="assignment"
              icon={<FiUserCheck />}
              label="Phân Công Nhân Viên"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Phân Công Nhập Kho", route: "/assign/import" },
                { label: "Phân Công Xuất Kho", route: "/assign/dispatch" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            {/* <SidebarDropdown
              id="promotions"
              icon={<FiTrendingUp />}
              label="Khuyến Mãi"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Quản Lý Khuyến Mãi", route: "/promotions/manage" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            /> */}

            {/* <SidebarDropdown
              id="reports"
              icon={<FiSettings />}
              label="Báo Cáo"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Hiệu Suất Bán Hàng", route: "/reports/sales" },
                { label: "Báo Cáo Quản Trị", route: "/reports/management" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            /> */}
          </nav>

        </aside>

        {/* Nội dung chính */}
        <div className="flex flex-col flex-1 ml-2 md:ml-6">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardShell;