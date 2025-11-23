
import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Heart } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function SubNavbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-lightCard dark:bg-darkCard border-b border-blue-100 dark:border-gray-700 shadow-sm fixed top-16 left-0 w-full z-40"
    >
      <div className="flex justify-center gap-10 py-3 items-center">
        {/* ✅ Navigation Links */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-base font-medium px-3 py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `text-base font-medium px-3 py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            }`
          }
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `text-base font-medium px-3 py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            }`
          }
        >
          Contact
        </NavLink>

        {/* ✅ Icons Section */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/myorders"
            className={({ isActive }) =>
              `text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ${
                isActive ? "text-blue-700 dark:text-blue-400" : ""
              }`
            }
            title="My Orders"
          >
            <User size={22} />
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ${
                isActive ? "text-blue-700 dark:text-blue-400" : ""
              }`
            }
            title="Wishlist"
          >
            <Heart size={22} />
          </NavLink>

          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}

