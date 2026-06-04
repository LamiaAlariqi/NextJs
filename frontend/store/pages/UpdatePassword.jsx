import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      return toast.error("New Password doesn't match with Confirm Password");
    }

    setLoading(true);
    try {
      const res = await axios.put('/api/v1/password/update', { 
        oldPassword, 
        newPassword, 
        confirmNewPassword 
      });
      
      if (res.data?.success) {
        toast.success("Password updated successfully");
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent relative flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20"></div>
            <h2 className="text-3xl font-extrabold text-white z-10 tracking-tight">Change Password</h2>
        </div>
        
        <div className="card-body px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content">Old Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter old password" 
                className="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content">New Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                className="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content">Confirm New Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Confirm new password" 
                className="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-8">
              <button 
                type="submit" 
                className="btn btn-primary w-full shadow-lg shadow-primary/30" 
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Update Password'}
              </button>
            </div>
            <div className="text-center mt-4">
               <button type="button" onClick={() => navigate('/profile')} className="btn btn-ghost btn-sm">Back to Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
