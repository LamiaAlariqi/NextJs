import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';

const ViewAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("/api/v1/all_orders", { withCredentials: true });
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/v1/update_order_status/${orderId}`, { status: newStatus }, {
                withCredentials: true
            });
            toast.success("Order status updated successfully");
            
            if (newStatus === 'Delivered') {
                // Automatically delete the order once it is delivered, as requested by the user
                try {
                    await axios.delete(`/api/v1/delete_order/${orderId}`, {
                        withCredentials: true
                    });
                    toast.info("Order has been automatically deleted since it is delivered.");
                    setOrders(orders.filter(order => order._id !== orderId));
                } catch (deleteError) {
                    console.error("Error auto-deleting order:", deleteError);
                    toast.error("Order updated to Delivered, but failed to auto-delete.");
                    setOrders(orders.map(order => order._id === orderId ? { ...order, orderstatus: newStatus } : order));
                }
            } else {
                setOrders(orders.map(order => order._id === orderId ? { ...order, orderstatus: newStatus } : order));
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error(error.response?.data?.message || "Failed to update order status");
        }
    };

    const handleDelete = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this delivered order?")) {
            try {
                await axios.delete(`/api/v1/delete_order/${orderId}`, {
                    withCredentials: true
                });
                toast.success("Order deleted successfully");
                setOrders(orders.filter(order => order._id !== orderId));
            } catch (error) {
                console.error("Error deleting order:", error);
                toast.error(error.response?.data?.message || "Failed to delete order");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">All Orders</h1>
                        <p className="text-base-content/60">Manage and view all customer orders.</p>
                    </div>
                    <div className="badge badge-primary badge-lg font-bold py-4 px-6 shadow-sm">
                        Total Orders: {orders.length}
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
                                            <th className="py-4 pl-6">Order ID</th>
                                            <th>Items</th>
                                            <th>Status</th>
                                            <th>Total Amount</th>
                                            <th>Date</th>
                                            <th className="text-right pr-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-base-200/30 transition-colors">
                                                <td className="pl-6">
                                                    <span className="font-bold text-xs opacity-70">#{order._id.substring(order._id.length - 8)}</span>
                                                </td>
                                                <td>{order.orderItems.length} Items</td>
                                                <td>
                                                    <select 
                                                        className={`select select-sm select-bordered font-semibold ${
                                                            order.orderstatus === 'Delivered' ? 'text-success border-success/50' : 
                                                            order.orderstatus === 'Processing' ? 'text-warning border-warning/50' : 'text-info border-info/50'
                                                        }`}
                                                        value={order.orderstatus || 'Processing'}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        disabled={order.orderstatus === 'Delivered'}
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>
                                                </td>
                                                <td><span className="font-bold text-primary">${order.totalPrice.toFixed(2)}</span></td>
                                                <td className="text-base-content/60 text-sm">
                                                    {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                                                </td>
                                                <td className="text-right pr-6">
                                                    {order.orderstatus === 'Delivered' && (
                                                         <button onClick={() => handleDelete(order._id)} className="btn btn-ghost btn-sm text-error hover:bg-error/10">Delete</button>
                                                    )}
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

export default ViewAllOrders;
