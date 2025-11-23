
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react"; 

export default function AdminProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/admin/products");
            setProducts(res.data.products || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApprove = async () => {};

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const viewProduct = (id) => {
        window.location.href = `/products/${id}`; 
    };

    return (
        <motion.div className="p-6 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>Title</th>
                            <th>Vendor</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id} className="border-t">
                                <td className="p-2">{p.title}</td>
                                <td>{p.vendor?.shopName || p.vendor?.name || "N/A"}</td>
                                <td>{p.category}</td>
                                <td>₹{p.price}</td>
                                <td>{p.status}</td>

                                {/* ⭐ Updated Action Buttons */}
                                <td className="flex gap-3">

                                    {/* 👁️ View Button */}
                                    <Eye
                                        className="text-blue-600 cursor-pointer"
                                        onClick={() => viewProduct(p._id)}
                                    />

                                    {/* 🗑 Delete Button */}
                                    <Trash2
                                        className="text-gray-600 cursor-pointer"
                                        onClick={() => handleDelete(p._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
