import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formData = { email, password };
  const handleLogin = (e) => {
    e.preventDefault();
    const loginUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("/api/v1/login", formData);
        console.log(response);
        const token = response.data?.token;
        if (token) {
          Cookies.set("token", token, { expires: 7 });
          localStorage.setItem("token", token);
        }
        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          toast.success("Logged in successfully");
          
          // توجيه الأدمن للوحة التحكم مباشرة، والمستخدم العادي للصفحة الرئيسية
          if (response.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } else {
          toast.success("Logged in successfully");
          navigate('/');
        }
      } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || "Login failed. Please check your credentials.";
        toast.error(errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    loginUser();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="card lg:card-side bg-base-100 shadow-2xl max-w-4xl w-full overflow-hidden mt-6 mb-10">
        {/* Left Side: Image/Info */}
        <div className="lg:w-1/2 relative hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1510481665421-2a62885ca68a?auto=format&fit=crop&q=80&w=1000" 
            alt="Workspace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900 bg-opacity-40 flex items-center justify-center p-8 text-center text-white backdrop-blur-[2px]">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-md">Welcome Back</h2>
              <p className="text-lg opacity-90 drop-shadow-sm">Discover the best products tailored just for you. Login to access your personalized experience.</p>
            </div>
          </div>
        </div>
        
        {/* Right Side: Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 w-full flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-base-content mb-2">Sign In</h1>
            <p className="text-base-content/70">Welcome back! Please enter your details.</p>
          </div>
          
          {error && (
            <div className="alert alert-error mb-4 shadow-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">Email</span>
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
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="label pb-0">
                <Link to="/forgot-password" className="label-text-alt link link-hover text-primary font-medium">Forgot password?</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full text-lg shadow-lg shadow-primary/30 transition-transform ${loading ? '' : 'hover:-translate-y-1'}`}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Sign In"}
            </button>
          </form>

          <div className="divider text-base-content/50 my-6">OR</div>

          <button className="btn btn-outline hover:bg-base-200 hover:text-base-content w-full mb-6 gap-2 hover:-translate-y-0.5 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-base-content/70">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline transition-all">Sign up now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
