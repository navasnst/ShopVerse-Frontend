// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { motion } from "framer-motion";
// import { Trash2 } from "lucide-react";

// export default function AdminUsers() {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         const res = await api.get("/admin/users");
//         setUsers(res.data.users || []);
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Delete this user?")) {
//             await api.delete(`/admin/users/${id}`);
//             fetchUsers();
//         }
//     };

//     return (
//         <motion.div className="p-6 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <h2 className="text-2xl font-semibold mb-4">User Management</h2>
//             <table className="w-full border">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Orders</th>
//                         <th>Joined</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((u) => (
//                         <tr key={u._id} className="border-t">
//                             <td>{u.name}</td>
//                             <td>{u.email}</td>
//                             <td>{u.totalOrders || 0}</td>
//                             <td>{new Date(u.createdAt).toLocaleDateString()}</td>
//                             <td>
//                                 <Trash2
//                                     className="text-red-600 cursor-pointer"
//                                     onClick={() => handleDelete(u._id)}
//                                 />
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </motion.div>
//     );
// }











import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Trash2, Edit3, Eye } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [viewUser, setViewUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data.users || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const openView = (u) => setViewUser(u);

    const openEdit = (u) => {
        setEditUser(u._id);
        setForm({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            role: u.role || "user",
            status: u.status || "active",
            shippingAddress: u.shippingAddress || "",
            shopName: u.shopName || "",
            shopDescription: u.shopDescription || "",
        });
    };

    const closeEdit = () => setEditUser(null);

    const submitEdit = async () => {
        try {
            const res = await api.put(`/admin/users/${editUser}`, form);
            if (res.data?.success) {
                setEditUser(null);
                fetchUsers();
            } else {
                alert("Update failed.");
            }
        } catch (err) {
            alert("Update error");
        }
    };

    return (
        <motion.div
            className="p-4 sm:p-6 mt-6 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                User Management
            </h2>

            {/* Responsive Table Wrapper */}
            <div className="w-full overflow-x-auto border rounded-lg">
                <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th>Email</th>
                            <th>Orders</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-t">
                                <td className="p-3 flex items-center gap-3">
                                    {u.profileImage ? (
                                        <img
                                            src={u.profileImage}
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt=""
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                            {u.name?.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-medium">{u.name}</div>
                                        <div className="text-xs text-gray-500">{u.role}</div>
                                    </div>
                                </td>

                                <td className="min-w-[180px]">{u.email}</td>

                                <td className="text-center">{u.totalOrders || 0}</td>

                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>

                                <td>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${u.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : u.status === "inactive"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {u.status}
                                    </span>
                                </td>

                                <td className="p-3 flex justify-center gap-4">
                                    <Eye
                                        className="text-blue-600 cursor-pointer hover:scale-110 transition"
                                        size={18}
                                        onClick={() => openView(u)}
                                    />
                                    <Edit3
                                        className="text-yellow-600 cursor-pointer hover:scale-110 transition"
                                        size={18}
                                        onClick={() => openEdit(u)}
                                    />
                                    <Trash2
                                        className="text-red-600 cursor-pointer hover:scale-110 transition"
                                        size={18}
                                        onClick={() => handleDelete(u._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {viewUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
                        <h3 className="text-xl font-semibold mb-3">User Details</h3>

                        <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {viewUser.name}</p>
                            <p><strong>Email:</strong> {viewUser.email}</p>
                            <p><strong>Phone:</strong> {viewUser.phone || "N/A"}</p>
                            <p><strong>Role:</strong> {viewUser.role}</p>
                            <p><strong>Joined:</strong> {new Date(viewUser.createdAt).toLocaleString()}</p>
                            <p><strong>Orders:</strong> {viewUser.totalOrders || 0}</p>
                        </div>

                        <button
                            className="absolute top-3 right-3 text-red-500 text-lg"
                            onClick={() => setViewUser(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        className="bg-white p-6 rounded-lg w-full max-w-md relative"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        <h3 className="text-xl font-semibold mb-4">Edit User</h3>

                        <div className="space-y-3">
                            {["name", "email", "phone"].map((field) => (
                                <div key={field}>
                                    <label className="text-sm">{field.toUpperCase()}</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={form[field]}
                                        onChange={(e) =>
                                            setForm({ ...form, [field]: e.target.value })
                                        }
                                    />
                                </div>
                            ))}

                            {/* Role */}
                            <div>
                                <label className="text-sm">Role</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-sm">Status</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm({ ...form, status: e.target.value })
                                    }
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={closeEdit}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={submitEdit}
                            >
                                Save
                            </button>
                        </div>

                        <button
                            className="absolute top-3 right-3 text-red-500 text-lg"
                            onClick={closeEdit}
                        >
                            ✕
                        </button>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
