"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const CATEGORIES = [
  { name: "Electronics", count: "Latest Tech & Gadgets", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80", href: "/products?category=Electronics" },
  { name: "Furniture", count: "Luxury Living & Decor", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80", href: "/products?category=Furniture" },
  { name: "Cars", count: "Supercars & Automotive", image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80", href: "/products?category=Cars" },
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          const mapped = data.products.slice(0, 8).map((p) => {
            const img = p.image && p.image.trim() !== "" ? p.image : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
            return {
              id: p._id,
              name: p.title,
              price: Math.round(Number(p.price) || 0),
              category: p.category,
              image: img,
              description: p.description,
            };
          });
          setProducts(mapped);
        }
      })
      .catch((e) => console.error("Failed to load home products", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <main className="flex-1 bg-background text-foreground transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32 px-6 border-b border-border/30">
          {/* Glowing background highlights */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start gap-8 animate-fade-in">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                Introducing Aura V1
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-foreground">
                The Future of <br />
                <span className="gradient-text font-extrabold">Workspace & Sound</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                Crafting premium minimalist gadgets and elegant home technology that enhances your everyday workspace and lifestyle. Forged with titanium, glass, and pure sound.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                  href="#products"
                  className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full text-center hover:opacity-90 transition-opacity text-xs tracking-wider"
                >
                  EXPLORE COLLECTION
                </a>
                <Link
                  href="/about"
                  className="border border-border text-foreground hover:bg-muted/50 font-semibold px-8 py-4 rounded-full text-center transition-colors text-xs tracking-wider"
                >
                  OUR PHILOSOPHY
                </Link>
              </div>
            </div>

            {/* Right Showcase Image */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end animate-fade-in-delay-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur-[30px] opacity-20 group-hover:opacity-35 transition-opacity duration-500" />
                <div className="relative glass rounded-[2rem] overflow-hidden p-4 border border-border/80 w-full max-w-[480px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sound_arc.png"
                    alt="Aura Sound Arc headphones"
                    className="w-full h-auto object-cover rounded-xl group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-xl border border-border/50 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Aura Sound Arc</h3>
                      <p className="text-[10px] text-muted-foreground">Minimalist Active Noise Cancelling Headphones</p>
                    </div>
                    <span className="text-xs font-bold text-foreground bg-primary/20 px-3 py-1 rounded-full border border-primary/20">$299</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-20 px-6 max-w-7xl mx-auto border-b border-border/30">
          <div className="flex flex-col items-center mb-16 text-center animate-fade-in">
            <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-2">
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Designed For Every Detail
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <a
                key={idx}
                href={cat.href}
                className="group relative overflow-hidden rounded-[2rem] border border-border/40 glass p-6 block hover:border-primary/40 transition-colors duration-300"
              >
                <div className="h-60 rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-2/3 h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.count}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 px-6 max-w-7xl mx-auto border-b border-border/30">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-2">
              Our Showcase
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Featured Innovations
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {products.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                className="group relative rounded-[2rem] border border-border/40 glass p-5 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300 shadow-sm"
              >
                {/* Image & Quick View button overlay */}
                <div className="h-56 rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center relative mb-5">
                  <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 backdrop-blur-md px-3 py-1 rounded-full uppercase">
                    {prod.category}
                  </span>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-4/5 h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
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

                {/* Content */}
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                      <Link href={`/products/${prod.id}`}>{prod.name}</Link>
                    </h3>
                    <span className="text-sm font-bold text-foreground">${prod.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{prod.category}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => addToCart(prod)}
                    className="flex-1 text-center bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link
              href="/products"
              className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer shadow-lg shadow-primary/20"
            >
              VIEW FULL COLLECTION
            </Link>
          </div>
        </section>

        {/* Promo Spotlight Banner */}
        <section id="promo" className="py-20 px-6 max-w-7xl mx-auto border-b border-border/30">
          <div className="relative group overflow-hidden rounded-[2.5rem] border border-border/60 glass p-8 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
            {/* Decorative background glow */}
            <div className="absolute -top-12 -right-12 w-96 h-96 bg-secondary/15 rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-700" />

            {/* Left Image representation */}
            <div className="lg:w-1/2 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aura_beam.png"
                alt="Aura Beam Spotlight"
                className="w-4/5 h-auto object-contain max-h-[360px] animate-float"
              />
            </div>

            {/* Right Specs Info */}
            <div className="lg:w-1/2 flex flex-col gap-6 items-start">
              <span className="text-[10px] font-bold tracking-[0.25em] text-secondary bg-secondary/10 px-3.5 py-1 rounded-full uppercase">
                Spotlight Product
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-none text-foreground">
                Aura Beam Projector
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Sculpt your environment with light. Aura Beam casts dynamic, sweeping ambient color fields onto any surface. Perfect for late-night editing, relaxation, or elevating your workspace setup.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium">16M Color Spectrum</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium">Glass projection lens</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium">App/Voice command</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium">Aluminum & cement body</span>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-2">
                <span className="text-2xl font-bold text-foreground">$349</span>
                <button
                  onClick={() => products[0] && addToCart(products[0])}
                  className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider cursor-pointer"
                >
                  ACQUIRE NOW
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto text-center">
          <div className="glass rounded-[2rem] border border-border/40 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[50px] -z-10" />
            <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase block mb-3">
              Newsletter
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              Enter The Aura Universe
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Sign up for early access to product releases, software updates, and exclusive design journals.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed! Thank you.");
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border px-5 py-3 rounded-full text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
                required
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider whitespace-nowrap"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </section>
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
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4">
              {/* Image */}
              <div className="md:col-span-5 bg-muted/30 rounded-2xl p-4 flex items-center justify-center max-h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="max-h-[250px] w-auto object-contain"
                />
              </div>

              {/* Details */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">{quickViewProduct.name}</h3>
                  <span className="text-lg font-bold mt-2 block">${quickViewProduct.price}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{quickViewProduct.description}</p>
                
                {quickViewProduct.specs && quickViewProduct.specs.length > 0 && (
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
                )}

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-opacity text-xs tracking-wider"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="border border-border text-foreground hover:bg-muted/50 font-semibold px-6 py-3 rounded-full transition-colors text-xs tracking-wider"
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
