import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';

const DashboardAdmin = () => {
    const [products, setProducts] = useState([]);
    const [ordersCount, setOrdersCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const [combineStats, setCombineStats] = useState(null);

    const getDashboardData = async () => {
        try {
            const responseProducts = await axios.get("http://localhost:8000/api/v1/products");
            setProducts(responseProducts.data.products || []);
            
            try {
               const responseOrders = await axios.get("http://localhost:8000/api/v1/all_orders", { withCredentials: true });
               if(responseOrders.data?.orders) {
                   setOrdersCount(responseOrders.data.orders.length);
               }
            } catch (err) {
               console.log("Error fetching orders:", err.message);
            }

            try {
               const responseUsers = await axios.get("http://localhost:8000/api/v1/all_users", { withCredentials: true });
               if(responseUsers.data?.users) {
                   setUsersCount(responseUsers.data.users.length);
               }
            } catch (err) {
               console.log("Error fetching users:", err.message);
            }

        } catch (error) {
            console.log("Error fetching dashboard data:", error);
        }
    };

    const getCombineStats = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/users/combine-data", {
                withCredentials: true
            });
            setCombineStats(response.data);
        } catch (error) {
            console.log("Error fetching combined stats:", error);
        }
    };

    useEffect(() => {
        getDashboardData();
        getCombineStats();
    }, []);

    const stats = [
        {
            title: "Total Revenue", 
            value: combineStats ? `$${combineStats.total.toFixed(2)}` : "$0.00", 
            trend: "Updated", trendColor: "text-success", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        },
        {
            title: "Total Orders", 
            value: combineStats ? combineStats.orders.toString() : "0", 
            trend: "Live", trendColor: "text-success", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            ),
            link: "/admin/orders"
        },
        {
            title: "Active Users", 
            value: combineStats ? combineStats.users.toString() : "0", 
            trend: "Live", trendColor: "text-warning", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            ),
            link: "/admin/users"
        },
        {
            title: "Products", 
            value: combineStats ? combineStats.products.toString() : products.length.toString(), 
            trend: "Live", trendColor: "text-info", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Welcome back, Admin 👋</h1>
                        <p className="text-base-content/60 mt-1">Here is what's happening with your store today.</p>
                    </div>
                    <Link to="/admin/product/new" className="btn btn-primary shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Product
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        stat.link ? (
                            <Link key={index} to={stat.link} className="card bg-base-100 shadow-xl border border-base-200 hover:-translate-y-2 transition-transform duration-300 overflow-hidden relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="card-body p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-base-content/60">{stat.title}</p>
                                            <h3 className="text-3xl font-bold mt-2 text-base-content">{stat.value}</h3>
                                        </div>
                                        <div className="p-3 bg-base-200 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`text-sm font-bold ${stat.trendColor} bg-base-200 px-2 py-1 rounded-lg flex items-center`}>
                                            {stat.trend}
                                        </span>
                                        <span className="text-xs text-base-content/50">Click to view</span>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div key={index} className="card bg-base-100 shadow-xl border border-base-200 hover:-translate-y-2 transition-transform duration-300 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="card-body p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-base-content/60">{stat.title}</p>
                                            <h3 className="text-3xl font-bold mt-2 text-base-content">{stat.value}</h3>
                                        </div>
                                        <div className="p-3 bg-base-200 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`text-sm font-bold ${stat.trendColor} bg-base-200 px-2 py-1 rounded-lg flex items-center`}>
                                            {stat.trend}
                                        </span>
                                        <span className="text-xs text-base-content/50">Updated recently</span>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders Table Placeholder */}
                    <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body p-0">
                            <div className="p-6 border-b border-base-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Recent Activity</h2>
                                <button className="btn btn-sm btn-ghost text-primary hover:bg-primary/10">View All</button>
                            </div>
                            <div className="p-6 text-center text-base-content/60">
                                Recent orders and activities will appear here.
                            </div>
                        </div>
                    </div>

                    {/* Trending Products */}
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body p-6">
                            <h2 className="text-xl font-bold mb-6">Trending Products</h2>
                            <div className="space-y-6">
                                {products.length > 0 ? (
                                    products.slice(0, 5).map((product) => (
                                        <div key={product._id} className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-base-200 flex-shrink-0 relative">
                                                <img 
                                                    src={(product?.images && product.images.length > 0) ? product.images[0].url : "https://via.placeholder.com/150"} 
                                                    alt={product.title} 
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{product.title}</h4>
                                                <p className="text-xs text-base-content/60 mt-1">${product.price} • {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-sm text-base-content/60 py-4">
                                        Loading products...
                                    </div>
                                )}
                            </div>
                            <button className="btn btn-outline btn-primary w-full mt-6">View Inventory</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardAdmin;
