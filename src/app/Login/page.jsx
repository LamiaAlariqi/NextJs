"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionContext = useSession();
  const session = sessionContext?.data;
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

  if (session?.user) {
    return (
      <div className="w-full max-w-[460px] glass rounded-[2.5rem] border border-border/60 p-8 sm:p-12 animate-fade-in text-center flex flex-col items-center gap-5">
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name || "User Avatar"}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold">
            {session.user.name?.charAt(0) || "U"}
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-foreground">{session.user.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">{session.user.email}</p>
          <span className="inline-block mt-3 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20">
            ✓ Signed In with OAuth
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full mt-4">
          <Link
            href="/home"
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-full hover:opacity-90 transition-opacity text-xs tracking-widest"
          >
            GO TO HOME STORE
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full border border-border text-red-500 font-semibold py-3 rounded-full hover:bg-red-500/10 transition-colors text-xs tracking-widest cursor-pointer"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on change
    setInfoMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid email or password.");
      }

      // Save user session details
      localStorage.setItem("aura_user", JSON.stringify(result.user));
      if (result.token) {
        localStorage.setItem("aura_token", result.token);
      }
      
      // Dispatch custom event to notify Navbar of state changes dynamically
      window.dispatchEvent(new Event("aura_login_state_change"));

      // Redirect to home page
      router.push("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

        {/* NextAuth Social Authentication Section */}
        <div className="flex flex-col gap-3 mt-6 border-t border-border/60 pt-6">
          <p className="text-center text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Or Sign In With OAuth (NextAuth)
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => signIn("github")}
              className="flex-1 bg-muted/60 hover:bg-muted border border-border text-foreground font-medium py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex-1 bg-muted/60 hover:bg-muted border border-border text-foreground font-medium py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>
          </div>
        </div>
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
