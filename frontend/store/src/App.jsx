import React from 'react'
import Navbar from '../component/Navbar'
import Home from '../pages/Home'
import { Routes, Route, Navigate } from "react-router-dom"
import About from '../pages/About'
import Contact from '../pages/Contact'
import Footer from '../component/Footer'
import ProductDetail from '../pages/ProductDetail'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Profile from '../pages/profile'
import UpdatePassword from '../pages/UpdatePassword'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import DashboardAdmin from '../pages/admin/DashboardAdmin'
import ViewAllUsers from '../pages/admin/ViewAllUsers'
import ViewAllOrders from '../pages/admin/ViewAllOrders'
import CreateProduct from '../pages/admin/CreateProduct'
import ViewAllProducts from '../pages/admin/ViewAllProducts'
import UpdateProduct from '../pages/admin/UpdateProduct'
import Cart from '../pages/Cart'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/product-detail/:id' element={<ProductDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/update-password' element={<UpdatePassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        {/* عشان يفتح لي صفحة التحديث بعد الضغط ع الراب */}
        <Route path='/password/reset-password/:token' element={<ResetPassword />} />
        <Route path='/admin' element={<Navigate to="/admin/dashboard" />} />
        <Route path='/admin/dashboard' element={<DashboardAdmin />} />
        <Route path='/admin/users' element={<ViewAllUsers />} />
        <Route path='/admin/orders' element={<ViewAllOrders />} />
        <Route path='/admin/product/new' element={<CreateProduct />} />
        <Route path='/admin/products' element={<ViewAllProducts />} />
        <Route path='/admin/product/update/:id' element={<UpdateProduct />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
