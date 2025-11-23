import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Bell, CheckCircle } from "lucide-react";

export default function AdminNotifications() {
    const { token } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/api/admin/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setNotifications(res.data.notifications);
            }
        } catch (err) {
            console.error("Error fetching notifications", err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/admin/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error("Error marking notification as read", err);
        }
    };

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="text-blue-600" /> Notifications
            </h1>

            {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications available.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {notifications.map((n) => (
                        <div
                            key={n._id}
                            className={`p-4 rounded-lg shadow-sm border ${n.isRead ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                                } flex flex-col md:flex-row md:items-center md:justify-between`}
                        >
                            <div>
                                <h2 className="font-semibold">{n.title}</h2>
                                <p className="text-sm text-gray-600">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-2 md:mt-0">
                                {!n.isRead && (
                                    <button
                                        onClick={() => markAsRead(n._id)}
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <CheckCircle size={16} /> Mark as read
                                    </button>
                                )}
                                {n.link && (
                                    <a
                                        href={n.link}
                                        className="text-gray-600 hover:text-blue-600 text-sm"
                                    >
                                        View
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
