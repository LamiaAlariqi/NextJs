"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

const CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Cars",
  "Makeup & Beauty",
  "Clothing & Fashion"
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";

  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/products";
      const params = new URLSearchParams();
      if (activeCategory && activeCategory !== "All") {
        params.append("category", activeCategory);
      }
      if (searchQuery && searchQuery.trim() !== "") {
        params.append("search", searchQuery.trim());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const result = await res.json();

      if (!result.success || !result.products) {
        throw new Error(result.message || "Failed to load products");
      }

      const mappedData = result.products.map((item) => ({
        id: item._id,
        name: item.title,
        price: Math.round(Number(item.price) || 0),
        category: item.category,
        image: item.image,
        description: item.description,
      }));

      setProducts(mappedData);
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery]);

  return (
    <main className="flex-1 bg-background text-foreground min-h-screen pb-24 transition-colors duration-300">
      {/* Page Banner Header */}
      <section className="relative overflow-hidden py-16 px-6 border-b border-border/30 bg-muted/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-4 relative z-10 animate-fade-in">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            Aura Marketplace
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Explore <span className="gradient-text">Premium Products</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Browse our curated collection of Electronics, Luxury Furniture, Supercars, Makeup, and High Fashion.
          </p>

          {/* Search Input Bar */}
          <div className="w-full max-w-lg mt-4 relative flex items-center">
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border/80 focus:border-primary rounded-full px-6 py-3.5 pl-12 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground shadow-lg focus:outline-none transition-all"
            />
            <svg
              className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted px-2 py-1 rounded-full"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="glass rounded-3xl p-4 border border-border/40 animate-pulse flex flex-col gap-4">
                <div className="w-full h-56 bg-muted/60 rounded-2xl" />
                <div className="h-4 bg-muted/80 rounded w-3/4" />
                <div className="h-3 bg-muted/60 rounded w-1/2" />
                <div className="h-10 bg-muted rounded-full mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchProducts}
              className="text-xs bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full"
            >
              Retry Loading
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="p-5 bg-muted/40 rounded-full text-muted-foreground">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">No Products Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              We couldn't find any products matching your search or selected category.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="text-xs bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group glass rounded-3xl border border-border/40 overflow-hidden flex flex-col justify-between hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                {/* Image Container */}
                <div className="relative h-64 bg-muted/30 overflow-hidden flex items-center justify-center p-4">
                  <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 backdrop-blur-md px-3 py-1 rounded-full uppercase">
                    {product.category}
                  </span>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />

                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white tracking-widest uppercase backdrop-blur-xs"
                  >
                    Quick View
                  </button>
                </div>

                {/* Details Container */}
                <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                  <div>
                    <Link
                      href={`/products/${product.id}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1 block"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-2">
                    <span className="text-lg font-extrabold text-foreground">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-full text-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/20"
                    >
                      <span>+ Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="glass max-w-xl w-full border border-border rounded-3xl p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1"
            >
              ✕
            </button>
            <div className="w-full md:w-1/2 h-56 md:h-auto bg-muted rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-xl font-bold text-foreground mt-2">{quickViewProduct.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{quickViewProduct.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-2xl font-extrabold text-foreground">${quickViewProduct.price}</span>
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full text-xs shadow-lg shadow-primary/20"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
