"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FiMenu,
  FiLogOut,
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
import SidebarItem from "../components/Sidebar/SidebarItem";
import SidebarDropdown from "../components/Sidebar/SidebarDropdown";
import Navbar from "../components/Navbar/Navbar";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayoutStaff: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  // Handler cho logout: xoá localStorage và điều hướng về trang chủ
  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/office.avif')" }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Wrapper */}
      <div className="relative flex min-h-screen text-gray-900">
        {/* SIDEBAR */}
        <aside
          className={`
            ${isSidebarOpen ? "w-64" : "w-20"} 
            bg-white/70 backdrop-blur-md shadow-lg flex flex-col 
            transition-all duration-300 rounded-r-2xl
          `}
        >
          {/* Brand/Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/30">
            {isSidebarOpen ? (
              <span className="text-xl font-bold">Staff Dashboard</span>
            ) : (
              <span className="text-xl font-bold">SD</span>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-black focus:outline-none"
            >
              <FiMenu />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <SidebarItem
              icon={<FiHome />}
              label="Dashboard"
              isOpen={isSidebarOpen}
              route="/staff-dashboard"
            />
               <SidebarDropdown
              id="warehouses"
              icon={<FiClipboard />}
              label="Warehouses"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Import Requests", route: "/staff-import-requests" },
                { label: "Dispatch Requests", route: "/staff-dispatch-request" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />


            <SidebarDropdown
              id="orders"
              icon={<FiShoppingCart />}
              label="Orders"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Receive Orders", route: "/orders/receive" },
                { label: "Confirm Orders", route: "/order/order-confirm" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <SidebarDropdown
              id="packing"
              icon={<FiCheckCircle />}
              label="Packing"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Pack & Update Status", route: "/staff/packing" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <SidebarDropdown
              id="delivery"
              icon={<FiTruck />}
              label="Delivery"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Track Deliveries", route: "/staff/delivery" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <SidebarDropdown
              id="returns"
              icon={<FiRotateCcw />}
              label="Returns"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Return Requests", route: "/staff/returns/requests" },
                { label: "Process Returns", route: "/staff/returns/process" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <SidebarItem
              icon={<FiMessageSquare />}
              label="Customer Feedback"
              isOpen={isSidebarOpen}
              route="/staff/feedback"
            />

            <SidebarDropdown
              id="reports"
              icon={<FiTrendingUp />}
              label="Reports"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Statistical Reports", route: "/staff/reports/statistics" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <SidebarDropdown
              id="imports"
              icon={<FiBox />}
              label="Imports"
              isOpen={isSidebarOpen}
              subItems={[
                { label: "Goods Import", route: "/staff/imports" },
              ]}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/30">
            <div
              onClick={handleLogout}
              className="flex items-center text-gray-800 hover:bg-white/40 p-2 rounded-md cursor-pointer transition-colors"
            >
              <div className="text-xl mr-2">
                <FiLogOut />
              </div>
              {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex flex-col flex-1 ml-3">
          <Navbar />
          <main className="overflow-y-auto flex-1 p-2 sm:p-4 md:p-6 -ml-2">
            <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-4 md:p-6 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutStaff;
