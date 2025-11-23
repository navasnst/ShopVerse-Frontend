import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const ORDER_STAGES = ["processing", "shipped", "out for delivery", "delivered"];

export default function OrderTracking() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTracking = async () => {
            try {
                const res = await api.get(`/orders/${id}/tracking`);
                setOrder(res.data.order);
            } catch (err) {
                console.error("TRACKING ERROR:", err.response?.data || err);
                setError(err.response?.data?.message || "Failed to load tracking info");
            } finally {
                setLoading(false);
            }
        };

        if (token) loadTracking();
    }, [id, token]);

    const getStageIndex = (status) => {
        return ORDER_STAGES.indexOf(status?.toLowerCase());
    };

    if (loading) return <div className="p-5">Loading tracking info...</div>;
    if (error) return <div className="p-5 text-red-500">{error}</div>;
    if (!order) return <div className="p-5">No tracking info found.</div>;

    return (
        <div className="p-5 max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>

            <div className="bg-white p-5 rounded-xl shadow mb-6">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Seller:</strong> {order.seller?.shopName || order.seller?.name}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            </div>

            <h3 className="text-xl font-semibold mb-2">Products</h3>
            {order.products.map((p, idx) => {
                const stageIndex = getStageIndex(p.orderStatus);

                return (
                    <motion.div
                        key={idx}
                        className="bg-white p-4 rounded-xl shadow mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <p className="font-semibold">{p.product?.title}</p>
                        <p className="text-sm text-gray-600">
                            Quantity: {p.quantity} | ₹{p.price}
                        </p>

                        {/* Progress bar */}
                        <div className="flex items-center mt-4">
                            {ORDER_STAGES.map((stage, i) => (
                                <div key={i} className="flex-1 flex items-center">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2
                      ${i <= stageIndex ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-gray-300"}`}
                                    >
                                        {i <= stageIndex ? "✔" : i + 1}
                                    </div>
                                    {i !== ORDER_STAGES.length - 1 && (
                                        <div className={`flex-1 h-1 ${i < stageIndex ? "bg-green-500" : "bg-gray-300"}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Stage labels */}
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                            {ORDER_STAGES.map((stage, i) => (
                                <span key={i} className={`capitalize ${i <= stageIndex ? "text-green-500 font-medium" : ""}`}>
                                    {stage}
                                </span>
                            ))}
                        </div>

                        {p.arrivalDate && (
                            <p className="mt-2 text-sm text-gray-700">
                                Estimated Arrival: {new Date(p.arrivalDate).toLocaleDateString()}
                            </p>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
