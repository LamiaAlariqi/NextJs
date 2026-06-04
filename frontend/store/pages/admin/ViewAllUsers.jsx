import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';

const ViewAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/all_users", { withCredentials: true });
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:8000/api/v1/admin/user/role/${userId}`, { role: newRole }, {
                withCredentials: true
            });
            toast.success("User role updated successfully");
            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error(error.response?.data?.message || "Failed to update role");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">All Users</h1>
                        <p className="text-base-content/60">Manage and view all registered users.</p>
                    </div>
                    <div className="badge badge-primary badge-lg font-bold py-4 px-6 shadow-sm">
                        Total Users: {users.length}
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto w-full">
                                <table className="table table-zebra w-full">
                                    <thead className="bg-base-200/60 text-base-content/80 text-sm">
                                        <tr>
                                            <th className="py-4 pl-6">Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Registered At</th>
                                            <th className="text-right pr-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-base-200/30 transition-colors">
                                                <td className="pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-10 h-10 bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{user.name}</div>
                                                            <div className="text-xs opacity-50">ID: {user._id.substring(user._id.length - 6)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <select 
                                                        className={`select select-sm select-bordered font-semibold ${
                                                            user.role === 'admin' ? 'text-primary border-primary/50' : 'text-base-content/70'
                                                        }`}
                                                        value={user.role || 'user'}
                                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="text-base-content/60 text-sm">
                                                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                                </td>
                                                <td className="text-right pr-6">
                                                    <button className="btn btn-ghost btn-sm text-error hover:bg-error/10">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewAllUsers;
