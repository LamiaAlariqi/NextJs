"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validations
    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create account.");
      }

      setSuccess(true);

      // Redirect to login page after short delay
      setTimeout(() => {
        router.push("/Login?signup=success");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center bg-background py-16 px-6 relative overflow-hidden">
      {/* Glowing backdrop circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-[460px] glass rounded-[2.5rem] border border-border/60 p-8 sm:p-12 animate-fade-in relative">
        {/* Brand logo style header */}
        <div className="text-center flex flex-col items-center gap-2 mb-8">
          <Link href="/home" className="flex items-center gap-1 group">
            <span className="text-lg font-bold tracking-[0.25em] text-foreground transition-all group-hover:opacity-80">
              A U R A
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-2">Create Account</h1>
          <p className="text-xs text-muted-foreground">Join us to experience premium minimalist tech</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-5 border border-emerald-500/20">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Registration Complete!</h3>
            <p className="text-xs text-muted-foreground">Redirecting you to the login screen...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-xl animate-fade-in flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-name" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Carter"
                className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
                required
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-email" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-password" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signup-confirm-password" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full hover:opacity-95 transition-all text-xs tracking-widest mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CREATING ACCOUNT...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>

            {/* Link to Login */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/Login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
