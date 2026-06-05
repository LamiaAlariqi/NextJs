import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name || "");
      setEmail(parsedUser.email || "");
      
      // Verify session validity with the backend
      axios.get(`/api/v1/user/${parsedUser._id}`).catch(() => {
          localStorage.removeItem("user");
          navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get('/api/v1/logout');
    } catch (error) {
      console.error("Logout error", error);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    Cookies.remove("token");
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Assume backend needs ID in URL based on controller req.params.id
        const res = await axios.put(`/api/v1/user/update/${user._id}`, { name, email });
        if(res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            toast.success("Profile updated successfully");
            setIsEditing(false);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
        setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-2xl overflow-hidden">
          {/* Header Background */}
          <div className="h-48 bg-gradient-to-r from-primary via-secondary to-accent relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Avatar & Basic Info */}
          <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-16 relative z-10 gap-6">
            <div className="avatar ring-4 ring-base-100 ring-offset-2 ring-offset-base-100 rounded-full bg-base-100">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                <img 
                  src={user.profile?.url && user.profile.url !== 'url' ? user.profile.url : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                  alt="Profile" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
              <h1 className="text-3xl font-extrabold text-base-content tracking-tight">{user.name}</h1>
              <p className="text-primary font-medium mt-1 uppercase tracking-wider text-sm flex items-center justify-center sm:justify-start gap-2">
                <span className="badge badge-primary badge-sm"></span>
                {user.role || 'User'}
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto mt-6 sm:mt-0">
              {!isEditing && (
                <>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="btn btn-outline btn-primary flex-1 sm:flex-none transition-transform hover:-translate-y-1"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => navigate('/update-password')} 
                    className="btn btn-outline btn-secondary flex-1 sm:flex-none transition-transform hover:-translate-y-1"
                  >
                    Change Password
                  </button>
                </>
              )}
              <button 
                onClick={handleLogout} 
                className="btn btn-error text-white flex-1 sm:flex-none shadow-lg shadow-error/30 transition-transform hover:-translate-y-1"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="divider m-0"></div>

          {/* Details Section */}
          <div className="p-8">
            <h2 className="text-xl font-bold mb-6 text-base-content border-b border-base-200 pb-2">Account Details</h2>
            
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6 bg-base-200/30 p-6 rounded-2xl border border-base-200">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">Full Name</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">Email Address</span>
                  </label>
                  <input 
                    type="email" 
                    className="input input-bordered w-full bg-base-100 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="btn btn-primary flex-1 shadow-lg shadow-primary/30" disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-base-200/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-base-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60 font-medium">Email Address</p>
                      <p className="font-semibold text-base-content text-lg truncate" title={user.email}>{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-base-200/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-base-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60 font-medium">Account Role</p>
                      <p className="font-semibold text-base-content text-lg capitalize">{user.role || 'User'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {!isEditing && (
              <div className="mt-8 bg-gradient-to-r from-base-200 to-base-100 p-8 rounded-2xl border border-base-200 shadow-sm">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-accent">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                   </svg>
                   Welcome to Daraz
                 </h3>
                 <p className="text-base-content/70 leading-relaxed">
                   We're glad to have you here. This is your personal dashboard where you can manage your account settings, view your order history, and update your preferences. More features are coming soon!
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
