
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { motion } from "framer-motion";

const ORDER_STAGES = ["processing", "shipped", "delivered", "cancelled"];

export default function SellerTrackingUpdate() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seller orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get("/seller/my-orders");
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Seller orders error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, productId, status) => {
    try {
      await api.put(`/seller/orders/${orderId}/status`, { productId, status });
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          products: order.products.map((p) =>
            p.product._id === productId ? { ...p, orderStatus: status } : p
          ),
        }))
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-5">Loading orders...</div>;
  if (!orders.length) return <div className="p-5 text-gray-500">No orders found</div>;

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Update Order Tracking</h2>

      {orders.map((order) => (
        <div key={order._id} className="bg-white p-5 rounded-xl shadow mb-6">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Customer:</strong> {order.user?.name}</p>

          {order.products.map((p) => {
            const stageIndex = ORDER_STAGES.indexOf(p.orderStatus);
            return (
              <motion.div
                key={p.product._id}
                className="bg-gray-50 p-4 rounded-lg mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="font-semibold">{p.product?.title}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {p.quantity} | ₹{p.price}
                </p>

                {/* Status select */}
                <select
                  value={p.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(order._id, p.product._id, e.target.value)
                  }
                  className="border p-2 rounded mt-2"
                >
                  {ORDER_STAGES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

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
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
