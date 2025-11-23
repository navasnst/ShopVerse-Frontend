import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Download, Eye, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Cancel order
  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.put(
        `/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, orderStatus: "cancelled" } : order
        )
      );
    } catch (err) {
      alert("Error cancelling order");
    }
  };

  // Download invoice
  const handleDownloadInvoice = async (id) => {
    try {
      const res = await api.get(`/orders/${id}/invoice`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Error downloading invoice");
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading orders...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 ">
      <h1 className="text-2xl font-bold mb-6">🧾 My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-md bg-lightCard dark:bg-darkCard">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                {/* <th className="py-3 px-4">Status</th> */}
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium">{order._id.slice(-6)}</td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">₹{order.totalPrice}</td>
                  {/* <td className="py-3 px-4 capitalize">{order.orderStatus}</td> */}
                  <td className="py-3 px-4 flex justify-center gap-3">

                    {/* 🔵 View / Track Order */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/order/${order._id}`)}
                      title="Track Order"
                    >
                      <Eye size={18} />
                    </button>

                    {/* 🧾 Download invoice */}
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleDownloadInvoice(order._id)}
                      title="Download Invoice"
                    >
                      <Download size={18} />
                    </button>

                    {/* ❌ Cancel Order */}
                    {order.orderStatus === "processing" && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleCancelOrder(order._id)}
                        title="Cancel Order"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

function OrderDetails({ order, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✖</button>
        </div>

        <div className="space-y-2">
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Status:</b> {order.orderStatus}</p>
          <p><b>Payment:</b> {order.paymentMethod?.toUpperCase()}</p>
          <p><b>Total:</b> ₹{order.totalPrice}</p>
          <hr className="my-3" />
          <h3 className="font-semibold mb-2">Products:</h3>
          {order.products.map((p) => (
            <div key={p._id} className="flex justify-between border-b py-1">
              <span>{p.product?.title || "Product"}</span>
              <span>Qty: {p.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
