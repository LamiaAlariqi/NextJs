"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Show success message if redirected from signup page
    if (searchParams.get("signup") === "success") {
      setTimeout(() => {
        setInfoMessage("Account created successfully! Please sign in below.");
      }, 0);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on change
    setInfoMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    // Simulate authenticating against registered user in localStorage
    setTimeout(() => {
      setIsSubmitting(false);

      const registeredUserStr = localStorage.getItem("aura_registered_user");
      let sessionName = "AURA User";

      if (registeredUserStr) {
        try {
          const registeredUser = JSON.parse(registeredUserStr);
          if (
            registeredUser.email.toLowerCase() === formData.email.toLowerCase() &&
            registeredUser.password === formData.password
          ) {
            sessionName = registeredUser.name;
          } else {
            setError("Invalid email or password. Please try again.");
            return;
          }
        } catch (e) {
          console.error("Failed to parse registered user details", e);
        }
      } else {
        // Fallback: If no account registered, allow general guest access for testing
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        sessionName = formData.email.split("@")[0];
      }

      // Save user session details
      const userSession = {
        name: sessionName.charAt(0).toUpperCase() + sessionName.slice(1),
        email: formData.email
      };
      
      localStorage.setItem("aura_user", JSON.stringify(userSession));
      
      // Dispatch custom event to notify Navbar of state changes dynamically
      window.dispatchEvent(new Event("aura_login_state_change"));

      // Redirect to home page
      router.push("/home");
    }, 1500);
  };

  return (
    <div className="w-full max-w-[460px] glass rounded-[2.5rem] border border-border/60 p-8 sm:p-12 animate-fade-in relative">
      {/* Brand logo header */}
      <div className="text-center flex flex-col items-center gap-2 mb-8">
        <Link href="/home" className="flex items-center gap-1 group">
          <span className="text-lg font-bold tracking-[0.25em] text-foreground transition-all group-hover:opacity-80">
            A U R A
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-2">Sign In</h1>
        <p className="text-xs text-muted-foreground">Welcome back to AURA. Access your details.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {infoMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs px-4 py-3 rounded-xl animate-fade-in flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{infoMessage}</span>
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

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., mail@example.com"
            className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <label htmlFor="login-password" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Password
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Feature simulation: password reset link sent."); }} className="text-[10px] text-muted-foreground hover:text-primary transition-colors">
              Forgot?
            </a>
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/40"
            required
          />
        </div>

        {/* Remember me option */}
        <div className="flex items-center gap-2 pl-1 select-none">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-border bg-muted/40 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
          />
          <label htmlFor="remember-me" className="text-xs text-muted-foreground cursor-pointer">
            Remember me on this device
          </label>
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
              AUTHENTICATING...
            </>
          ) : (
            "SIGN IN"
          )}
        </button>

        {/* Link to Signup */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          New to AURA?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center bg-background py-16 px-6 relative overflow-hidden">
      {/* Glowing backdrop circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <Suspense fallback={
        <div className="w-full max-w-[460px] glass rounded-[2.5rem] border border-border/60 p-8 sm:p-12 text-center">
          <p className="text-xs text-muted-foreground animate-pulse">Loading auth details...</p>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </main>
  );
}
