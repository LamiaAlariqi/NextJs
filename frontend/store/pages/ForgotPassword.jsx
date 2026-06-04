import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/forgot-password', { email });
      if (res.data?.success) {
        toast.success(res.data.message || "Password reset link sent to your email");
        setSuccess(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send password reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl overflow-hidden mt-6 mb-10">
        <div className="card-body p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-base-content mb-2">Forgot Password</h1>
            <p className="text-base-content/70">
              {success ? "Check your email for the reset link." : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">Email Address</span>
                </label>
                <input 
                  type="email" 
                  placeholder="hello@example.com" 
                  className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary w-full text-lg shadow-lg shadow-primary/30 transition-transform ${loading ? '' : 'hover:-translate-y-1'}`}
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : "Send Reset Link"}
              </button>
            </form>
          ) : (
             <div className="text-center bg-base-200/50 p-6 rounded-xl border border-base-200">
                <p className="text-sm font-medium">Didn't receive the email?</p>
                <button onClick={() => setSuccess(false)} className="btn btn-ghost btn-sm mt-2 text-primary">Try again</button>
             </div>
          )}

          <div className="text-center mt-8">
            <Link to="/login" className="text-sm text-base-content/70 hover:text-primary transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
