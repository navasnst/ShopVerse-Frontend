
import React, { useEffect, useState } from "react";
import { sellerApi } from "../../hooks/useSellerApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    sellerApi.orders()
      .then((r) => setOrders(r.data.orders || []))
      .catch(console.error);
  }, []);

  async function markShipped(id) {
    try {
      await sellerApi.orderUpdateStatus(id, "shipped");
      setOrders((o) =>
        o.map((ord) =>
          ord._id === id ? { ...ord, orderStatus: "shipped" } : ord
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4 text-lg">My Orders</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-t">
              <td>{o._id}</td>
              <td>{o.user?.name}</td>

              {/* Show product names */}
              <td>
                {o.products.map((p) => (
                  <div key={p._id}>
                    {p.product?.name} × {p.quantity}
                  </div>
                ))}
              </td>

              <td>₹{o.totalPrice}</td>
              <td>{o.orderStatus}</td>

              <td className="flex gap-2">
                {o.orderStatus === "processing" && (
                  <button
                    className="text-blue-600"
                    onClick={() => markShipped(o._id)}
                  >
                    Mark Shipped
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 mt-5">No orders found.</p>
      )}
    </div>
  );
}
