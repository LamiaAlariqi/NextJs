import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //عشان يسحب التوكن من الرابط
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await axios.post(`/api/v1/reset-password/${token}`, { 
        password, 
        confirmPassword 
      });
      
      if (res.data?.success) {
        const resToken = res.data?.token;
        if (resToken) {
          Cookies.set("token", resToken, { expires: 7 });
          localStorage.setItem("token", resToken);
        }
        if (res.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        toast.success("Password reset successfully. You are now logged in.");
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl overflow-hidden mt-6 mb-10">
        <div className="card-body p-8 lg:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-base-content mb-2">Reset Password</h1>
            <p className="text-base-content/70">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content">New Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content">Confirm Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Confirm new password" 
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full text-lg shadow-lg shadow-primary/30 transition-transform ${loading ? '' : 'hover:-translate-y-1'}`}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Set New Password"}
            </button>
          </form>

          <div className="text-center mt-8">
            <Link to="/login" className="text-sm text-base-content/70 hover:text-primary transition-colors flex items-center justify-center gap-2">
              Cancel and back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
