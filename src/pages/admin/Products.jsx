
// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { motion } from "framer-motion";
// import { Eye, Trash2 } from "lucide-react"; 

// export default function AdminProducts() {
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     const fetchProducts = async () => {
//         try {
//             const res = await api.get("/admin/products");
//             setProducts(res.data.products || []);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const handleApprove = async () => {};

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this product?")) return;
//         try {
//             await api.delete(`/admin/products/${id}`);
//             fetchProducts();
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const viewProduct = (id) => {
//         window.location.href = `/products/${id}`; 
//     };

//     return (
//         <motion.div className="p-6 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
//             <div className="overflow-x-auto">
//                 <table className="w-full border border-gray-200">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th>Title</th>
//                             <th>Vendor</th>
//                             <th>Category</th>
//                             <th>Price</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products.map((p) => (
//                             <tr key={p._id} className="border-t">
//                                 <td className="p-2">{p.title}</td>
//                                 <td>{p.vendor?.shopName || p.vendor?.name || "N/A"}</td>
//                                 <td>{p.category}</td>
//                                 <td>₹{p.price}</td>
//                                 <td>{p.status}</td>

//                                 {/* ⭐ Updated Action Buttons */}
//                                 <td className="flex gap-3">

//                                     {/* 👁️ View Button */}
//                                     <Eye
//                                         className="text-blue-600 cursor-pointer"
//                                         onClick={() => viewProduct(p._id)}
//                                     />

//                                     {/* 🗑 Delete Button */}
//                                     <Trash2
//                                         className="text-gray-600 cursor-pointer"
//                                         onClick={() => handleDelete(p._id)}
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </motion.div>
//     );
// }









import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Eye, Trash2, Edit3, CheckCircle, XCircle } from "lucide-react";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({});

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

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
    };

    const viewProduct = (id) => {
        window.location.href = `/products/${id}`;
    };

    const openEditModal = (p) => {
        setEditingProduct(p._id);
        setFormData({
            title: p.title,
            price: p.price,
            stock: p.stock,
            category: p.category,
            description: p.description,
            status: p.status,
        });
    };

    const handleEditSubmit = async () => {
        try {
            await api.put(`/admin/products/${editingProduct}`, formData);
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const changeStatus = async (id, newStatus) => {
        try {
            await api.put(`/admin/products/${id}`, { status: newStatus });
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <motion.div
                className="p-6 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
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

                                    {/* Status Badge */}
                                    <td>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${p.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="flex gap-3">
                                        <Eye className="text-blue-600 cursor-pointer" onClick={() => viewProduct(p._id)} />

                                        {/* Edit */}
                                        <Edit3
                                            className="text-yellow-600 cursor-pointer"
                                            onClick={() => openEditModal(p)}
                                        />

                                        {/* Activate / Deactivate */}
                                        {p.status === "inactive" ? (
                                            <CheckCircle
                                                className="text-green-600 cursor-pointer"
                                                onClick={() => changeStatus(p._id, "active")}
                                            />
                                        ) : (
                                            <XCircle
                                                className="text-red-600 cursor-pointer"
                                                onClick={() => changeStatus(p._id, "inactive")}
                                            />
                                        )}

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

            {/* ================= EDIT PRODUCT MODAL ================= */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-96"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                    >
                        <h3 className="text-xl font-semibold mb-4">Edit Product</h3>

                        <input
                            className="border p-2 w-full mb-2"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <input
                            className="border p-2 w-full mb-2"
                            type="number"
                            placeholder="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />

                        <input
                            className="border p-2 w-full mb-2"
                            type="number"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />

                        <input
                            className="border p-2 w-full mb-2"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />

                        <textarea
                            className="border p-2 w-full mb-2"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        {/* Status Dropdown */}
                        <select
                            className="border p-2 w-full mb-4"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setEditingProduct(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={handleEditSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
