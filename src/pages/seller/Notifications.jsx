import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Bell, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SellerNotifications() {
    const { token } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/seller/notifications", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setNotifications(res.data.notifications);
                }
            } catch (err) {
                console.error("Fetch Notifications Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [token]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 animate-pulse">Loading notifications...</p>
            </div>
        );

    return (
        <motion.div
            className="p-6 bg-gray-50 min-h-screen pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Bell className="text-blue-600" /> Notifications
                </h1>

                {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                        No notifications yet 📭
                    </p>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n) => (
                            <motion.div
                                key={n._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white shadow-sm rounded-xl p-4 border hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-gray-800">{n.message}</p>
                                    <CheckCircle
                                        size={18}
                                        className="text-green-500 flex-shrink-0"
                                    />
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                                    <Clock size={14} />
                                    {new Date(n.createdAt).toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
