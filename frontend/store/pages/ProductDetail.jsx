import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';
import { translateCategoryToEnglish } from '../src/utils/categoryTranslator';

const ProductDetail = () => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { id } = useParams();

  const getProductDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/product/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProductDetails();
  }, [id]);

  if (!product) {
    return <div className="text-center mt-20 text-xl font-semibold">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SIDE - IMAGE */}
        <div className="w-full">
          <img
            src={(product?.images && product.images.length > 0) ? product.images[0].url : "https://via.placeholder.com/600"}
            alt={product?.title}
            className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* RIGHT SIDE - DETAILS */}
        <div className="flex flex-col justify-between">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product?.title}
            </h1>

            <p className="text-gray-500 mb-2">
              Category: <span className="font-medium text-black">{translateCategoryToEnglish(product?.category)}</span>
            </p>

            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
              <div className="flex text-yellow-500 text-lg">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.round(product?.ratings || 0) ? '★' : '☆'}</span>
                ))}
              </div>
              <span>({product?.numOfReviews || 0} Reviews)</span>
            </div>

            <p className="text-2xl font-semibold text-green-600 mb-4">
              ${product?.price || 0}
            </p>

            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4 text-sm text-gray-600 dark:text-gray-300 space-y-1 w-fit">
              <p><strong>Product ID:</strong> {product?._id}</p>
              <p><strong>Added On:</strong> {new Date(product?.createdAt).toLocaleDateString('en-US')}</p>
              <p><strong>Last Updated:</strong> {new Date(product?.updatedAt).toLocaleDateString('en-US')}</p>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {product?.description}
            </p>

            <p className={`font-bold mb-6 ${product?.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product?.stock > 0 ? `In Stock (${product?.stock})` : "Out of Stock"}
            </p>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            {/* Quantity */}
            {product?.stock > 0 && (
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-base-100">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="px-4 py-2 hover:bg-base-300 active:bg-base-200 transition-colors font-bold text-lg"
                >
                  -
                </button>
                <span className="px-6 font-bold text-lg select-none">{qty}</span>
                <button
                  onClick={() => qty < product?.stock && setQty(qty + 1)}
                  className="px-4 py-2 hover:bg-base-300 active:bg-base-200 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product, qty)}
              className={`px-8 py-3 rounded-xl shadow-lg transition-all duration-300 font-bold text-white flex items-center gap-2 ${
                product?.stock > 0 
                  ? 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-blue-500/20' 
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              }`}
              disabled={product?.stock === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail;