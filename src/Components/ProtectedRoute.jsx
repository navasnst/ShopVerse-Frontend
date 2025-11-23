
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  // ✅ Handle admin/seller/user login from localStorage
  const storedUser =
    user ||
    JSON.parse(localStorage.getItem("adminInfo")) ||
    JSON.parse(localStorage.getItem("sellerInfo")) ||
    JSON.parse(localStorage.getItem("shopverseUser"));

  if (!storedUser) {
    // Not logged in
    if (role === "admin") return <Navigate to="/admin/login" replace />;
    if (role === "seller") return <Navigate to="/seller/login" replace />;
    return <Navigate to="/login" replace />;
  }

  // ✅ Check for role-based protection
  if (role && storedUser.role !== role) {
    alert(`Access denied. Only ${role}s can access this page.`);
    return <Navigate to="/" replace />;
  }

  return children;
}
