
import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripePaymentForm = ({ amount, billing, onSuccess, onError, orderId, token }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create PaymentIntent
      const { data } = await api.post(
        "/payment",
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const clientSecret = data.clientSecret;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billing.name,
            email: billing.email,
            phone: billing.phone,
          },
        },
      });

      if (result.error) {
        onError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // Update order as PAID
        await api.put(
          `/orders/${orderId}/pay`,
          {
            paymentStatus: "paid",
            paymentMethod: "Stripe",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        onSuccess("Payment successful!");
        navigate(`/order-success/${orderId}`);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      onError(error.response?.data?.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div className="p-3 border rounded bg-gray-50">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Processing…" : `Pay ₹${amount}`}
      </button>
    </form>
  );
};

export default function PaymentPage() {
  const { token, user } = useContext(AuthContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [billing, setBilling] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [message, setMessage] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(true);
  const navigate = useNavigate();

  // Fetch the created order (NOT cart)
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(data.order);

      } catch (error) {
        console.error("Failed to load order:", error);
        setMessage("Unable to load order.");
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (loadingOrder)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading order…</p>
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-600">Order not found!</p>
      </div>
    );


  const subtotal = order.totalPrice;
  const gstRate = 0.18;
  const basePrice = subtotal / (1 + gstRate);
  const tax = Math.round(subtotal - basePrice);
  const shipping = subtotal > 5000 ? 0 : 100;
  const total = Math.round(basePrice + tax + shipping);


  const handlePlaceOrder = async () => {
    try {
      await api.put(
        `/orders/${orderId}/pay`,
        {
          paymentStatus: "pending",
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update order.");
    }
  };

  return (
    <div className=" min-h-screen py-10 bg-lightCard dark:bg-darkCard">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 p-6 rounded-2xl shadow-lg ">

        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🧾 Order Summary</h2>

          {order.products.map((item, index) => (
            <div key={index} className="flex justify-between border-b pb-2 mb-3">
              <p>{item.product?.title || item.name}</p>
              <p>
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          ))}

          <hr className="my-3" />

          <p className="flex justify-between">Subtotal: ₹{subtotal} (Inclusive Tax)</p>
          <p className="flex justify-between">Tax (18%): ₹{tax}</p>
          <p className="flex justify-between">Shipping: ₹{shipping}</p>
          <h3 className="flex justify-between text-lg font-semibold mt-2">
            Total: ₹{total}
          </h3>
        </div>

        {/* Payment Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">💳 Billing & Payment</h2>

          {/* Billing */}
          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={billing.name}
              onChange={(e) => setBilling({ ...billing, name: e.target.value })}
              placeholder="Full Name"
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              value={billing.email}
              onChange={(e) => setBilling({ ...billing, email: e.target.value })}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={billing.phone}
              onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
            />
            <textarea
              value={billing.address}
              onChange={(e) =>
                setBilling({ ...billing, address: e.target.value })
              }
              placeholder="Shipping Address"
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          {/* Payment Options */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Stripe"
                checked={paymentMethod === "Stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Pay by Card (Stripe)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery (COD)
            </label>
          </div>

          {/* Stripe Payment */}
          {paymentMethod === "Stripe" && (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                amount={total}
                billing={billing}
                orderId={orderId}
                token={token}
                onSuccess={setMessage}
                onError={setMessage}
              />
            </Elements>
          )}

          {/* COD */}
          {paymentMethod === "COD" && (
            <button
              onClick={handlePlaceOrder}
              className="w-full text-white py-2 rounded-lg"
            >
              Place COD Order
            </button>
          )}

          {message && (
            <p className="text-center mt-4 font-medium text-blue-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
