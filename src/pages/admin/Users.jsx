import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await api.get("/admin/users");
        setUsers(res.data.users || []);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this user?")) {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        }
    };

    return (
        <motion.div className="p-6 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <table className="w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Orders</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id} className="border-t">
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.totalOrders || 0}</td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Trash2
                                    className="text-red-600 cursor-pointer"
                                    onClick={() => handleDelete(u._id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
}
