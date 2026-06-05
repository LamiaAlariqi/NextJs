import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { CartProvider } from './context/CartContext.jsx';
import axios from 'axios';

// Configure Axios defaults globally
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
<BrowserRouter>
 <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
</BrowserRouter>
)
