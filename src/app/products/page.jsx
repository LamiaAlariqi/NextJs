"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// Helper to format category names beautifully
const formatCategoryName = (cat) => {
  if (!cat) return "";
  return cat
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper to generate premium specs based on category
const getSpecs = (category, title) => {
  const catLower = category.toLowerCase();
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

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const result = await res.json();

      if (!result.success || !result.products) {
        throw new Error(result.message || "Failed to load products");
      }

      // Map API fields to fit local layout schema
      const mappedData = result.products.map((item) => ({
        id: item._id,
        name: item.title,
        price: Math.round(Number(item.price) || 0),
        category: formatCategoryName(item.category),
        image: item.image,
        description: item.description,
        specs: getSpecs(item.category, item.title)
      }));

      setProducts(mappedData);
    } catch (err) {
      console.error(err);
      setError("Unable to load collection. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Compute categories dynamically from fetched products
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <main className="flex-1 bg-background text-foreground transition-colors duration-300 py-16 px-6">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-4 animate-fade-in">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Shop Collection
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Aura <span className="gradient-text font-extrabold">Innovations</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              Explore our line of premium minimalist audio, wearable trackables, and workspace ambient home devices.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-foreground">Failed to Load Products</h3>
              <p className="text-xs text-muted-foreground max-w-xs mt-1 mb-8">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {/* Category Filter Bar */}
          {!error && (
            <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap animate-fade-in-delay-1">
              {loading
                ? // Category buttons skeleton
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-24 h-9 bg-muted/40 rounded-full animate-pulse"
                  />
                ))
                : categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs font-semibold px-6 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                      : "border-border/60 hover:border-primary/40 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
            </div>
          )}

          {/* Products Grid */}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px] animate-fade-in-delay-2">
              {loading
                ? // Shimmer Loader Skeleton Grid
                Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-[2rem] border border-border/40 glass p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Placeholder */}
                      <div className="h-56 rounded-xl bg-muted/40 animate-pulse mb-5" />
                      {/* Title Bar */}
                      <div className="h-4 w-3/4 bg-muted/40 rounded animate-pulse mb-2" />
                      {/* Category Bar */}
                      <div className="h-3 w-1/2 bg-muted/40 rounded animate-pulse mb-4" />
                    </div>
                    {/* Button Placeholder */}
                    <div className="h-10 bg-muted/40 rounded-xl animate-pulse" />
                  </div>
                ))
                : filteredProducts.length === 0
                  ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-center py-20">
                      <span className="text-4xl mb-4">🔍</span>
                      <h3 className="font-semibold">No products found</h3>
                      <p className="text-xs text-muted-foreground mt-1">We are working on bringing more items to this category.</p>
                    </div>
                  )
                  : filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="group relative rounded-[2rem] border border-border/40 glass p-5 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300 animate-fade-in"
                    >
                      {/* Image & Hover Action Overlay */}
                      <div className="h-56 rounded-xl overflow-hidden bg-white/60 dark:bg-muted/30 flex items-center justify-center relative mb-5 p-4 border border-border/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={() => setQuickViewProduct(prod)}
                            className="bg-card text-card-foreground p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg cursor-pointer"
                            title="Quick View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <Link
                            href={`/products/${prod.id}`}
                            className="bg-card text-card-foreground p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg cursor-pointer flex items-center justify-center"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => addToCart(prod)}
                            className="bg-primary text-primary-foreground p-3 rounded-full hover:opacity-95 transition-opacity shadow-lg cursor-pointer"
                            title="Add to Cart"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                          <h3 className="text-sm font-semibold text-foreground line-clamp-1 flex-1 hover:text-primary transition-colors">
                            <Link href={`/products/${prod.id}`}>{prod.name}</Link>
                          </h3>
                          <span className="text-sm font-bold text-foreground shrink-0">${prod.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{prod.category}</p>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => addToCart(prod)}
                          className="flex-1 text-center bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer"
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  ))
              }
            </div>
          )}
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-card text-card-foreground rounded-[2.5rem] border border-border max-w-3xl w-full p-6 sm:p-8 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4">
              {/* Image */}
              <div className="md:col-span-5 bg-white/70 dark:bg-muted/30 border border-border/10 rounded-2xl p-6 flex items-center justify-center max-h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="max-h-[240px] w-auto object-contain"
                />
              </div>

              {/* Details */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 leading-snug">{quickViewProduct.name}</h3>
                  <span className="text-lg font-bold mt-2 block">${quickViewProduct.price}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-h-[100px] overflow-y-auto pr-2">{quickViewProduct.description}</p>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-foreground">Specifications</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {quickViewProduct.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="border border-border text-foreground hover:bg-muted/50 font-semibold px-6 py-3 rounded-full transition-colors text-xs tracking-wider cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
