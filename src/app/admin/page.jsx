"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview"); // overview, products, users, orders
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    description: "",
    stocks: 1,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  useEffect(() => {
    // Fetch products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          setApprovedProducts(data.products);
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

  const handleDeleteProduct = async (productId, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApprovedProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
        showToast(`🗑️ "${title}" deleted successfully.`);
      } else {
        showToast(`✕ Failed to delete product.`);
      }
    } catch (e) {
      console.error(e);
      showToast(`✕ Error connecting to API server.`);
    }
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title || "",
      price: product.price || "",
      category: product.category || "",
      image: product.image || "",
      description: product.description || "",
      stocks: product.stocks || 1,
    });
  };

  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const productId = editingProduct._id || editingProduct.id;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApprovedProducts((prev) =>
          prev.map((p) => ((p._id || p.id) === productId ? { ...p, ...editFormData } : p))
        );
        showToast(`✓ "${editFormData.title}" updated successfully!`);
        setEditingProduct(null);
      } else {
        showToast(`✕ Failed to update product: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      showToast(`✕ Error connecting to server.`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId || o.id === orderId || o._id === orderId
              ? { ...o, status: newStatus }
              : o
          )
        );
        showToast(`✓ Order status updated to "${newStatus}"!`);
      } else {
        showToast(`✕ Failed to update order status.`);
      }
    } catch (e) {
      console.error(e);
      showToast(`✕ Error connecting to server.`);
    }
  };

  // Logged-in admin user info & permission check
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthAndSync = () => {
      const savedUser = localStorage.getItem("aura_user");
      if (!savedUser) {
        // User logged out -> Redirect to Login immediately!
        router.push("/Login");
        return;
      }

      try {
        const u = JSON.parse(savedUser);
        if (!u) {
          router.push("/Login");
          return;
        }

        // Check initial cached role
        const cachedRole = (u.role || "").toLowerCase().trim().replace(/[\s_]/g, "");
        if (cachedRole === "user" || cachedRole === "customer") {
          router.push("/home");
          return;
        }

        setCurrentUser(u);

        // Sync live profile from MongoDB
        const userId = u._id || u.id;
        if (userId) {
          fetch(`/api/users/${userId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data?.user) {
                const liveRole = (data.user.role || "").toLowerCase().trim().replace(/[\s_]/g, "");
                if (liveRole === "user" || liveRole === "customer") {
                  router.push("/home");
                  return;
                }
                setCurrentUser(data.user);
                localStorage.setItem("aura_user", JSON.stringify(data.user));
              }
            })
            .catch((e) => console.error("Failed to sync fresh user role", e))
            .finally(() => setIsCheckingAuth(false));
        } else {
          setIsCheckingAuth(false);
        }
      } catch (e) {
        console.error(e);
        router.push("/Login");
      }
    };

    checkAuthAndSync();

    // Listen to global logout event
    const handleAuthChange = () => {
      const savedUser = localStorage.getItem("aura_user");
      if (!savedUser) {
        router.push("/Login");
      } else {
        checkAuthAndSync();
      }
    };

    window.addEventListener("aura_login_state_change", handleAuthChange);
    return () => {
      window.removeEventListener("aura_login_state_change", handleAuthChange);
    };
  }, [router]);

  const roleClean = (currentUser?.role || "").toLowerCase().trim().replace(/[\s_]/g, "");
  const isSuperAdmin =
    roleClean === "" ||
    roleClean === "admin" ||
    roleClean === "superadmin" ||
    roleClean === "superadmin" ||
    (roleClean.includes("admin") && !roleClean.includes("moderator"));

  const handleUpdateUserRole = async (userId, userName, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => ((u._id || u.id) === userId ? { ...u, role: newRole } : u))
        );
        showToast(`✓ User "${userName}" role changed to ${newRole.toUpperCase()}!`);
      } else {
        showToast(`✕ Failed to update user role.`);
      }
    } catch (e) {
      console.error(e);
      showToast(`✕ Error connecting to API server.`);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to remove user "${userName}"?`)) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
        showToast(`✓ User "${userName}" was removed.`);
      } else {
        showToast(`✕ Failed to remove user.`);
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

  const totalStoreValue = approvedProducts.reduce(
    (acc, p) => acc + (Number(p.price) || 0) * (Number(p.stocks) || 1),
    0
  );

  const CATEGORY_OPTIONS = [
    "Electronics",
    "Furniture",
    "Cars",
    "Makeup & Beauty",
    "Clothing & Fashion",
    "Audio",
    "Wearables",
    "Ambient Home",
    "Other Categories"
  ];

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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "overview"
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
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "products"
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

            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "users"
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
            )}

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "orders"
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
            href="/home"
            className="text-xs text-center text-slate-400 hover:text-white py-2 rounded-xl transition-colors font-medium"
          >
            ← Exit to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-xs text-slate-400">
              Manage inventory, edit products, inspect users, and track live orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/addProduct"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span className="text-sm font-black">+</span> Add New Product
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
                ${totalStoreValue.toLocaleString()}
              </span>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">● Live Inventory Total</p>
            </div>
          </div>

          <div className="bg-[#141724] p-6 rounded-3xl border border-[#24293e] flex flex-col justify-between gap-4 shadow-sm hover:border-amber-500/50 transition-colors">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Completed Store Orders</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-2xl lg:text-3xl font-black text-white">{adminOrders.length} Orders</span>
              <p className="text-[10px] text-amber-400 font-semibold mt-1">Stripe Payment Confirmed</p>
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
                    onClick={() => setActiveTab("products")}
                    className="w-full text-left bg-[#1c2134] hover:bg-[#232940] border border-[#2b324d] text-white p-4 rounded-2xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer"
                  >
                    <span>Browse & Edit Store Products</span>
                    <span className="text-slate-400 font-semibold text-[10px]">{approvedProducts.length} items</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full text-left bg-[#1c2134] hover:bg-[#232940] border border-[#2b324d] text-white p-4 rounded-2xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer"
                  >
                    <span>Manage Registered Users</span>
                    <span className="text-slate-400 font-semibold text-[10px]">{users.length} users</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("orders")}
                    className="w-full text-left bg-[#1c2134] hover:bg-[#232940] border border-[#2b324d] text-white p-4 rounded-2xl text-xs font-bold transition-all flex justify-between items-center cursor-pointer"
                  >
                    <span>Review Paid Store Orders</span>
                    <span className="text-slate-400 font-semibold text-[10px]">{adminOrders.length} orders</span>
                  </button>
                </div>
              </div>

              {/* Status Summary Card */}
              <div className="lg:col-span-2 bg-[#141724] border border-[#24293e] rounded-3xl p-6 flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Live Store Management</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All products added via Dashboard are live and instantly available for purchase. You can edit price, stock quantity, titles, and categories at any time.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#24293e] pt-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live Store Listings</span>
                    <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{approvedProducts.length} Items</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Inventory Value</span>
                    <p className="text-xl font-extrabold text-purple-400 mt-0.5">${totalStoreValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Products Directory */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Active Store Products</h2>
                <p className="text-xs text-slate-400">
                  Browse, edit product details/prices/stocks, or remove items from the store.
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
                <p className="text-xs text-slate-400">There are currently no active products matching your search.</p>
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
                        <th className="py-4 px-6">Stock</th>
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
                          <td className="py-4 px-6 font-semibold text-emerald-400">{prod.stocks || 1} in stock</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                className="bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-purple-500/30 flex items-center gap-1"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id || prod.id, prod.title)}
                                className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-red-500/30 flex items-center gap-1"
                              >
                                🗑️ Delete
                              </button>
                            </div>
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Registered Members</h2>
                <p className="text-xs text-slate-400">View user accounts and manage customer access.</p>
              </div>
            </div>

            <div className="bg-[#141724] rounded-3xl border border-[#24293e] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#24293e] bg-[#1a1e2e] text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">
                      <th className="py-4 px-6">User Name</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Account Role</th>
                      <th className="py-4 px-6">Joined Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24293e] text-xs">
                    {users.map((u) => (
                      <tr key={u._id || u.id} className="hover:bg-[#1a1e2e] transition-colors">
                        <td className="py-4 px-6 font-semibold text-white">{u.name}</td>
                        <td className="py-4 px-6 text-slate-300">{u.email}</td>
                        <td className="py-4 px-6">
                          {u.role === "admin" || u.role === "superadmin" ? (
                            <span className="text-[10px] font-extrabold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                              👑 Super Admin
                            </span>
                          ) : u.role === "moderator" ? (
                            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                              🛡️ Moderator
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-300 bg-slate-500/10 px-3 py-1 rounded-full border border-slate-500/20">
                              👤 Customer
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active Customer"}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={u.role || "user"}
                              onChange={(e) => handleUpdateUserRole(u._id || u.id, u.name, e.target.value)}
                              className="bg-[#1c2134] border border-[#2b324d] text-white text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-purple-500 cursor-pointer"
                            >
                              <option value="user" className="bg-[#141724]">👤 Customer</option>
                              <option value="moderator" className="bg-[#141724]">🛡️ Moderator (Products/Orders)</option>
                              <option value="admin" className="bg-[#141724]">👑 Super Admin (Full)</option>
                            </select>
                            <button
                              onClick={() => handleDeleteUser(u._id || u.id, u.name)}
                              className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-red-500/30"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Orders */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Store Orders Log</h2>
                <p className="text-xs text-slate-400">Track customer purchases and update order delivery status.</p>
              </div>
            </div>

            {adminOrders.length === 0 ? (
              <div className="bg-[#141724] p-12 rounded-3xl border border-[#24293e] text-center flex flex-col items-center gap-3">
                <h3 className="text-base font-bold text-white">No Orders Placed Yet</h3>
                <p className="text-xs text-slate-400">Customer orders will show here once completed via Stripe.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {adminOrders.map((ord) => (
                  <div
                    key={ord._id || ord.id}
                    className="bg-[#141724] border border-[#24293e] p-6 rounded-3xl flex flex-col gap-5 shadow-md hover:border-purple-500/30 transition-all"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#24293e] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">Order #{ord.orderId || ord.id}</span>
                          {ord.date && <span className="text-xs text-slate-400">• {ord.date}</span>}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Customer Email: <span className="text-purple-300 font-semibold">{ord.userEmail || "Guest Customer"}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                          <span className="text-base font-black text-emerald-400">${ord.total || ord.totalAmount}</span>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Order Status</span>
                          <select
                            value={ord.status || "Processing"}
                            onChange={(e) => handleUpdateOrderStatus(ord.orderId || ord.id, e.target.value)}
                            className="bg-[#1c2134] border border-[#2b324d] text-white text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-purple-500 cursor-pointer"
                          >
                            <option value="Processing" className="bg-[#141724]">⏳ Processing</option>
                            <option value="Shipped" className="bg-[#141724]">🚚 Shipped</option>
                            <option value="Delivered" className="bg-[#141724]">✅ Delivered</option>
                            <option value="Cancelled" className="bg-[#141724]">❌ Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Purchased Items ({(ord.items || []).length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(ord.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-[#1c2134] border border-[#2b324d]"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#24293e] flex items-center justify-center shrink-0 border border-[#2b324d] p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                              <span className="text-[10px] text-slate-400">
                                ${item.price} × {item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-[#141724] border border-[#2c334e] max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 animate-fade-in text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#2c334e] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>✏️ Edit Product Details</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Title *</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="bg-[#1c2134] border border-[#2c334e] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price ($ USD) *</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="bg-[#1c2134] border border-[#2c334e] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Quantity *</label>
                  <input
                    type="number"
                    value={editFormData.stocks}
                    onChange={(e) => setEditFormData({ ...editFormData, stocks: Number(e.target.value) || 1 })}
                    className="bg-[#1c2134] border border-[#2c334e] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                    min="0"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category *</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="bg-[#1c2134] border border-[#2c334e] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                    required
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#141724] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Image URL *</label>
                <input
                  type="text"
                  value={editFormData.image}
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                  className="bg-[#1c2134] border border-[#2c334e] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description *</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={3}
                  className="bg-[#1c2134] border border-[#2c334e] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2c334e]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1c2134] text-slate-300 hover:text-white border border-[#2c334e] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "Saving Changes..." : "Save Product Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
