import React, { useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function Delete() {
    const { token, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to permanently delete your account?")) return;

        setLoading(true);
        setMessage("");

        try {
            await api.delete("/seller/delete", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("✅ Your seller account has been deleted.");
            logout(); // clear user data
            setTimeout(() => navigate("/"), 2000); // redirect home
        } catch (err) {
            console.error("Delete error:", err);
            setMessage("❌ Error deleting account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
            <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Delete Seller Account</h2>
            <p className="text-gray-600 mb-6 max-w-md">
                This action will permanently delete your seller account and all related data.
                Please confirm if you want to proceed.
            </p>

            {message && <div className="mb-4 text-sm">{message}</div>}

            <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium shadow-md"
            >
                {loading ? "Deleting..." : "Yes, Delete My Account"}
            </button>
        </div>
    );
}
