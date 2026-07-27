"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: "", color: "" };
    if (pass.length < 6) return { label: "Weak", color: "bg-red-500 text-red-400" };
    if (pass.length < 10 || !/\d/.test(pass)) return { label: "Medium", color: "bg-amber-500 text-amber-400" };
    return { label: "Strong", color: "bg-emerald-500 text-emerald-400" };
  };

  const strength = getPasswordStrength(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/updatePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update password.");
      }

      setSuccess("Password updated successfully! Redirecting...");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#0d0f17] text-slate-100 min-h-screen py-12 px-4 sm:px-8 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background glow highlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md bg-[#141724] border border-[#24293e] rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 flex flex-col gap-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <span className="text-[10px] font-extrabold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 w-max mx-auto">
            Account Security
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Update Password
          </h1>
          <p className="text-xs text-slate-400">
            Ensure your account is using a strong, secure password.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-4 rounded-2xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-4 rounded-2xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Old Password */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full bg-[#1c2134] border border-[#2b324d] rounded-2xl px-5 py-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 pr-12 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={showOldPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                </svg>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center pl-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                New Password *
              </label>
              {strength.label && (
                <span className={`text-[10px] font-black uppercase ${strength.color}`}>
                  Strength: {strength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password (min. 6 chars)"
                className="w-full bg-[#1c2134] border border-[#2b324d] rounded-2xl px-5 py-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 pr-12 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={showNewPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter new password"
                className="w-full bg-[#1c2134] border border-[#2b324d] rounded-2xl px-5 py-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 pr-12 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={showConfirmPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password Now</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center border-t border-[#24293e] pt-4">
          <Link
            href="/profile"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to My Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
