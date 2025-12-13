
import React, { useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("✅ Registration successful:", res.data);
      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err.response || err.message);
      setError(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-5">
          <img
            src="/shop logo.png"
            alt="ShopVerse Logo"
            className="w-10 h-10 mb-2 rounded-full"
          />
          <h1 className="text-2xl font-bold">ShopVerse</h1>
          <p className="text-white/80 text-sm mt-1">Create your account</p>
        </div>

        {/* Alerts */}
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

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-green-500/80 px-3 py-2 rounded-lg mb-3 text-sm"
            >
              <CheckCircle2 size={18} />
              Registration successful! Redirecting...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 
              focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              placeholder="Enter your name"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 
              focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
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
              className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 
              focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              placeholder="Enter your password"
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg shadow-lg 
            hover:bg-gray-100 transition-all text-sm"
          >
            Register
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center justify-center">
          <div className="border-t border-white/40 w-full"></div>
          <span className="text-white/80 mx-2 text-xs">or</span>
          <div className="border-t border-white/40 w-full"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-white/90">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
