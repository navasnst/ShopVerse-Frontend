
import React, { useEffect, useState, useContext, useRef } from "react";
import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

export default function SellerTopNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Fetch seller notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
        const unread = res.data.notifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.put(
        "/notifications/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(0);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          Seller Panel
        </h1>
      </div>

      {/* Right section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="relative p-2 rounded hover:bg-gray-100 transition"
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {openDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="flex items-center justify-between p-3 border-b">
              <span className="font-semibold text-gray-700">Notifications</span>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 p-4 text-sm">
                  No notifications
                </p>
              ) : (
                notifications.map((note) => (
                  <div
                    key={note._id}
                    className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${!note.read ? "bg-gray-50" : ""
                      }`}
                    onClick={() => {
                      setOpenDropdown(false);
                      if (note.link) navigate(note.link);
                    }}
                  >
                    <p className="text-gray-800">{note.message}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
