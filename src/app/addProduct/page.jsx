"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "Audio",
    condition: "🟢 New",
    stocks: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "url"

  const CATEGORIES = [
    "Electronics",
    "Furniture",
    "Cars",
    "Makeup & Beauty",
    "Clothing & Fashion",
    "Audio",
    "Wearables",
    "Ambient Home",
    "Other Categories"
  ];

  const CONDITIONS = [
    "🟢 New",
    "🟠 Used - Excellent",
    "🟠 Used - Good",
    "🔵 Refurbished"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  // Upload image file to Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "docs_upload_example_us_preset"
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const fileData = await res.json();

      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, image: fileData.secure_url }));
        setSuccess("Image uploaded to Cloudinary successfully!");
      } else {
        // Fallback: convert file to local Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image: reader.result }));
          setSuccess("Image selected successfully!");
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      // Fallback: convert file to local Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setSuccess("Image selected successfully!");
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.description || !formData.price || !formData.image || !formData.category) {
      setError("Please fill in all required fields and upload an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: formData.price.toString(),
          image: formData.image.trim(),
          category: formData.category,
          condition: formData.condition,
          stocks: Number(formData.stocks) || 1,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create product listing.");
      }

      setSuccess("Product submitted successfully! It is now pending admin approval before appearing in store.");
      setFormData({
        title: "",
        description: "",
        price: "",
        image: "",
        category: "Audio",
        condition: "🟢 New",
        stocks: 1,
      });

      setTimeout(() => {
        router.push("/products");
      }, 1500);
    } catch (err) {
      console.error("Add Product Error:", err);
      setError(err.message || "An error occurred while creating the listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-background text-foreground transition-colors duration-300 py-16 px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto flex flex-col gap-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
            Sell Item / Cloudinary Upload
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Add New <span className="gradient-text font-extrabold">Product</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Select an image directly from your gallery via Cloudinary to list your product.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass rounded-[2.5rem] border border-border/60 p-8 sm:p-12 relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs px-4 py-3 rounded-xl animate-fade-in flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-xl animate-fade-in flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-title" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                Product Title *
              </label>
              <input
                id="product-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., iPhone 15 Pro Max 256GB"
                className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
                required
              />
            </div>

            {/* Category & Condition Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="product-category" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                  Category *
                </label>
                <select
                  id="product-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                  required
                >
                  {CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat} className="bg-card text-foreground">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="product-condition" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                  Item Condition
                </label>
                <select
                  id="product-condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                >
                  {CONDITIONS.map((cond, idx) => (
                    <option key={idx} value={cond} className="bg-card text-foreground">
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Stock Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="product-price" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                  Price ($ USD) *
                </label>
                <input
                  id="product-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 850"
                  min="0"
                  step="any"
                  className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="product-stock" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                  Available Stock Quantity
                </label>
                <input
                  id="product-stock"
                  type="number"
                  name="stocks"
                  value={formData.stocks}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            {/* Cloudinary Image Picker & Upload Section */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                  Product Image *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      uploadMode === "file"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    📁 Select from Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      uploadMode === "url"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🔗 Image URL
                  </button>
                </div>
              </div>

              {uploadMode === "file" ? (
                <div className="relative border-2 border-dashed border-border/80 hover:border-primary/60 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 bg-muted/20 transition-all group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    disabled={isUploading}
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs font-semibold text-primary">Uploading to Cloudinary...</span>
                    </div>
                  ) : formData.image ? (
                    <div className="flex flex-col items-center gap-3 relative z-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.image}
                        alt="Uploaded Preview"
                        className="max-h-40 max-w-full object-contain rounded-2xl border border-border/40 shadow-md"
                      />
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        ✓ Image Uploaded - Click to Change
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-foreground">Click or Drag Image to Upload</span>
                      <span className="text-[10px] text-muted-foreground">Select photo from Gallery via Cloudinary (PNG, JPG, WEBP)</span>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
                  required
                />
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-desc" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                Product Description *
              </label>
              <textarea
                id="product-desc"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the features, condition, battery health, and warranty details..."
                className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-full transition-all text-xs tracking-widest mt-4 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  PUBLISHING LISTING...
                </>
              ) : (
                "CREATE & PUBLISH PRODUCT"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
