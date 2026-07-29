"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const confirmOrder = async () => {
      try {
        const savedUser = localStorage.getItem("aura_user");
        let userEmail = "";
        if (savedUser) {
          try {
            userEmail = JSON.parse(savedUser).email;
          } catch (e) {}
        }

        const res = await fetch("/api/checkout/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            userEmail,
            items: cart,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
          clearCart();
        }
      } catch (err) {
        console.error("Failed to confirm order", err);
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[#090b11] text-foreground flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-lg w-full bg-[#111420]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 text-center flex flex-col items-center gap-6 shadow-2xl relative z-10 animate-fade-in my-8">
        {loading ? (
          <div className="py-16 flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <div className="absolute w-8 h-8 bg-emerald-500/10 rounded-full animate-ping" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-white">Finalizing Payment...</h3>
              <p className="text-xs text-muted-foreground">Creating your order record securely</p>
            </div>
          </div>
        ) : (
          <>
            {/* Animated Success Badge */}
            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-400 text-white rounded-full flex items-center justify-center border-2 border-emerald-300/40 shadow-lg shadow-emerald-500/30 relative z-10">
                <svg
                  className="w-10 h-10 stroke-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>

            {/* Title & Headline */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold tracking-[0.25em] text-emerald-400 uppercase bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 w-fit mx-auto shadow-sm">
                ORDER CONFIRMED
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your payment was processed successfully via Stripe. We are preparing your order for shipment.
              </p>
            </div>

            {/* Receipt Details Card */}
            {order && (
              <div className="w-full bg-[#161a29]/90 border border-white/10 rounded-2xl p-5 text-left flex flex-col gap-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order Reference</span>
                    <span className="text-sm font-mono font-bold text-white mt-0.5">{order.orderId}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {order.paymentStatus || "Paid"}
                    </span>
                  </div>
                </div>

                {/* Ordered Items List Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="flex flex-col gap-2.5 py-1 border-b border-white/10 pb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Items Summary</span>
                    <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 text-sm overflow-hidden">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                "📦"
                              )}
                            </div>
                            <span className="text-slate-200 font-medium truncate max-w-[180px]">
                              {item.title || item.name}
                            </span>
                          </div>
                          <span className="text-slate-400 text-xs font-mono shrink-0">
                            {item.quantity}x ${item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total & Delivery Estimate */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Est. Delivery</span>
                    <span className="text-xs text-indigo-300 font-medium">3 - 5 Business Days</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Amount Paid</span>
                    <span className="text-xl font-extrabold text-emerald-400 font-mono">
                      ${order.totalAmount || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
              <Link
                href="/orders"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-full text-xs transition-all shadow-lg shadow-emerald-600/20 text-center tracking-wider hover:scale-[1.02] active:scale-[0.98]"
              >
                VIEW MY ORDERS
              </Link>
              <Link
                href="/products"
                className="flex-1 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-medium py-3.5 px-4 rounded-full text-xs transition-colors text-center tracking-wider hover:scale-[1.02] active:scale-[0.98]"
              >
                KEEP SHOPPING
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090b11] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
