
import React, { useState } from "react";
import SellerSidebar from "./Sidebar";
import SellerTopNavbar from "./TopNavbar";
import { Outlet } from "react-router-dom";

export default function SellerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SellerSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col">
                <SellerTopNavbar
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="flex-1 p-4 mt-16">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
