"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("aura_user");
    if (!savedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);

      // Fetch the latest user info from the database
      if (parsedUser._id) {
        fetch(`/api/users/${parsedUser._id}`)
          .then((res) => res.json())
          .then((result) => {
            if (result.success && result.user) {
              setFormData({
                name: result.user.name,
                email: result.user.email
              });
              // Keep local storage in sync with fresh database info
              localStorage.setItem("aura_user", JSON.stringify(result.user));
            } else {
              setFormData({
                name: parsedUser.name,
                email: parsedUser.email
              });
            }
          })
          .catch((err) => {
            console.error("Error fetching user data:", err);
            setFormData({
              name: parsedUser.name,
              email: parsedUser.email
            });
          })
          .finally(() => setLoading(false));
      } else {
        setFormData({
          name: parsedUser.name,
          email: parsedUser.email
        });
        setLoading(false);
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/users/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile.");
      }

      // Update session storage
      const updatedSessionUser = {
        ...currentUser,
        name: result.user.name,
        email: result.user.email
      };
      localStorage.setItem("aura_user", JSON.stringify(updatedSessionUser));
      setCurrentUser(updatedSessionUser);

      setSuccessMessage("Your profile details have been updated successfully.");

      // Dispatch custom event to notify Navbar of state changes dynamically
      window.dispatchEvent(new Event("aura_login_state_change"));
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "An error occurred while updating. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-background py-32 px-6">
        <p className="text-sm text-muted-foreground animate-pulse">Retrieving your profile details...</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="flex-1 flex items-center justify-center bg-background py-20 px-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="w-full max-w-[460px] glass rounded-[2.5rem] border border-border/40 p-8 sm:p-12 text-center flex flex-col items-center gap-6 animate-fade-in">
          <div className="w-16 h-16 bg-muted/60 rounded-full flex items-center justify-center text-muted-foreground border border-border/40">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Access Restricted</h1>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Please sign in to your AURA account to view and manage your profile details, order history, and settings.
            </p>
          </div>
          <Link
            href="/Login"
            className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-full hover:opacity-95 transition-all text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer"
          >
            SIGN IN NOW
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background text-foreground transition-colors duration-300 py-16 px-6 relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col items-start gap-3 border-b border-border/20 pb-6 animate-fade-in">
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase">
            Aura Space
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
            My <span className="gradient-text font-extrabold">Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your personal credentials, contact settings, and review account statistics.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Avatar & Quick Info Card */}
          <div className="md:col-span-4 flex flex-col gap-6 animate-fade-in-delay-1 w-full">
            <div className="glass rounded-[2rem] border border-border/40 p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -z-10" />
              
              {/* Premium Avatar Representation */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-[3px] flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl font-bold text-primary">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{formData.name}</h3>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mt-0.5">AURA MEMBER</span>
              </div>

              <div className="h-px bg-border/40 w-full" />

              <div className="w-full flex flex-col gap-3 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 text-[9px] tracking-wide uppercase">Active</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Joined</span>
                  <span className="text-foreground font-medium">July 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="md:col-span-8 w-full animate-fade-in-delay-2">
            <div className="glass rounded-[2.5rem] border border-border/40 p-6 sm:p-8">
              <h2 className="text-base font-bold tracking-tight text-foreground mb-6">Profile Settings</h2>
              
              <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                {successMessage && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs px-4 py-3 rounded-xl animate-fade-in flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{successMessage}</span>
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

                {/* Name Field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="profile-name" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="profile-email" className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase pl-1">
                    Email Address
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-muted/40 border border-border/70 rounded-2xl px-5 py-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full sm:w-auto self-start bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-full hover:opacity-95 transition-all text-xs tracking-widest mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {updating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      SAVING CHANGES...
                    </>
                  ) : (
                    "SAVE CHANGES"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
