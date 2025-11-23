
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"
import {
  Search,
  User,
  LogIn,
  ChevronDown,
  ShoppingCart,
  MoreVertical,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, logout, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showCategories, setShowCategories] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ Keep Navbar in sync if user updates profile image/name elsewhere
  useEffect(() => {
    const handleStorageChange = () => refreshUser();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshUser]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const categories = [
    "Mobiles",
    "TV & Appliances",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Toys",
    "Furniture",
  ];

  const handleCategoryClick = (category) => {
    const slug = category.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
    navigate(`/category/${slug}`);
    setShowCategories(false);
    setMobileMenuOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setResults([]);
      return;
    }

    const res = await api.get(`/products/search?q=${query}`);
    setResults(res.data.products);
  };

  const handleSellerClick = () => {
    setShowMoreMenu(false);
    if (!user) {
      navigate("/seller/login");
    } else if (role === "seller") {
      navigate("/seller/dashboard");
    } else {
      alert("You are not authorized as a seller!");
      navigate("/seller/login");
    }
  };

  const handleAdminClick = () => {
    setShowMoreMenu(false);
    if (!user) {
      navigate("/admin/login");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      alert("You are not authorized as an admin!");
      navigate("/admin/login");
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-400 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* ✅ Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-start cursor-pointer leading-tight"
          >
            <div className="flex items-center gap-2">
              <Link to="/">
                <img
                  src="/shop logo.png"
                  alt="Logo"
                  className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-white/30"
                />
              </Link>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-md tracking-wide">
                ShopVerse
              </h1>
            </div>
            <p className="text-xs sm:text-sm italic text-white/80 font-medium tracking-wider pl-14">
              Universe of Shopping ✨
            </p>
          </motion.div>

          {/* desktop search */}
          <div className="hidden md:flex items-center relative w-1/3">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />

            {/* 🔽 Search Results Dropdown */}
            {results.length > 0 && (
              <div className="absolute top-12 bg-white shadow-lg rounded-lg w-full p-2 z-50 max-h-64 overflow-y-auto">
                {results.map((item) => (
                  <a
                    key={item._id}
                    href={`/products/${item._id}`}
                    className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                  >
                    {item.title}   {/* <-- FIXED */}
                  </a>
                ))}
              </div>
            )}

          </div>


          {/* ✅ Right Side Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Categories */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center gap-1 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition"
              >
                <span className="font-medium">Categories</span>
                <ChevronDown
                  size={18}
                  className={`${showCategories ? "rotate-180" : ""} transition-transform`}
                />
              </button>

              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 mt-2 bg-white text-gray-700 shadow-xl rounded-md w-56 py-2 z-40"
                  >
                    {categories.map((cat, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleCategoryClick(cat)}
                        className="px-4 py-2 hover:bg-emerald-100 cursor-pointer"
                      >
                        {cat}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link to="/cart" className="block">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-full hover:bg-white/20 transition relative"
              >
                <ShoppingCart size={24} />
              </motion.button>
            </Link>

            {/* ✅ Profile Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition text-sm md:px-4 md:py-2"
                >
                  <img
                    src={
                      user.profileImage
                        ? user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `http://localhost:5000/${user.profileImage}`
                        : "/default-avatar.png"
                    }
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/60 shadow-sm"
                  />
                  <span className="hidden sm:inline font-medium truncate max-w-[100px]">
                    {user.name || "Profile"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`${showProfileMenu ? "rotate-180" : ""} transition-transform`}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 mt-2 bg-white/95 backdrop-blur-sm text-gray-800 shadow-2xl rounded-xl w-52 py-2 z-40 overflow-hidden border border-gray-100"
                    >
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                        <img
                          src={
                            user.profileImage
                              ? user.profileImage.startsWith("http")
                                ? user.profileImage
                                : `http://localhost:5000/${user.profileImage}`
                              : "/default-avatar.png"
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{user.name}</span>
                          <span className="text-xs text-gray-500 capitalize">{role}</span>
                        </div>
                      </div>

                      {/* ✅ My Profile */}
                      <Link
                        to={
                          role === "admin"
                            ? "/admin/profile"
                            : role === "seller"
                              ? "/seller/profile"
                              : "/profile"
                        }
                        onClick={() => setShowProfileMenu(false)}
                        className="px-4 py-2 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <User size={16} /> My Profile
                      </Link>

                      {role === "seller" && (
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="px-4 py-2 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        >
                          🛍️ Seller Dashboard
                        </Link>
                      )}

                      {role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="px-4 py-2 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        >
                          🧭 Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="px-4 py-2 text-left w-full hover:bg-red-50 text-red-600 font-medium transition-colors flex items-center gap-2"
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white text-emerald-600 px-3 py-1.5 rounded-full font-medium hover:bg-emerald-50 transition text-sm md:px-4 md:py-2"
                >
                  <LogIn size={18} /> Login
                </motion.button>
              </Link>
            )}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 rounded-full hover:bg-white/20 transition"
              >
                <MoreVertical size={22} />
              </button>

              <AnimatePresence>
                {showMoreMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 mt-2 bg-white text-gray-700 shadow-xl rounded-md w-44 py-2 z-40 flex flex-col"
                  >
                    <div
                      onClick={handleSellerClick}
                      className="px-4 py-2 hover:bg-emerald-100 cursor-pointer"
                    >
                      Seller
                    </div>
                    <div
                      onClick={handleAdminClick}
                      className="px-4 py-2 hover:bg-emerald-100 cursor-pointer"
                    >
                      Admin
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/20 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ✅ Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-72 bg-white text-gray-700 shadow-2xl z-50 p-3 flex flex-col justify-start"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="self-end p-2 rounded-full hover:bg-gray-200 transition mb-4"
              >
                <X size={24} />
              </button>
              
              <div className="mb-4 relative">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />

                {/* 🔽 Search Results Dropdown */}
                {results.length > 0 && (
                  <div className="absolute top-12 bg-white shadow-lg rounded-lg w-full p-2 z-50 max-h-64 overflow-y-auto">
                    {results.map((item) => (
                      <a
                        key={item._id}
                        href={`/products/${item._id}`}
                        className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      >
                        {item.title}   {/* <-- FIXED */}
                      </a>
                    ))}
                  </div>
                )}

              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Categories</h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat, i) => (
                    <div
                      key={i}
                      onClick={() => handleCategoryClick(cat)}
                      className="px-3 py-2 hover:bg-emerald-100 cursor-pointer rounded"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <div
                  onClick={handleSellerClick}
                  className="px-3 py-2 hover:bg-emerald-100 cursor-pointer rounded"
                >
                  Seller
                </div>
                <div
                  onClick={handleAdminClick}
                  className="px-3 py-2 hover:bg-emerald-100 cursor-pointer rounded"
                >
                  Admin
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <Link to="/cart" className="flex items-center gap-2">
                  <ShoppingCart size={22} /> Cart
                </Link>
                {user ? (
                  <>
                    <Link
                      to={
                        role === "admin"
                          ? "/admin/profile"
                          : role === "seller"
                            ? "/seller/profile"
                            : "/profile"
                      }
                      className="flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={22} /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center gap-2">
                    <LogIn size={22} /> Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

