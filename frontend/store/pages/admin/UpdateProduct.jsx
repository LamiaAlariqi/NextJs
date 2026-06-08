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
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

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
                const response = await axios.get(`/api/v1/product/${id}`);
                const product = response.data.product;
                
                setTitle(product.title || '');
                setDescription(product.description || '');
                setPrice(product.price !== undefined && product.price !== null ? product.price : '');
                setCategory(product.category || '');
                setStock(product.stock !== undefined && product.stock !== null ? product.stock : '');
                
                if (product.images) {
                    setOldImages(product.images);
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

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

    const removeOldImage = (index) => {
        setOldImages(oldImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImagesPreview(imagesPreview.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (oldImages.length === 0 && images.length === 0) {
            toast.error("Please provide at least one image");
            return;
        }

        setIsSubmitting(true);

        try {
            const productData = {
                title,
                description,
                price: Number(price),
                category,
                stock: Number(stock),
                images: [...oldImages, ...images]
            };

            await axios.put(`/api/v1/product/update/${id}`, productData, {
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
                                <h2 className="card-title text-xl text-primary border-b border-base-200 pb-2 mb-4">Images</h2>
                                
                                <div className="form-control w-full mb-4">
                                    <label className="label">
                                        <span className="label-text font-semibold">Upload New Images</span>
                                    </label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple 
                                        onChange={handleImageChange}
                                        className="file-input file-input-bordered file-input-primary w-full file-input-sm" 
                                    />
                                </div>

                                {/* Existing Images */}
                                {oldImages.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-base-content/70">Current Images:</p>
                                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                                            {oldImages.map((image, index) => (
                                                <div key={index} className="relative group rounded-lg overflow-hidden border border-base-300 bg-base-200 h-24">
                                                    <img src={image.url} alt="Current Product" className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeOldImage(index)}
                                                        className="btn btn-circle btn-xs btn-error absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Previews */}
                                {imagesPreview.length > 0 && (
                                    <div className="space-y-3 mt-4 border-t border-base-200 pt-4">
                                        <p className="text-xs font-bold text-primary">New Images to Upload:</p>
                                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                                            {imagesPreview.map((image, index) => (
                                                <div key={index} className="relative group rounded-lg overflow-hidden border border-base-300 bg-base-200 h-24">
                                                    <img src={image} alt="New Preview" className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeNewImage(index)}
                                                        className="btn btn-circle btn-xs btn-error absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
