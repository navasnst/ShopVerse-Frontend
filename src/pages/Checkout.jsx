
import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { user, token } = useContext(AuthContext);
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Check if coming from BUY NOW
  const buyNowProduct = location.state?.product || null;


  const items = buyNowProduct
    ? [
      {
        product: buyNowProduct,
        vendor: buyNowProduct.vendor?._id || buyNowProduct.vendor,
        quantity: 1,
      },
    ]
    : cart.map((item) => ({
      product: item.product,
      vendor:
        item.vendor ||
        item.product.vendor?._id ||
        item.product.vendor,
      quantity: item.quantity,
    }));


  // Calculate total dynamically
  const finalTotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return alert("Your cart is empty!");
    setIsPlacingOrder(true);

    try {
      const { data } = await api.post(
        "/orders",
        {
          products: items.map((i) => ({
            product: i.product._id,
            vendor:
              i.vendor?._id ||
              i.vendor ||
              i.product.vendor?._id ||
              i.product.vendor,

            quantity: i.quantity,
            price: i.product.price,
          })),
          shippingAddress: address,
          totalPrice: finalTotal,   // ⭐ ADD THIS FIX
          paymentMethod: paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/payment/${data.order._id}`);
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error placing order!");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-[70vh] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-lg mb-2">
          Order ID: <b>{orderSuccess._id}</b>
        </p>
        <p className="text-gray-600">
          You will receive a confirmation email shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6 bg-lightCard dark:bg-darkCard mt-10">

      {/* 🏠 Delivery Address */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className=" p-6 rounded-2xl shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <form className="space-y-3">
          {["fullName", "phone", "street", "city", "state", "postalCode", "country"].map(
            (field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={address[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            )
          )}
        </form>
      </motion.div>

      {/* 🧾 Order Summary */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className=" p-6 rounded-2xl shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-3 mb-4">
          {items.map((i) => (
            <div
              key={i.product._id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="font-semibold">{i.product.title}</p>
                <p className="text-sm text-gray-500">Qty: {i.quantity}</p>
              </div>
              <p className="font-semibold">
                ₹{i.product.price * i.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{finalTotal}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full mt-6 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition bg-gradient-to-r from-pink-800 to-pink-700"
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </motion.div>
    </div>
  );
}






