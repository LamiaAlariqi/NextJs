import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';
import { translateCategoryToEnglish } from '../src/utils/categoryTranslator';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    
    return (
        <div className="group relative w-full bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            
            {/* Stock status badge */}
            <div className={`absolute top-6 left-6 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md backdrop-blur-sm ${product?.stock > 0 ? 'bg-emerald-500/90' : 'bg-rose-500/90'}`}>
                {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>

            {/* Favorite Icon */}
            <button className="absolute top-6 right-6 z-10 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full text-gray-400 hover:text-rose-500 hover:bg-white transition-all shadow-sm hover:scale-110 hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
            
            {/* Product image container with hover zoom effects */}
            <Link to={`/product-detail/${product?._id}`} className="block relative w-full h-64 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 mb-5 flex items-center justify-center p-4">
                <img
                    src={(product?.images && product.images.length > 0) ? product.images[0].url : "https://via.placeholder.com/300"}
                    alt={product?.title || "Product"}
                    className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                     <span className="bg-white/90 text-black px-6 py-2.5 rounded-full font-bold shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-sm">
                         View Details
                     </span>
                </div>
            </Link>

            {/* Product details */}
            <div className="px-2 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 rounded-full">
                        {translateCategoryToEnglish(product?.category)}
                    </span>
                    
                    <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="font-bold text-gray-700 dark:text-gray-300 text-xs">{product?.ratings || "0.0"}</span>
                    </div>
                </div>

                <Link to={`/product-detail/${product?._id}`}>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1 mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {product?.title}
                    </h2>
                </Link>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
                    {product?.description}
                </p>

                {/* Price and Action buttons */}
                <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through decoration-1 mb-0.5 ml-1">
                            ${(product?.price || 0) + 120}
                        </span>
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            ${product?.price || 0}
                        </span>
                    </div>

                    <button 
                        onClick={() => addToCart(product, 1)}
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group/btn ${
                            product?.stock > 0 
                            ? 'bg-gray-900 hover:bg-indigo-600 text-white hover:scale-105 active:scale-95 hover:shadow-indigo-500/30' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={product?.stock === 0}
                        title={product?.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${product?.stock > 0 ? 'group-hover/btn:rotate-12' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
