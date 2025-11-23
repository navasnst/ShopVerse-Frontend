
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await api.get("/admin/vendors");
            setVendors(res.data.vendors || []);
        } catch (err) {
            console.error("Error fetching vendors:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this vendor?")) return;
        try {
            await api.delete(`/admin/vendors/${id}`);
            fetchVendors();
        } catch (err) {
            console.error(err);
        }
    };

    const handleView = (vendor) => {
        setSelectedVendor(vendor);
    };

    const closeModal = () => setSelectedVendor(null);

    return (
        <motion.div
            className="p-6 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className="text-2xl font-semibold mb-4">Vendor Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Name</th>
                            <th>Email</th>
                            <th>Shop</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((v) => (
                            <tr key={v._id} className="border-t">
                                <td className="p-3">{v.name}</td>
                                <td>{v.email}</td>
                                <td>{v.shopName}</td>
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded ${v.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {v.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="flex gap-3 justify-center">
                                    <Eye
                                        className="cursor-pointer text-blue-600"
                                        onClick={() => handleView(v)}
                                    />
                                    <Trash2
                                        className="cursor-pointer text-red-600"
                                        onClick={() => handleDelete(v._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vendor Details Modal */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 relative">
                        <h3 className="text-xl font-semibold mb-4">Vendor Details</h3>
                        <p><strong>Name:</strong> {selectedVendor.name}</p>
                        <p><strong>Email:</strong> {selectedVendor.email}</p>
                        <p><strong>Shop Name:</strong> {selectedVendor.shopName}</p>
                        <p><strong>Status:</strong> {selectedVendor.status === "active" ? "Active" : "Inactive"}</p>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 font-bold"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}