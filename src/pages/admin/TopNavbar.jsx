
import React, { useEffect, useState, useContext } from "react";
import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function SellerTopNavbar({ onToggleSidebar }) {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/admin/notifications", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setCount(res.data.notifications.length);
                }
            } catch (err) {
                console.error("Fetch Notifications Error:", err);
            }
        };
        fetchNotifications();

        // Optional: refresh every 30s for live updates
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [token]);

    const handleNotifications = () => navigate("/admin/notifications");

    return (
        <header className="fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 bg-white shadow z-50">
            {/* Left section */}
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden p-2 rounded hover:bg-gray-100 transition"
                    onClick={onToggleSidebar}
                >
                    <Menu size={22} />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold whitespace-nowrap">
                    Admin Panel
                </h1>
            </div>

            {/* Right section */}
            <button
                onClick={handleNotifications}
                className="relative p-2 rounded hover:bg-gray-100 transition"
            >
                <Bell size={22} />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                        {count}
                    </span>
                )}
            </button>
        </header>
    );
}
