import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([{ public_id: '', url: '' }]);

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

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/product/${id}`);
                const product = response.data.product;
                
                setTitle(product.title || '');
                setDescription(product.description || '');
                setPrice(product.price !== undefined && product.price !== null ? product.price : '');
                setCategory(product.category || '');
                setStock(product.stock !== undefined && product.stock !== null ? product.stock : '');
                
                if (product.images && product.images.length > 0) {
                    setImages(product.images);
                } else {
                    setImages([{ public_id: '', url: '' }]);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error("Failed to load product details");
                navigate('/admin/products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [id, navigate]);

    const handleImageChange = (index, field, value) => {
        const newImages = [...images];
        newImages[index][field] = value;
        setImages(newImages);
    };

    const addImageField = () => {
        setImages([...images, { public_id: '', url: '' }]);
    };

    const removeImageField = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Filter out empty images
            const validImages = images.filter(img => img.url.trim() !== '');

            const productData = {
                title,
                description,
                price: Number(price),
                category,
                stock: Number(stock),
                images: validImages.length > 0 ? validImages : undefined
            };

            await axios.put(`http://localhost:8000/api/v1/product/update/${id}`, productData, {
                withCredentials: true
            });

            toast.success("Product updated successfully!");
            navigate('/admin/products');
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(error.response?.data?.message || "Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-full min-h-[50vh]">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-base-content">Update Product</h1>
                    <p className="text-base-content/60 mt-1">Modify the details of your existing product below.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <h2 className="card-title text-xl text-primary border-b border-base-200 pb-2 mb-4">Basic Information</h2>
                                
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold">Product Title</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Apple iPhone 15 Pro" 
                                        className="input input-bordered w-full focus:border-primary" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                            {categories.map((cat) => (
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
                                </div>

                                <div className="form-control w-full mt-4">
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
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <div className="flex justify-between items-center border-b border-base-200 pb-2 mb-4">
                                    <h2 className="card-title text-xl text-primary">Images</h2>
                                    <button type="button" onClick={addImageField} className="btn btn-xs btn-outline btn-primary">
                                        Add
                                    </button>
                                </div>
                                
                                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {images.map((image, index) => (
                                        <div key={index} className="p-4 bg-base-200 rounded-xl relative group border border-base-300">
                                            {images.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeImageField(index)}
                                                    className="btn btn-circle btn-xs btn-error absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            )}
                                            
                                            {image.url && (
                                                <div className="w-full h-32 bg-base-100 rounded-lg mb-3 overflow-hidden border border-base-300">
                                                    <img src={image.url} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Image URL" 
                                                    className="input input-sm input-bordered w-full" 
                                                    value={image.url}
                                                    onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                                                    required={index === 0}
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Public ID (Optional)" 
                                                    className="input input-sm input-bordered w-full" 
                                                    value={image.public_id}
                                                    onChange={(e) => handleImageChange(index, 'public_id', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/admin/products')}
                                    className="btn btn-outline w-full mt-2"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default UpdateProduct;
