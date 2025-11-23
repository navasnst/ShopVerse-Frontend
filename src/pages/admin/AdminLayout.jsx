
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((s) => !s);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col">
        <TopNavbar onToggleSidebar={toggleSidebar} />

        {/* All admin pages are rendered here */}
        <main className="flex-1 p-4 sm:p-6 pt-20 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
