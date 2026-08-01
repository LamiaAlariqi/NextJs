"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState("dark"); // Default to dark theme for premium tech feel

  // Determine storage key for the current logged-in user
  const getUserCartKey = () => {
    if (session?.user?.email) {
      return `aura_cart_${session.user.email}`;
    }
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("aura_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed?.email) {
            return `aura_cart_${parsed.email}`;
          }
        } catch (e) {
          // fallback
        }
      }
    }
    return null;
  };

  const loadUserCart = () => {
    const key = getUserCartKey();
    if (!key) {
      setCart([]);
      return;
    }
    const savedCart = localStorage.getItem(key);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data", e);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  };

  // Reload user's isolated cart whenever user/session changes
  useEffect(() => {
    loadUserCart();
  }, [session?.user?.email]);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("aura_theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.className = initialTheme;
    }

    // Listen for custom login/logout state changes
    const handleLoginChange = () => {
      loadUserCart();
    };

    window.addEventListener("aura_login_state_change", handleLoginChange);
    return () => {
      window.removeEventListener("aura_login_state_change", handleLoginChange);
    };
  }, []);

  // Sync cart to localStorage under user's specific key
  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    const key = getUserCartKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(newCart));
    }
  };

  const addToCart = (product) => {
    addToCartWithQuantity(product, 1);
  };

  const addToCartWithQuantity = (product, qty = 1) => {
    // Check if user is logged in
    const isLogged = Boolean(session?.user) || (typeof window !== "undefined" && Boolean(localStorage.getItem("aura_user")));
    if (!isLogged) {
      if (typeof window !== "undefined") {
        window.location.href = "/Login";
      }
      return;
    }

    const maxStock = typeof product.stocks === "number" && product.stocks >= 0 ? product.stocks : 10;
    const pId = product.id || product._id;
    const existingItem = cart.find((item) => (item.id || item._id) === pId);
    let newCart;
    if (existingItem) {
      const targetQty = Math.min(existingItem.quantity + qty, maxStock);
      newCart = cart.map((item) =>
        (item.id || item._id) === pId
          ? { ...item, quantity: targetQty, stocks: maxStock }
          : item
      );
    } else {
      const targetQty = Math.min(qty, maxStock);
      newCart = [...cart, { ...product, quantity: targetQty, stocks: maxStock }];
    }
    saveCartToStorage(newCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    const existingItem = cart.find((item) => item.id === productId);
    let newCart;
    if (existingItem && existingItem.quantity > 1) {
      newCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      newCart = cart.filter((item) => item.id !== productId);
    }
    saveCartToStorage(newCart);
  };

  const removeItemCompletely = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("aura_theme", newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        addToCartWithQuantity,
        removeFromCart,
        removeItemCompletely,
        clearCart,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
