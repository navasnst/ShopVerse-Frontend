
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag } from "lucide-react";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useContext(CartContext);


  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!cart || cart.length === 0) return alert("Your cart is empty!");
    navigate("/checkout/:productId");
  };

  const handleContinueShopping = () => navigate("/products");

  return (
    <div className="container mx-auto px-6 py-10 mt-5">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      {!cart || cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <ShoppingBag size={60} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <button
            onClick={handleContinueShopping}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </motion.div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.product.images?.[0]?.startsWith("http")
                          ? item.product.images[0]
                          : item.product.images?.[0]
                            ? `http://localhost:5000/${item.product.images[0]}`
                            : "/placeholder.png"
                      }
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.product.title}
                      </h3>
                      <p className="text-gray-600">
                        ₹{item.product.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product, item.quantity - 1)
                        }
                        className="px-3 py-1 text-lg font-bold "
                      >
                        −
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product, item.quantity + 1)
                        }
                        className="px-3 py-1 text-lg font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-50 p-6 rounded-xl shadow-sm h-fit"
            >
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

              <div className="flex justify-between mb-2 text-gray-700">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-700">
                <span>Shipping</span>
                <span>Free (₹5000 above)</span>
              </div>

              <div className="flex justify-between text-lg font-bold text-blue-600 border-t pt-3">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-400 to-green-400 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full border border-gray-400 py-2 rounded-lg hover:bg-gray-100 bg-gradient-to-r from-green-500 to-green-500"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="w-full border border-red-400 text-red-600 py-2 rounded-lg hover:bg-red-50 bg-gradient-to-r from-green-600 to-green-600"
                >
                  Clear Cart
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}


