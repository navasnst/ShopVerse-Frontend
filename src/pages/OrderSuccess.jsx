
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function OrderSuccess() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(data.order);
      } catch (error) {
        console.error("Error loading order:", error);
      }
    };

    if (token) fetchOrder();
  }, [id, token]);

  if (!order)
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading order details...
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-3">
        🎉 Thank you for your purchase!
      </h1>
      <p className="text-lg">
        Your Order ID: <b>{order._id}</b>
      </p>
      <p className="text-gray-600 mt-2">
        We’ll notify you when your order ships.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
