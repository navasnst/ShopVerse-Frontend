
// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { motion } from "framer-motion";
// import { Eye, Trash2 } from "lucide-react";

// export default function Vendors() {
//     const [vendors, setVendors] = useState([]);
//     const [selectedVendor, setSelectedVendor] = useState(null);

//     useEffect(() => {
//         fetchVendors();
//     }, []);

//     const fetchVendors = async () => {
//         try {
//             const res = await api.get("/admin/vendors");
//             setVendors(res.data.vendors || []);
//         } catch (err) {
//             console.error("Error fetching vendors:", err);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this vendor?")) return;
//         try {
//             await api.delete(`/admin/vendors/${id}`);
//             fetchVendors();
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const handleView = (vendor) => {
//         setSelectedVendor(vendor);
//     };

//     const closeModal = () => setSelectedVendor(null);

//     return (
//         <motion.div
//             className="p-6 mt-10"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//         >
//             <h2 className="text-2xl font-semibold mb-4">Vendor Management</h2>
//             <div className="overflow-x-auto">
//                 <table className="w-full border border-gray-300 rounded-lg">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="p-3">Name</th>
//                             <th>Email</th>
//                             <th>Shop</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {vendors.map((v) => (
//                             <tr key={v._id} className="border-t">
//                                 <td className="p-3">{v.name}</td>
//                                 <td>{v.email}</td>
//                                 <td>{v.shopName}</td>
//                                 <td>
//                                     <span
//                                         className={`px-2 py-1 rounded ${v.status === "active"
//                                             ? "bg-green-100 text-green-700"
//                                             : "bg-red-100 text-red-700"
//                                         }`}
//                                     >
//                                         {v.status === "active" ? "Active" : "Inactive"}
//                                     </span>
//                                 </td>
//                                 <td className="flex gap-3 justify-center">
//                                     <Eye
//                                         className="cursor-pointer text-blue-600"
//                                         onClick={() => handleView(v)}
//                                     />
//                                     <Trash2
//                                         className="cursor-pointer text-red-600"
//                                         onClick={() => handleDelete(v._id)}
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Vendor Details Modal */}
//             {selectedVendor && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 w-96 relative">
//                         <h3 className="text-xl font-semibold mb-4">Vendor Details</h3>
//                         <p><strong>Name:</strong> {selectedVendor.name}</p>
//                         <p><strong>Email:</strong> {selectedVendor.email}</p>
//                         <p><strong>Shop Name:</strong> {selectedVendor.shopName}</p>
//                         <p><strong>Status:</strong> {selectedVendor.status === "active" ? "Active" : "Inactive"}</p>
//                         <button
//                             onClick={closeModal}
//                             className="absolute top-2 right-2 text-red-500 font-bold"
//                         >
//                             X
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </motion.div>
//     );
// }









import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Eye, Trash2, Edit } from "lucide-react";

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [editVendor, setEditVendor] = useState(null);

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

    const handleView = (vendor) => setSelectedVendor(vendor);

    const handleEdit = (vendor) => setEditVendor({ ...vendor });

    const closeModal = () => setSelectedVendor(null);
    const closeEditModal = () => setEditVendor(null);

    const saveVendorChanges = async () => {
        try {
            await api.put(`/admin/vendors/${editVendor._id}`, {
                name: editVendor.name,
                email: editVendor.email,
                shopName: editVendor.shopName,
                status: editVendor.status,
            });

            closeEditModal();
            fetchVendors();
        } catch (err) {
            console.error("Update vendor error:", err);
        }
    };

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
                                                : v.status === "inactive"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {v.status}
                                    </span>
                                </td>

                                <td className="flex gap-3 justify-center">
                                    <Eye
                                        className="cursor-pointer text-blue-600"
                                        onClick={() => handleView(v)}
                                    />

                                    <Edit
                                        className="cursor-pointer text-orange-600"
                                        onClick={() => handleEdit(v)}
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

            {/* ---------------- VIEW MODAL ---------------- */}
            {selectedVendor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 relative">
                        <h3 className="text-xl font-semibold mb-4">Vendor Details</h3>
                        <p><strong>Name:</strong> {selectedVendor.name}</p>
                        <p><strong>Email:</strong> {selectedVendor.email}</p>
                        <p><strong>Shop Name:</strong> {selectedVendor.shopName}</p>
                        <p><strong>Status:</strong> {selectedVendor.status}</p>

                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 font-bold"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------- EDIT MODAL ---------------- */}
            {editVendor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 relative">
                        <h3 className="text-xl font-semibold mb-4">Edit Vendor</h3>

                        <label className="block mb-2">Name</label>
                        <input
                            type="text"
                            value={editVendor.name}
                            onChange={(e) =>
                                setEditVendor({ ...editVendor, name: e.target.value })
                            }
                            className="w-full p-2 border rounded mb-3"
                        />

                        <label className="block mb-2">Email</label>
                        <input
                            type="email"
                            value={editVendor.email}
                            onChange={(e) =>
                                setEditVendor({ ...editVendor, email: e.target.value })
                            }
                            className="w-full p-2 border rounded mb-3"
                        />

                        <label className="block mb-2">Shop Name</label>
                        <input
                            type="text"
                            value={editVendor.shopName}
                            onChange={(e) =>
                                setEditVendor({ ...editVendor, shopName: e.target.value })
                            }
                            className="w-full p-2 border rounded mb-3"
                        />

                        <label className="block mb-2">Status</label>
                        <select
                            value={editVendor.status}
                            onChange={(e) =>
                                setEditVendor({ ...editVendor, status: e.target.value })
                            }
                            className="w-full p-2 border rounded mb-3"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="banned">Banned</option>

                        </select>

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={closeEditModal}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveVendorChanges}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>

                        <button
                            onClick={closeEditModal}
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

