"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  useEffect(() => {
    let emailParam = "";
    const savedUser = localStorage.getItem("aura_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.email) emailParam = `?email=${encodeURIComponent(parsed.email)}`;
      } catch (e) {}
    }

    fetch(`/api/orders${emailParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.orders) {
          setOrders(data.orders);
        }
      })
      .catch((e) => console.error("Failed to load orders", e));
  }, []);

  const handleCancelOrder = (orderId) => {
    if (confirm(`Are you sure you want to cancel order #${orderId}?`)) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "Cancelled", step: 0 } : o
        )
      );
      showToast(`Order #${orderId} has been cancelled.`);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filterStatus === "all" ||
      o.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some((i) => i.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="flex-1 bg-[#0d0f17] text-slate-100 min-h-screen py-12 px-4 sm:px-8 relative overflow-hidden font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white font-semibold text-xs px-5 py-3 rounded-2xl shadow-2xl animate-bounce flex items-center gap-2 border border-white/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>{notification}</span>
        </div>
      )}

      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1e2336] pb-6">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Customer Purchases
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-2">
              My Orders & <span className="gradient-text">Live Tracking</span>
            </h1>
          </div>

          <Link
            href="/products"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#141724] p-4 rounded-3xl border border-[#24293e]">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["all", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                    : "text-slate-400 hover:bg-[#1c2134] hover:text-white"
                }`}
              >
                {status === "all" ? "All Orders" : status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search order ID or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-[#1c2134] border border-[#2b324d] rounded-full px-5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-[#141724] p-12 rounded-3xl border border-[#24293e] text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#1c2134] text-slate-400 flex items-center justify-center border border-[#2b324d]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white">No Orders Found</h2>
            <p className="text-xs text-slate-400 max-w-sm">
              You haven't placed any orders matching this status filter yet.
            </p>
            <Link
              href="/products"
              className="mt-2 text-xs font-bold text-purple-400 hover:text-purple-300 underline"
            >
              Browse Store Collection →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#141724] border border-[#24293e] rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden"
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#24293e] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white">{order.id}</span>
                    <span className="text-xs text-slate-400">• {order.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Total Amount:</span>
                    <span className="text-lg font-black text-white">${order.total}</span>
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                        order.status === "Delivered"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : order.status === "Shipped"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : order.status === "Processing"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      ● {order.status}
                    </span>
                  </div>
                </div>

                {/* Tracking Timeline (If not cancelled) */}
                {order.status !== "Cancelled" && (
                  <div className="bg-[#1c2134] p-5 rounded-2xl border border-[#2b324d] flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Order Shipment Tracking</span>
                      <span className="text-[10px] text-purple-400 font-semibold">
                        Tracking #: {order.trackingNumber}
                      </span>
                    </div>

                    {/* Progress Bar Steps */}
                    <div className="relative flex items-center justify-between mt-2 px-2">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-[#2b324d] -z-0">
                        <div
                          className="h-full bg-purple-600 transition-all duration-500 rounded-full"
                          style={{
                            width:
                              order.step === 1
                                ? "0%"
                                : order.step === 2
                                ? "33%"
                                : order.step === 3
                                ? "66%"
                                : "100%",
                          }}
                        />
                      </div>

                      {/* Step 1: Placed */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                            order.step >= 1
                              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                              : "bg-[#2b324d] text-slate-400"
                          }`}
                        >
                          1
                        </div>
                        <span className="text-[10px] font-semibold text-slate-300">Placed</span>
                      </div>

                      {/* Step 2: Processing */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                            order.step >= 2
                              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                              : "bg-[#2b324d] text-slate-400"
                          }`}
                        >
                          2
                        </div>
                        <span className="text-[10px] font-semibold text-slate-300">Processing</span>
                      </div>

                      {/* Step 3: Shipped */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                            order.step >= 3
                              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                              : "bg-[#2b324d] text-slate-400"
                          }`}
                        >
                          3
                        </div>
                        <span className="text-[10px] font-semibold text-slate-300">In Transit</span>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                            order.step >= 4
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                              : "bg-[#2b324d] text-slate-400"
                          }`}
                        >
                          4
                        </div>
                        <span className="text-[10px] font-semibold text-slate-300">Delivered</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 text-right mt-1">
                      Estimated Delivery: <span className="text-white font-bold">{order.estimatedDelivery}</span>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Purchased Items ({order.items.length})
                  </span>
                  <div className="flex flex-col gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 rounded-2xl bg-[#1c2134] border border-[#2b324d]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#24293e] flex items-center justify-center shrink-0 border border-[#2b324d] p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.title}</h4>
                            <span className="text-[10px] text-slate-400">{item.category} • Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-white">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Info & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-[#24293e] text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Shipping Address: <strong className="text-white">{order.shippingAddress}</strong>
                  </span>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => showToast(`Downloading Invoice PDF for Order #${order.id}...`)}
                      className="flex-1 sm:flex-initial border border-[#2b324d] hover:bg-[#1c2134] text-slate-200 font-semibold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Download Invoice
                    </button>

                    {order.status === "Processing" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex-1 sm:flex-initial bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
