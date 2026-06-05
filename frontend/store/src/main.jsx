import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { CartProvider } from './context/CartContext.jsx';
import axios from 'axios';
import Cookies from 'js-cookie';

// Configure Axios defaults globally
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Intercept requests to attach Authorization header if token exists (crucial for cross-origin deployments)
axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
<BrowserRouter>
 <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
</BrowserRouter>
)
