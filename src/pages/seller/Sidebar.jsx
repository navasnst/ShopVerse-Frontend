
import React from 'react';
import {
    Home,
    Box,
    ShoppingCart,
    DollarSign,
    User,
    Star,
    Bell as BellIcon,
    Trash2,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
    { to: '/seller/dashboard', label: 'Dashboard', icon: Home },
    { to: '/seller/products', label: 'Products', icon: Box },
    // { to: '/seller/orders', label: 'Orders', icon: ShoppingCart },
    // { to: '/seller/earnings', label: 'Earnings', icon: DollarSign },
    // { to: '/seller/profile', label: 'Store Profile', icon: User },
    { to: '/seller/order-update', label: 'Update Orders', icon: ShoppingCart },
    // { to: '/seller/reviews', label: 'Reviews', icon: Star },
    // { to: '/seller/notifications', label: 'Notifications', icon: BellIcon },
    { to: '/seller/delete', label: 'Delete Account', icon: Trash2, danger: true },
];

export default function SellerSidebar({ isOpen, onClose }) {
    return (
        <>
            {/* 🔹 Overlay (click to close) - visible only on small screens */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                />
            )}

            {/* 🔹 Sidebar */}
            <aside
                className={`fixed md:static top-0 left-0 h-full bg-gray-50 border-r z-40 transform transition-transform duration-300 mt-15
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}
            >
                <nav className="p-4 flex flex-col gap-2 mt-16 md:mt-0">
                    {links.map((l) => {
                        const Icon = l.icon;
                        return (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                onClick={() => {
                                    // ✅ Close sidebar on small screens after clicking a link
                                    if (window.innerWidth < 768) onClose();
                                }}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-white shadow' : 'hover:bg-white'
                                    }`
                                }
                            >
                                <Icon /> <span>{l.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}

