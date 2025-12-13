import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await api.get("/admin/orders");
        setOrders(res.data.orders || []);
    };

    return (
        <motion.div className="p-6 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Vendor</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o._id} className="border-t">
                                <td>{o._id}</td>
                                <td>{o.user?.name}</td>
                                <td>{o.products[0]?.vendor?.shopName || "N/A"}</td>
                                <td>₹{o.totalPrice}</td>
                                <td>
                                    {o.products?.[0]?.orderStatus
                                        ? o.products[0].orderStatus.charAt(0).toUpperCase() + o.products[0].orderStatus.slice(1)
                                        : "N/A"}
                                </td>
                                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
