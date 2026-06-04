import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';

const ViewAllProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/products");
            setProducts(response.data.products || []);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:8000/api/v1/product/${id}`, {
                    withCredentials: true
                });
                toast.success("Product deleted successfully");
                // Remove the deleted product from the local state
                setProducts(products.filter(product => product._id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Products Management</h1>
                        <p className="text-base-content/60 mt-1">View, edit, and delete products in your store.</p>
                    </div>
                    <Link to="/admin/product/new" className="btn btn-primary shadow-lg shadow-primary/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add New Product
                    </Link>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body p-0 overflow-x-auto">
                        {isLoading ? (
                            <div className="flex justify-center p-12">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : (
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-base-200 text-base-content/70">
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? (
                                        products.map((product) => (
                                            <tr key={product._id} className="hover:bg-base-200/50 transition-colors">
                                                <td>
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img 
                                                                src={(product.images && product.images.length > 0) ? product.images[0].url : "https://via.placeholder.com/150"} 
                                                                alt={product.title} 
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="font-bold">{product.title}</div>
                                                </td>
                                                <td>{product.category}</td>
                                                <td>${product.price}</td>
                                                <td>
                                                    <div className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-error'} badge-sm`}>
                                                        {product.stock}
                                                    </div>
                                                </td>
                                                <td className="text-right space-x-2">
                                                    <Link 
                                                        to={`/admin/product/update/${product._id}`} 
                                                        className="btn btn-sm btn-ghost text-info hover:bg-info/10"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(product._id)} 
                                                        className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-8 text-base-content/60">
                                                No products found. Start by creating one!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewAllProducts;
