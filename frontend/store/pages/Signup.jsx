import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formData = { name, email, password, role };
  const handleSignup = (e) => {
    e.preventDefault();
    const signupUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("/api/v1/register", formData);
        console.log(response);
        const token = response.data?.token;
        if (token) {
          Cookies.set("token", token, { expires: 7 });
        }
        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        toast.success("User registered successfully");
        navigate('/'); // Redirect to home on success
      } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
        toast.error(errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    signupUser();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 p-4">
      <div className="card lg:card-side bg-base-100 shadow-2xl max-w-5xl w-full overflow-hidden mt-6 mb-10">
        {/* Left Side: Form */}
        <div className="lg:w-[55%] p-8 lg:p-12 w-full flex flex-col justify-center order-2 lg:order-1">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-extrabold text-base-content mb-2">Create an Account</h1>
            <p className="text-base-content/70">Join us to get started with your premium experience.</p>
          </div>
          
          {error && (
            <div className="alert alert-error mb-4 shadow-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">Name</span>
              </label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">Role</span>
              </label>
              <select 
                className="select select-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors shadow-sm focus:shadow-md"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary btn-block text-lg mt-6 shadow-lg shadow-primary/30 transition-transform ${loading ? '' : 'hover:-translate-y-1'}`}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
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
            Sign up with Google
          </button>

          <p className="text-center text-sm text-base-content/70">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline transition-all">Sign in here</Link>
          </p>
        </div>
        
        {/* Right Side: Image/Info */}
        <div className="lg:w-[45%] relative hidden lg:block order-1 lg:order-2">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000" 
            alt="Office" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-emerald-900 bg-opacity-60 flex flex-col p-10 justify-between text-white backdrop-blur-[2px]">
            <div className="text-right">
              <h1 className="text-3xl font-extrabold tracking-wider text-white drop-shadow-md">Daraz</h1>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white leading-tight drop-shadow-md">Start your journey with us.</h2>
              <p className="text-lg opacity-90 mb-6 drop-shadow-sm">Join thousands of users enjoying our premium services and exclusive offers.</p>
              
              {/* Feature list */}
              <ul className="space-y-3 opacity-90 hidden xl:block drop-shadow-sm">
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/40 p-1"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <span className="font-medium">Free shipping on all orders</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/40 p-1"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <span className="font-medium">Exclusive member discounts</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/40 p-1"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                  <span className="font-medium">Personalized recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
