"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    theme,
    toggleTheme,
  } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localUser, setLocalUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      setIsCheckingOut(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          userEmail: activeUser?.email || "",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start Stripe checkout");
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error("Checkout error", err);
      alert("Something went wrong during checkout.");
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("aura_user");
      if (savedUser) {
        try {
          setLocalUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse user session", e);
        }
      } else {
        setLocalUser(null);
      }
    };
    checkUser();
    window.addEventListener("aura_login_state_change", checkUser);
    return () => {
      window.removeEventListener("aura_login_state_change", checkUser);
    };
  }, []);

  const activeUser = session?.user || localUser;

  const handleLogout = () => {
    localStorage.removeItem("aura_user");
    localStorage.removeItem("aura_token");
    setLocalUser(null);
    setIsUserMenuOpen(false);
    window.dispatchEvent(new Event("aura_login_state_change"));
    if (session) {
      nextAuthSignOut();
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <header className="glass sticky top-0 z-40 w-full transition-all duration-300 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-[0.25em] text-foreground transition-all group-hover:opacity-80">
              A U R A
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/home"
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 hover:text-primary ${
                pathname === "/home" || pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 hover:text-primary ${
                pathname === "/products" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Browse Products
            </Link>
            <Link
              href="/newProduct"
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 hover:text-primary ${
                pathname === "/newProduct" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              New Arrivals
            </Link>
            <Link
              href="/about"
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 hover:text-primary ${
                pathname === "/about" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 hover:text-primary ${
                pathname === "/contact" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Contact
            </Link>
            {(activeUser?.role === "admin" || activeUser?.isAdmin) && (
              <Link
                href="/admin"
                className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 hover:text-primary ${
                  pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/addProduct"
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="text-sm font-extrabold">+</span> Sell Item
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search Input Bar (Expandable) */}
            <div className="relative flex items-center">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-muted/80 text-foreground transition-colors"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              {isSearchOpen && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2 animate-fade-in glass rounded-full px-4 py-1 border border-border flex items-center w-48 md:w-64">
                  <input
                    type="text"
                    placeholder="Search Aura products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/80 text-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 3v1m0 16v1m9-9h-1M4 9h-1m14.071-3.071l-.707.707M6.343 17.657l-.707.707m2.828 0l-.707-.707m8.486-8.486l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* User Account / Profile */}
            <div className="relative">
              {activeUser ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1 rounded-full hover:bg-muted/80 text-foreground transition-colors relative flex items-center justify-center cursor-pointer border border-primary/30"
                    aria-label="User profile"
                  >
                    {activeUser.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activeUser.image}
                        alt={activeUser.name || "User Avatar"}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <svg className="w-5 h-5 text-primary p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass border border-border rounded-2xl shadow-xl z-50 p-4 animate-fade-in flex flex-col gap-3">
                      <div className="px-1 py-0.5 flex items-center gap-3">
                        {activeUser.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={activeUser.image}
                            alt="Avatar"
                            className="w-9 h-9 rounded-full object-cover border border-primary/40 shrink-0"
                          />
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-foreground truncate">{activeUser.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate mt-0.5">{activeUser.email}</p>
                        </div>
                      </div>
                      <div className="h-px bg-border/60 w-full" />
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="text-left text-xs text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
                      >
                        My Profile
                      </Link>
                      {(activeUser?.role === "admin" || activeUser?.isAdmin) && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="text-left text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="text-left text-xs text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/updatePassword"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="text-left text-xs text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
                      >
                        Update Password
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-left text-xs text-red-500 hover:text-red-600 transition-colors py-1 font-semibold cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/Login"
                  className={`p-2 rounded-full hover:bg-muted/80 text-foreground transition-colors flex items-center justify-center cursor-pointer ${
                    pathname === "/Login" || pathname === "/signup" ? "text-primary" : ""
                  }`}
                  aria-label="Sign In"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-muted/80 text-foreground transition-colors relative"
              aria-label="Open Cart"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        >
          {/* Drawer Panel */}
          <div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-card text-card-foreground border-l border-border p-6 shadow-2xl flex flex-col justify-between animate-fade-in max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-wider">YOUR CART</h2>
                <span className="text-xs text-muted-foreground">({totalItems} items)</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-6 divide-y divide-border/60">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="p-4 bg-muted/50 rounded-full text-muted-foreground">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Your cart is empty</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Browse our premium collections and add items.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 text-xs bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    {/* Image / Icon representation */}
                    <div className="w-20 h-20 bg-muted/60 rounded-xl flex items-center justify-center relative border border-border/40 overflow-hidden">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">📦</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium pr-4 line-clamp-1">{item.name}</h4>
                          <span className="text-sm font-semibold">${item.price * item.quantity}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty Counter */}
                        <div className="flex items-center border border-border rounded-full py-1 px-2.5 gap-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-foreground text-xs"
                          >
                            —
                          </button>
                          <span className="text-xs font-semibold select-none">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="text-muted-foreground hover:text-foreground text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItemCompletely(item.id)}
                          className="text-xs text-red-500 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer summary */}
            {cart.length > 0 && (
              <div className="border-t border-border/85 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold">${totalPrice}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-4">
                  Shipping and taxes calculated at checkout. Free shipping on orders over $150.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:opacity-95 transition-opacity text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <span>PROCEED TO CHECKOUT (STRIPE)</span>
                    )}
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full border border-border text-foreground font-medium py-3 rounded-full hover:bg-muted/50 transition-colors text-xs tracking-widest"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
