"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState("dark"); // Default to dark theme for premium tech feel

  // Load cart and theme from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("aura_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }

    const savedTheme = localStorage.getItem("aura_theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.className = initialTheme;
    }
  }, []);

  // Sync cart to localStorage
  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem("aura_cart", JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    saveCartToStorage(newCart);
    setIsCartOpen(true); // Automatically open cart drawer when adding item
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
