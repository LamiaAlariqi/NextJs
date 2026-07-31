"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const [activeTab, setActiveTab] = useState("overview"); // "overview", "pending", "products", "users"
  const [pendingProducts, setPendingProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setAdminOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} status updated to "${newStatus}".`);
  };

  useEffect(() => {
    // Check logged in user role
    const checkUserRole = () => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        const savedUser = localStorage.getItem("aura_user");
        if (savedUser) {
          try {
            setCurrentUser(JSON.parse(savedUser));
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setIsCheckingUser(false);
    };

    checkUserRole();
    window.addEventListener("aura_login_state_change", checkUserRole);
    return () => window.removeEventListener("aura_login_state_change", checkUserRole);
  }, [session?.user]);

  useEffect(() => {
    // Fetch products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          const approved = data.products.filter((p) => p.isApproved !== false);
          const pending = data.products.filter((p) => p.isApproved === false);
          setApprovedProducts(approved);
          setPendingProducts(pending);
        }
      })
      .catch((e) => console.error("Failed to load products", e));

    // Fetch users
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data?.users) {
          setUsers(data.users);
        }
      })
      .catch((e) => console.error("Failed to load users", e));

    // Fetch orders
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data?.orders) {
          setAdminOrders(data.orders);
        }
      })
      .catch((e) => console.error("Failed to load orders", e));
  }, []);

  const handleApprove = async (product) => {
    const pId = product._id || product.id;
    try {
      const res = await fetch(`/api/products/${pId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPendingProducts((prev) => prev.filter((p) => (p._id || p.id) !== pId));
        setApprovedProducts((prev) => [
          { ...product, isApproved: true, status: "Approved & Live" },
          ...prev,
        ]);
        showToast(`✓ "${product.title}" has been approved and is now Live in Store!`);
      } else {
        showToast(`✕ Failed to approve product in database.`);
      }
    } catch (e) {
      console.error(e);
      showToast(`✕ Error connecting to API server.`);
    }
  };

  const handleReject = async (productId, title) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPendingProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
        showToast(`✕ Listing "${title}" was rejected and removed.`);
      } else {
        showToast(`✕ Failed to reject listing.`);
      }
    } catch (e) {
      console.error(e);
      showToast(`✕ Error connecting to API server.`);
    }
  };

  const handleDeleteProduct = async (productId, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApprovedProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
        showToast(`Deleted "${title}".`);
      } else {
        showToast(`✕ Failed to delete product.`);
      }
    } catch (e) {
      console.error(e);
      showToast(`✕ Error connecting to API server.`);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            (u._id || u.id) === userId ? { ...u, role: newRole } : u
          )
        );
        showToast(`User role updated to "${newRole}".`);
      } else {
        showToast(`✕ Failed to update user role.`);
      }
    } catch (e) {
      console.error(e);
      showToast(`✕ Error connecting to API server.`);
    }
  };

  const filteredProducts = approvedProducts.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0d0f17] text-slate-100 font-sans">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white font-semibold text-xs px-5 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-2 border border-white/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>{notification}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-[#1e2336] bg-[#121522] p-6 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-8">
          {/* Logo & Admin Badge */}
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-2 group">
              <span className="text-lg font-black tracking-[0.2em] text-white">
                A U R A
              </span>
              <span className="text-[9px] font-extrabold uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                PRO
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === "overview"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-slate-400 hover:bg-[#1a1e30] hover:text-white"
                }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === "pending"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                : "text-slate-400 hover:bg-[#1a1e30] hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Pending Approvals</span>
              </div>
              {pendingProducts.length > 0 && (
                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {pendingProducts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === "products"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-slate-400 hover:bg-[#1a1e30] hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Products Directory</span>
              </div>
              <span className="text-[10px] opacity-70">{approvedProducts.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === "users"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-slate-400 hover:bg-[#1a1e30] hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>User Management</span>
              </div>
              <span className="text-[10px] opacity-70">{users.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === "orders"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-slate-400 hover:bg-[#1a1e30] hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Store Orders</span>
              </div>
              <span className="text-[10px] opacity-70">{adminOrders.length}</span>
            </button>
          </nav>
        </div>

        {/* Admin Footer Info */}
        <div className="hidden lg:flex flex-col gap-3 pt-6 border-t border-[#1e2336]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#181c2d] border border-[#262c45]">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-black text-xs flex items-center justify-center border border-purple-500/30">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Admin Control</span>
              <span className="text-[9px] text-emerald-400 font-semibold">● Active Session</span>
            </div>
          </div>
          <Link
            href="/products"
            className="w-full text-center py-2 text-[10px] font-bold tracking-wider text-slate-400 hover:text-white uppercase transition-colors"
          >
            ← Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
              Admin Portal / {activeTab.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              Control Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <Link
              href="/addProduct"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span className="text-sm font-black">+</span> Add New Item
            </Link>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#141724] p-6 rounded-3xl border border-[#24293e] flex flex-col justify-between gap-4 shadow-sm hover:border-purple-500/50 transition-colors">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Store Value</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-2xl lg:text-3xl font-black text-white">
                ${approvedProducts.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.stocks) || 1), 0).toLocaleString()}
              </span>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">● Live Inventory Total</p>
            </div>
          </div>

          <div className="bg-[#141724] p-6 rounded-3xl border border-[#24293e] flex flex-col justify-between gap-4 shadow-sm hover:border-amber-500/50 transition-colors">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Pending Approvals</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-2xl lg:text-3xl font-black text-white">{pendingProducts.length} Items</span>
              <p className="text-[10px] text-amber-400 font-semibold mt-1">Requires Review</p>
            </div>
          </div>

          <div className="bg-[#141724] p-6 rounded-3xl border border-[#24293e] flex flex-col justify-between gap-4 shadow-sm hover:border-emerald-500/50 transition-colors">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Live Store Products</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-2xl lg:text-3xl font-black text-white">{approvedProducts.length} Active</span>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">Published Publicly</p>
            </div>
          </div>

          <div className="bg-[#141724] p-6 rounded-3xl border border-[#24293e] flex flex-col justify-between gap-4 shadow-sm hover:border-blue-500/50 transition-colors">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Registered Members</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-2xl lg:text-3xl font-black text-white">{users.length} Users</span>
              <p className="text-[10px] text-blue-400 font-semibold mt-1">Verified Accounts</p>
            </div>
          </div>
        </div>

        {/* TAB CONTENT: Overview */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions Panel */}
              <div className="bg-[#141724] border border-[#24293e] rounded-3xl p-6 flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setActiveTab("pending")}
                    className="w-full text-left bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 p-4 rounded-2xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer"
                  >
                    <span>Review Pending Submissions</span>
                    <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">
                      {pendingProducts.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("products")}
                    className="w-full text-left bg-[#1c2134] hover:bg-[#232940] border border-[#2b324d] text-white p-4 rounded-2xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer"
                  >
                    <span>Browse Store Products</span>
                    <span className="text-slate-400 font-semibold text-[10px]">{approvedProducts.length} items</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full text-left bg-[#1c2134] hover:bg-[#232940] border border-[#2b324d] text-white p-4 rounded-2xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer"
                  >
                    <span>Manage Registered Users</span>
                    <span className="text-slate-400 font-semibold text-[10px]">{users.length} users</span>
                  </button>
                </div>
              </div>

              {/* Status Summary Card */}
              <div className="lg:col-span-2 bg-[#141724] border border-[#24293e] rounded-3xl p-6 flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">System Moderation Rules</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    User-submitted products are placed under review before being made public. Approved products automatically appear on the storefront.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#24293e] pt-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Approvals</span>
                    <p className="text-xl font-extrabold text-amber-400 mt-0.5">{pendingProducts.length} Items</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live Store Listings</span>
                    <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{approvedProducts.length} Items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Pending Approvals */}
        {activeTab === "pending" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Items Waiting For Approval</h2>
                <p className="text-xs text-slate-400">
                  Review products submitted by store sellers before making them public.
                </p>
              </div>
            </div>

            {pendingProducts.length === 0 ? (
              <div className="bg-[#141724] p-12 rounded-3xl border border-[#24293e] text-center flex flex-col items-center gap-3">
                <h3 className="text-base font-bold text-white">No Pending Products</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  All submitted products have been reviewed and processed.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingProducts.map((prod) => (
                  <div
                    key={prod._id || prod.id}
                    className="bg-[#141724] rounded-3xl border border-amber-500/30 p-5 flex flex-col justify-between gap-4 shadow-xl relative overflow-hidden"
                  >
                    <span className="absolute top-4 left-4 z-10 text-[9px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500 text-white shadow-md">
                      Pending Approval
                    </span>

                    <div className="h-44 rounded-2xl overflow-hidden bg-[#1c2134] flex items-center justify-center relative p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-extrabold text-purple-400 uppercase">
                        {prod.category} • {prod.condition || "New"}
                      </span>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{prod.title}</h3>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-slate-400">Price:</span>
                        <span className="font-extrabold text-white text-sm">${prod.price}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-[#24293e]">
                      <button
                        onClick={() => handleApprove(prod)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(prod._id || prod.id, prod.title)}
                        className="flex-1 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: Products Directory */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Active Store Products</h2>
                <p className="text-xs text-slate-400">
                  Browse and manage all live items published on the store.
                </p>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1c2134] border border-[#2b324d] rounded-full px-5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-full sm:w-64 placeholder:text-slate-400"
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-[#141724] p-12 rounded-3xl border border-[#24293e] text-center flex flex-col items-center gap-3">
                <h3 className="text-base font-bold text-white">No Products Found</h3>
                <p className="text-xs text-slate-400">There are currently no active products in the store.</p>
              </div>
            ) : (
              <div className="bg-[#141724] rounded-3xl border border-[#24293e] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#24293e] bg-[#1a1e2e] text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#24293e] text-xs">
                      {filteredProducts.map((prod) => (
                        <tr key={prod._id || prod.id} className="hover:bg-[#1a1e2e] transition-colors">
                          <td className="py-4 px-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#1c2134] flex items-center justify-center shrink-0 border border-[#2b324d] p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={prod.image} alt={prod.title} className="max-h-full max-w-full object-contain" />
                            </div>
                            <span className="font-semibold text-white">{prod.title}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-300">{prod.category}</td>
                          <td className="py-4 px-6 font-black text-white">${prod.price}</td>
                          <td className="py-4 px-6">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                              ● Live Store
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteProduct(prod._id || prod.id, prod.title)}
                              className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: User Management */}
        {activeTab === "users" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Store Members & Roles</h2>
              <p className="text-xs text-slate-400">
                Manage registered user accounts and admin privileges.
              </p>
            </div>

            {users.length === 0 ? (
              <div className="bg-[#141724] p-12 rounded-3xl border border-[#24293e] text-center flex flex-col items-center gap-3">
                <h3 className="text-base font-bold text-white">No Registered Users</h3>
                <p className="text-xs text-slate-400">User list will automatically populate when users register.</p>
              </div>
            ) : (
              <div className="bg-[#141724] rounded-3xl border border-[#24293e] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#24293e] bg-[#1a1e2e] text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">
                        <th className="py-4 px-6">User</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Role</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#24293e] text-xs">
                      {users.map((usr) => (
                        <tr key={usr._id || usr.id} className="hover:bg-[#1a1e2e] transition-colors">
                          <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center border border-purple-500/30">
                              {usr.name ? usr.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            {usr.name || "Anonymous User"}
                          </td>
                          <td className="py-4 px-6 text-slate-300">{usr.email}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${usr.role === "admin"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-[#1c2134] text-slate-300"
                                }`}
                            >
                              {usr.role || "user"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleToggleRole(usr._id || usr.id, usr.role)}
                              className="border border-[#2b324d] hover:bg-[#1c2134] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                            >
                              Toggle Role ({usr.role === "admin" ? "Make User" : "Make Admin"})
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: Orders Management */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Store Orders & Logistics</h2>
              <p className="text-xs text-slate-400">
                Track customer purchases and update order fulfillment status.
              </p>
            </div>

            <div className="bg-[#141724] rounded-3xl border border-[#24293e] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#24293e] bg-[#1a1e2e] text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Total</th>
                      <th className="py-4 px-6">Current Status</th>
                      <th className="py-4 px-6 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24293e] text-xs">
                    {adminOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#1a1e2e] transition-colors">
                        <td className="py-4 px-6 font-bold text-white">{ord.id}</td>
                        <td className="py-4 px-6 text-slate-300">{ord.customer}</td>
                        <td className="py-4 px-6 text-slate-400">{ord.date}</td>
                        <td className="py-4 px-6 font-extrabold text-white">${ord.total}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                              ord.status === "Delivered"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : ord.status === "Shipped"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : ord.status === "Processing"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            ● {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-[#1c2134] border border-[#2b324d] text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                          >
                            <option value="Processing" className="bg-[#141724]">Processing</option>
                            <option value="Shipped" className="bg-[#141724]">Shipped / In Transit</option>
                            <option value="Delivered" className="bg-[#141724]">Delivered</option>
                            <option value="Cancelled" className="bg-[#141724]">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
