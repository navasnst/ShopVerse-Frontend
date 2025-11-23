
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import Profile from "./pages/Profile";
import SellerProfile from "./pages/SellerProfile";
import PaymentPage from "./pages/PaymentPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import CartPage from "./pages/CartPage";
import TermsPolicies from "./pages/TermsPolicies";
import ChatBot from "./pages/ChatBot";

import ProtectedRoute from "./Components/ProtectedRoute";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import SubNavbar from "./Components/SubNavbar";

// ✅ Seller Pages
import SellerLayout from "./pages/seller/SellerLayout";
import SellerLogin from "./pages/seller/SellerLogin";
import SellerRegister from "./pages/seller/SellerRegister";
import Dashboard from "./pages/seller/Dashboard";
import ProductForm from "./pages/seller/ProductForm";
import ProductsList from "./pages/ProductList";
import Orders from "./pages/seller/Orders";
import Earnings from "./pages/seller/Earnings";
import SellerNotifications from "./pages/seller/Notifications";
import Delete from "./pages/seller/Delete";


// ✅ Admin Pages + Layout
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import Vendors from "./pages/admin/Vendors";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import Payments from "./pages/admin/Payments";
import Settings from "./pages/admin/Settings";
import AdminNotifications from "./pages/admin/Notifications";
import OrderSuccess from "./pages/OrderSuccess";
import CategoryPage from "./pages/CategoryPage";
import SellerProducts from "./pages/seller/SellerProducts";
import OrderTrackingPage from "./pages/OrderTracking";
import TrackingUpdate from "./pages/seller/TrackingUpdate";
import SellerReviews from "./pages/seller/Reviews";

export default function App() {
  const location = useLocation();

  // ✅ Hide main navbar/footer for admin & seller panels
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSellerRoute = location.pathname.startsWith("/seller");
  const hideMainLayout = isAdminRoute || isSellerRoute;

  return (
    <div className="app">
      {/* 🌐 Show Navbar & SubNavbar only on user-facing pages */}
      {!hideMainLayout && (
        <>
          <Navbar />
          <SubNavbar />
          <ChatBot />
        </>
      )}

      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/:productId" element={<Checkout />} />
          <Route path="/payment/:orderId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/order/:id" element={<OrderTrackingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms-policies" element={<TermsPolicies />} />

          {/* 👤 User Auth Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myorders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* 🧾 Seller Auth */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />

          {/* 🧩 Seller Layout (TopNavbar + Sidebar + Outlet) */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute role="seller">
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductForm />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="my-products" element={<SellerProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order-update" element={<TrackingUpdate/>} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile" element={<SellerProfile />} />
            <Route path="reviews" element={<SellerReviews />} />
            <Route path="notifications" element={<SellerNotifications />} />
            <Route path="delete" element={<Delete />} />
          </Route>


          {/* 🛠️ Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* 🧩 Admin Layout (TopNavbar + Sidebar + Outlet) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>
        </Routes>
      </main>

      {/* 🌐 Footer only for user side */}
      {!hideMainLayout && <Footer />}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}
