
import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/vendors", label: "Vendor Management" },
  { to: "/admin/products", label: "Product Management" },
  { to: "/admin/orders", label: "Order Management" },
  { to: "/admin/users", label: "User Management" },
  // { to: "/admin/payments", label: "Payments & Transactions" },
  // { to: "/admin/settings", label: "Settings" },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for small screens */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 w-64 bg-gray-50 h-full border-r z-50 transform transition-transform duration-300 ease-in-out mt-15
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:z-0 md:block`}
      >
        <nav className="p-4 flex flex-col gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `p-2 rounded block ${
                  isActive ? "bg-white shadow font-medium" : "hover:bg-gray-100"
                }`
              }
              onClick={onClose} // close drawer on click (mobile)
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

