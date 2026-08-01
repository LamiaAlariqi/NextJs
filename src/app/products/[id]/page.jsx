"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const CATEGORIES = [
  { name: "Electronics", href: "/products?category=Electronics" },
  { name: "Furniture", href: "/products?category=Furniture" },
  { name: "Cars", href: "/products?category=Cars" },
  { name: "Makeup & Beauty", href: "/products?category=Makeup%20%26%20Beauty" },
  { name: "Clothing & Fashion", href: "/products?category=Clothing%20%26%20Fashion" },
];

function formatCategoryName(category) {
  if (!category) return "General";
  return category;
}

function getSpecs(category, title) {
  const cat = (category || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (cat.includes("electronics") || t.includes("macbook") || t.includes("sony") || t.includes("iphone")) {
    return [
      "Ultra-high precision build",
      "Next-gen processing architecture",
      "Extended battery efficiency",
      "2-Year International Warranty"
    ];
  }
  if (cat.includes("furniture") || t.includes("sofa") || t.includes("table") || t.includes("lamp")) {
    return [
      "Handcrafted premium materials",
      "Ergonomic modern design",
      "Eco-friendly sustainable finish",
      "Easy assembly & maintenance"
    ];
  }
  if (cat.includes("cars") || t.includes("porsche") || t.includes("g63") || t.includes("tesla")) {
    return [
      "High-output performance powertrain",
      "Luxurious leather interior",
      "Advanced driver assistance suite",
      "Full service history included"
    ];
  }
  return [
    "Minimalist aesthetic design",
    "Sustainable eco-friendly build",
    "High durability rating",
    "Designed for everyday utility"
  ];
}

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;

  const { addToCartWithQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [stockMessage, setStockMessage] = useState("");

  const getproductDetails = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) return null;
      const result = await res.json();
      if (!result.success || !result.product) return null;

      const data = result.product;
      const img = data.image && data.image.trim() !== "" ? data.image : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";

      const availableStock = Number(data.stocks) >= 0 ? Number(data.stocks) : 10;

      return {
        id: data._id,
        name: data.title,
        price: Math.round(Number(data.price) || 0),
        category: formatCategoryName(data.category),
        image: img,
        description: data.description,
        stocks: availableStock,
        specs: getSpecs(data.category, data.title)
      };
    } catch (error) {
      console.error(`Error fetching product details for ${productId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    if (!productId) return;

    let active = true;
    const fetchProduct = async () => {
      const data = await getproductDetails(productId);
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
  }, [productId]);

  const handleQuantityChange = (type) => {
    if (!product) return;
    const maxStock = product.stocks;

    if (type === "increase") {
      if (quantity < maxStock) {
        setQuantity((prev) => prev + 1);
        setStockMessage("");
      } else {
        setStockMessage(`Maximum available quantity is ${maxStock}`);
      }
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
      setStockMessage("");
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stocks <= 0) return;
    addToCartWithQuantity(product, quantity);
  };

  const handleBuyNow = async () => {
    if (!product || product.stocks <= 0) return;
    try {
      setIsBuying(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ ...product, quantity }],
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to initiate purchase.");
        setIsBuying(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating purchase");
      setIsBuying(false);
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
      <div className="flex flex-col items-center justify-center text-center py-32 px-6 gap-4">
        <h2 className="text-2xl font-bold text-foreground">Product Not Found</h2>
        <p className="text-xs text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="bg-primary text-primary-foreground text-xs font-semibold px-6 py-3 rounded-full">
          Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stocks <= 0;

  return (
    <main className="flex-1 bg-background text-foreground min-h-screen pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground mb-8 transition-colors uppercase"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to collection
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Image Column */}
          <div className="lg:col-span-7">
            <div className="glass rounded-[2.5rem] border border-border/40 overflow-hidden p-8 sm:p-12 flex items-center justify-center relative bg-muted/20">
              <span className="absolute top-6 left-6 text-xs font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 backdrop-blur-md px-4 py-1.5 rounded-full uppercase">
                {product.category}
              </span>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-[500px] object-contain rounded-2xl drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Specs / Controls Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {product.category}
                </span>

                {/* Stock Status Badge */}
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    🔴 Out of Stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    🟢 In Stock ({product.stocks} available)
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 text-foreground">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-3xl font-black text-foreground">${product.price}</span>
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

            {/* Quantity Selector & Stock Alert */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex items-center justify-between border border-border rounded-full py-3 px-5 sm:w-36 gap-6 glass shrink-0">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="text-muted-foreground hover:text-foreground text-sm font-semibold w-8 h-8 flex items-center justify-center transition-colors cursor-pointer select-none disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    —
                  </button>
                  <span className="text-sm font-bold text-foreground select-none w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    disabled={quantity >= product.stocks || isOutOfStock}
                    className="text-muted-foreground hover:text-foreground text-sm font-semibold w-8 h-8 flex items-center justify-center transition-colors cursor-pointer select-none disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-secondary text-secondary-foreground font-semibold py-4 px-6 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer border border-border shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
                >
                  {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isBuying || isOutOfStock}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 px-6 rounded-full transition-all text-xs tracking-wider cursor-pointer shadow-lg shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {isBuying ? "PROCESSING..." : isOutOfStock ? "UNAVAILABLE" : "BUY NOW (STRIPE)"}
                </button>
              </div>

              {stockMessage && (
                <p className="text-xs text-amber-400 font-medium pl-2 animate-fade-in">
                  ⚠️ {stockMessage}
                </p>
              )}
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/30 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-medium">🛡️ 2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-medium">🔄 30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-medium">💬 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
