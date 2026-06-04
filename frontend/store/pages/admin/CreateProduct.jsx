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
    const [images, setImages] = useState([{ public_id: '', url: '' }]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleImageChange = (index, field, value) => {
        const newImages = [...images];
        newImages[index][field] = value;
        setImages(newImages);
    };

    const addImageField = () => {
        setImages([...images, { public_id: '', url: '' }]);
    };

    const removeImageField = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                title,
                description,
                price: Number(price),
                category,
                stock: Number(stock),
                images: images.filter(img => img.public_id && img.url)
            };

            const response = await axios.post('http://localhost:8000/api/v1/product/new', productData, {
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
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title text-xl text-primary">Product Images</h2>
                                <button type="button" onClick={addImageField} className="btn btn-sm btn-outline btn-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    Add Image
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {images.map((image, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-base-200/50 rounded-2xl relative group">
                                        {images.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeImageField(index)}
                                                className="btn btn-circle btn-xs btn-error absolute -top-2 -right-2 md:top-2 md:right-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                        <div className="form-control flex-1">
                                            <label className="label py-1">
                                                <span className="label-text text-xs font-bold">Public ID</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. product_image_1" 
                                                className="input input-sm input-bordered focus:border-primary" 
                                                value={image.public_id}
                                                onChange={(e) => handleImageChange(index, 'public_id', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-control flex-[2]">
                                            <label className="label py-1">
                                                <span className="label-text text-xs font-bold">Image URL</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="https://example.com/image.jpg" 
                                                className="input input-sm input-bordered focus:border-primary" 
                                                value={image.url}
                                                onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
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
