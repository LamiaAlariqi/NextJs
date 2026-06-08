import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';

const CreateProduct = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        setLoading(true);

        try {
            const productData = {
                title,
                description,
                price: Number(price),
                category,
                stock: Number(stock),
                images: images
            };

            const response = await axios.post('/api/v1/product/new', productData, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success('Product created successfully!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error(error.response?.data?.message || 'Error creating product');
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        "إلكترونيات",
        "كاميرات",
        "لابتوبات",
        "إكسسوارات",
        "سماعات",
        "أزياء وأحذية",
        "تجميل وصحة",
        "رياضة",
        "كتب",
        "منزل وحديقة",
        "ألعاب",
        "طعام",
        "رحلات"
    ];

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="btn btn-circle btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Create New Product</h1>
                        <p className="text-base-content/60">Fill in the details to add a new product to your inventory.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info Card */}
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body">
                            <h2 className="card-title text-xl mb-4 text-primary">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold">Product Title</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Premium Wireless Headphones" 
                                        className="input input-bordered w-full focus:border-primary" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category</span>
                                    </label>
                                    <select 
                                        className="select select-bordered w-full focus:border-primary"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold">Price ($)</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        className="input input-bordered w-full focus:border-primary" 
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold">Stock Quantity</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="0" 
                                        className="input input-bordered w-full focus:border-primary" 
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Description</span>
                                    </label>
                                    <textarea 
                                        className="textarea textarea-bordered h-32 focus:border-primary" 
                                        placeholder="Detailed product description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images Card */}
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body">
                            <h2 className="card-title text-xl text-primary mb-4">Product Images</h2>
                            
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">Select Images</span>
                                </label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple 
                                    onChange={handleImageChange}
                                    className="file-input file-input-bordered file-input-primary w-full" 
                                    required
                                />
                            </div>

                            {imagesPreview.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-sm font-semibold mb-2">Images Preview:</p>
                                    <div className="flex flex-wrap gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-300">
                                        {imagesPreview.map((image, index) => (
                                            <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-base-300 shadow-sm bg-base-100">
                                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">Cancel</button>
                        <button 
                            type="submit" 
                            className={`btn btn-primary px-8 shadow-lg shadow-primary/30 ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default CreateProduct;
