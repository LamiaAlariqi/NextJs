"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const NewProducts = () => {
  const { addToCart } = useCart();
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAllProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("https://dummyjson.com/products");
      console.log(response);
      setproducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Unable to retrieve the new arrivals collection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <main className="flex-1 bg-background text-foreground transition-colors duration-300 py-16 px-6 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 animate-fade-in">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            New Arrivals
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Aura <span className="gradient-text font-extrabold">Showcase</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Explore the latest additions to the global collection, curated for quality and minimalist design.
          </p>
        </div>

        {/* Loading state skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px] animate-fade-in">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="rounded-[2rem] border border-border/40 glass p-5 flex flex-col justify-between">
                <div>
                  <div className="h-56 rounded-xl bg-muted/40 animate-pulse mb-5" />
                  <div className="h-4 w-3/4 bg-muted/40 rounded animate-pulse mb-2" />
                  <div className="h-3 w-1/2 bg-muted/40 rounded animate-pulse mb-4" />
                </div>
                <div className="h-10 bg-muted/40 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-foreground">Failed to Load New Arrivals</h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1 mb-8">{error}</p>
            <button
              onClick={getAllProducts}
              className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px] animate-fade-in">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="group relative rounded-[2rem] border border-border/40 glass p-5 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300 animate-fade-in"
              >
                {/* Image & Actions Overlay */}
                <div className="h-56 rounded-xl overflow-hidden bg-white/60 dark:bg-muted/30 flex items-center justify-center relative mb-5 p-4 border border-border/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.thumbnail}
                    alt={prod.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                      href={`/newProduct/${prod.id}`}
                      className="bg-card text-card-foreground p-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg cursor-pointer flex items-center justify-center"
                      title="View Details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => addToCart({
                        id: `dummy-${prod.id}`,
                        name: prod.title,
                        price: Math.round(prod.price),
                        image: prod.thumbnail,
                        category: formatCategoryName(prod.category)
                      })}
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
                      <Link href={`/newProduct/${prod.id}`}>{prod.title}</Link>
                    </h3>
                    <span className="text-sm font-bold text-foreground shrink-0">${Math.round(prod.price)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{formatCategoryName(prod.category)}</p>
                  <p className="text-[10px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => addToCart({
                      id: `dummy-${prod.id}`,
                      name: prod.title,
                      price: Math.round(prod.price),
                      image: prod.thumbnail,
                      category: formatCategoryName(prod.category)
                    })}
                    className="flex-1 text-center bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default NewProducts;
