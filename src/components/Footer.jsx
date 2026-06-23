"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer id="footer" className="bg-card text-card-foreground border-t border-border mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/home" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-[0.25em] text-foreground">
                A U R A
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Crafting premium minimalist gadgets and elegant home technology that enhances your everyday workspace and lifestyle.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-2">
              {["instagram", "twitter", "linkedin", "github"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={social}
                >
                  <span className="capitalize text-xs font-semibold tracking-wider hover:underline">
                    {social.substring(0, 2)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-foreground">
              Explore
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/home"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <a
                  href="#categories"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  New Arrivals
                </a>
              </li>
              <li>
                <a
                  href="#promo"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Offers
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-foreground">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Sustainability
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Press Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Stay Connected
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Subscribe to receive updates on new product launches, exclusive events, and styling inspiration.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-1">
              <div className="flex items-center border border-border rounded-full p-1 pl-4 bg-background focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none w-full py-1.5"
                  required
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground text-[10px] font-bold px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  JOIN
                </button>
              </div>
              {subscribed && (
                <span className="text-[10px] text-emerald-500 font-medium animate-fade-in pl-2">
                  Thank you! You are now subscribed to AURA.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright / footer */}
        <div className="border-t border-border/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} AURA Inc. All rights reserved. Designed for modern life.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground">
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
