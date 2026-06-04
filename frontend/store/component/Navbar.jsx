import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useCart } from '../src/context/CartContext'

const Navbar = () => {
  const { cartItems } = useCart();
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // re-run when route changes

  const handleLogout = async () => {
    try {
      await axios.get('/api/v1/logout');
    } catch (error) {
      console.error("Logout error", error);
    }
    localStorage.removeItem("user");
    Cookies.remove("token"); // Optional: removes JS cookie if it exists
    setUser(null);
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">

      {/* LEFT */}
      <div className="navbar-start">

        {/* Mobile Hamburger */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>

          {/* Mobile Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">AboutUs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Logo */}
        <a className="text-3xl font-bold ms-4 cursor-pointer">
          Daraz
        </a>
      </div>

      {/* CENTER (Desktop only) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-4">
          <li><a>Home</a></li>
          <li><a>Products</a></li>
          <li><a>Categories</a></li>
          <li><a>Contact</a></li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end me-6">

        {/* Cart */}
        <Link to="/cart" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5" />
            </svg>
            <span className="badge badge-sm indicator-item badge-primary">
              {cartItemsCount}
            </span>
          </div>
        </Link>

        {/* Profile */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="profile"
                src={user?.profile?.url && user.profile.url !== 'url' ? user.profile.url : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              />
            </div>
          </div>
          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-[1]">
            {user ? (
              <>
                <li className="px-4 py-2 font-bold text-primary border-b border-base-200 mb-2 truncate">Hello, {user.name}</li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link onClick={handleLogout} className="text-error">Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>

      </div>
    </div>
  )
}

export default Navbar
