"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

// Lightweight custom axios wrapper around native fetch to maintain original code pattern
// without requiring installing external packages.
const axios = {
  get: async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return { data };
  }
};

const formatCategoryName = (cat) => {
  if (!cat) return "";
  return cat
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getSpecs = (category, title) => {
  const catLower = category ? category.toLowerCase() : "";
  if (catLower.includes("electronics")) {
    return [
      "High-performance components",
      "Premium build & chassis",
      "1-Year warranty included",
      "Smart device compatibility"
    ];
  }
  if (catLower.includes("jewelery")) {
    return [
      "Handcrafted details",
      "Scratch-resistant finish",
      "Premium protective packaging",
      "Authentic materials certified"
    ];
  }
  if (catLower.includes("clothing")) {
    return [
      "Tailored modern fit",
      "Ultra-comfortable feel",
      "Premium fabric blend",
      "Machine washable & durable"
    ];
  }
  return [
    "Minimalist aesthetic design",
    "Sustainable eco-friendly build",
    "High durability rating",
    "Designed for everyday utility"
  ];
};

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const getproductDetails = async (productId) => {
    const numericId = productId.replace(/^(api-|prod-)/, "");
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/${numericId}`);
      console.log("API Response:", response.data);
      const data = response.data;
      if (!data) return null;

      return {
        id: `api-${data.id}`,
        name: data.title,
        price: Math.round(data.price),
        category: formatCategoryName(data.category),
        image: data.image,
        description: data.description,
        specs: getSpecs(data.category, data.title)
      };
    } catch (error) {
      console.error(`Error fetching product details for ${productId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    if (!id) return;

    let active = true;
    const fetchProduct = async () => {
      const data = await getproductDetails(id);
      if (!active) return;
      if (data) {
        setProduct(data);
      } else {
        setError("Product not found");
      }
      setLoading(false);
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-32 px-6">
        <p className="text-sm text-muted-foreground animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-32 px-6">
        <span className="text-5xl mb-4">🔍</span>
        <h3 className="text-xl font-bold">Product Not Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          The product you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/products"
          className="mt-8 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider"
        >
          BACK TO PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-background text-foreground transition-colors duration-300 py-12 px-6 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Breadcrumbs / Back button */}
        <div className="flex items-center justify-between border-b border-border/20 pb-4 animate-fade-in">
          <Link
            href="/products"
            className="group flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collection
          </Link>
          <span className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase">
            Aura Premium Selection
          </span>
        </div>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Product Image Showcase */}
          <div className="lg:col-span-6 flex justify-center w-full animate-fade-in-delay-1">
            <div className="relative group w-full max-w-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-[2.5rem] blur-[30px] opacity-45 group-hover:opacity-70 transition-opacity duration-500 -z-10" />
              <div className="relative glass rounded-[2.5rem] overflow-hidden p-8 sm:p-12 border border-border/40 flex items-center justify-center min-h-[350px] sm:min-h-[480px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[300px] sm:max-h-[400px] w-auto object-contain group-hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Right: Product Details Info */}
          <div className="lg:col-span-6 flex flex-col gap-8 w-full animate-fade-in-delay-2">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase border border-primary/10">
                {product.category}
              </span>

              <h1 className="text-3xl sm:text-4.5xl font-bold tracking-tight mt-5 leading-tight text-foreground">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground">${product.price}</span>
                <span className="text-xs text-muted-foreground">Free Global Delivery</span>
              </div>
            </div>

            <div className="h-px bg-border/40 w-full" />

            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overview</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.specs && product.specs.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="glass rounded-xl p-3 border border-border/30 flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-xs text-foreground font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
              <div className="flex items-center justify-between border border-border rounded-full py-3 px-5 sm:w-36 gap-6 glass shrink-0">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="text-muted-foreground hover:text-foreground text-sm font-semibold w-8 h-8 flex items-center justify-center transition-colors cursor-pointer select-none"
                  aria-label="Decrease quantity"
                >
                  —
                </button>
                <span className="text-sm font-bold text-foreground select-none w-4 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="text-muted-foreground hover:text-foreground text-sm font-semibold w-8 h-8 flex items-center justify-center transition-colors cursor-pointer select-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-4 px-8 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                ADD TO CART
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2.5 border-t border-b border-border/20 mt-2 text-[10px] tracking-wider text-muted-foreground font-medium uppercase">
              <div className="flex flex-col gap-1 items-center justify-center">
                <span>🛡️ 2-Year Warranty</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center border-l border-r border-border/20">
                <span>🔄 30-Day Returns</span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center">
                <span>💬 24/7 Premium Support</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
