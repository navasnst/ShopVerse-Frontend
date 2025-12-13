
import api from "../api/axios";
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ Use AuthContext
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await api.post("/auth/login", formData);

      // Update AuthContext
      login(res.data.user, res.data.token); // sets user in context and localStorage

      // Redirect based on role
      if (res.data.user.role === "seller") navigate("/seller/dashboard");
      else if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/"); // regular user

    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 ">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div className="bg-white/20 p-3 rounded-full">
            <img src="/shop logo.png" alt="ShopVerse Logo" className="w-10 h-10 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold mt-2">ShopVerse</h1>
          <p className="text-white/80 text-sm">Login to your account</p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-red-500/80 px-3 py-2 rounded-lg mb-3 text-sm"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              placeholder="Enter your password"
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-all text-sm"
          >
            Login
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center justify-center">
          <div className="border-t border-white/40 w-full"></div>
          <span className="text-white/80 mx-2 text-xs">or</span>
          <div className="border-t border-white/40 w-full"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-white/90">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
