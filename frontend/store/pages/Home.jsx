import React, { useState, useEffect } from 'react';
import axios from "axios";
import ProductCard from '../component/ProducrCard';
import { translateCategoryToArabic } from '../src/utils/categoryTranslator';

// Skeleton Loader Component for a premium feel
const ProductSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-md border border-gray-100 dark:border-gray-700 animate-pulse flex flex-col justify-between h-[480px]">
    <div>
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-5"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="flex justify-between items-center mt-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
    </div>
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for search and filters
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [exactPrice, setExactPrice] = useState('');
  
  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // English Categories
  const categories = [
    "Electronics", 
    "Cameras", 
    "Headphones", 
    "Accessories", 
    "Laptops",
    "Fashion & Shoes",
    "Beauty & Health",
    "Sports",
    "Books",
    "Home & Garden",
    "Toys & Games",
    "Food",
    "Travel"
  ];

  const getAllProducts = async (page = 1) => {
    try {
      setLoading(true);
      let link = `/api/v1/products?page=${page}&`;

      if (keyword) link += `keyword=${encodeURIComponent(keyword)}&`;
      if (category) {
        const dbCategory = translateCategoryToArabic(category);
        link += `category=${encodeURIComponent(dbCategory)}&`;
      }
      if (exactPrice) link += `price=${exactPrice}&`;

      const response = await axios.get(link);
      setProducts(response.data.products || []);
      
      const filteredCount = response.data.filteredProductsCount || 0;
      const perPage = response.data.productsPerPage || 10;
      setTotalPages(Math.ceil(filteredCount / perPage) || 1);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts(currentPage);
  }, [currentPage]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    getAllProducts(1);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCategory('');
    setExactPrice('');
    setCurrentPage(1);
    
    // Fetch reset products immediately
    setLoading(true);
    axios.get("/api/v1/products?page=1")
      .then(res => {
        setProducts(res.data.products || []);
        const filteredCount = res.data.filteredProductsCount || 0;
        const perPage = res.data.productsPerPage || 10;
        setTotalPages(Math.ceil(filteredCount / perPage) || 1);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mx-auto px-4 mt-8 max-w-7xl">
      {/* 1. Hero Section (Upgraded from Carousel) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 md:p-14 mb-12 shadow-2xl border border-indigo-950/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="space-y-6 lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              ✨ Discover Premium Quality
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              Your Ultimate Tech <br/>& Gear Haven
            </h1>
            <p className="text-md md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
              Explore the handpicked collection of top-rated accessories, cameras, and latest electronic gadgets. Elevate your everyday life.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#shop-now" className="btn btn-primary bg-indigo-600 hover:bg-indigo-500 border-none px-8 rounded-2xl shadow-lg shadow-indigo-500/30 text-white font-semibold transition-all hover:scale-105 active:scale-95">
                Explore Store
              </a>
              <button onClick={() => setCategory('Electronics')} className="btn btn-ghost border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-6 rounded-2xl transition-all">
                Shop Electronics
              </button>
            </div>
          </div>
          
          <div className="relative hidden lg:block lg:col-span-5">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
              alt="Premium Headphones Featured"
              className="relative rounded-3xl w-full h-[350px] object-cover shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 border border-slate-800"
            />
          </div>
        </div>
      </div>

      <div id="shop-now" className="flex flex-col lg:flex-row gap-8">
        {/* 2. Glassmorphism Sidebar Filters (Left Side) */}
        <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-900 p-6 rounded-3xl h-fit border border-gray-100 dark:border-gray-800 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </h2>
            {(keyword || category || exactPrice) && (
              <button 
                onClick={handleClearFilters}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold cursor-pointer hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="form-control mb-6">
            <label className="label text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Search Product</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type & press Enter..."
                className="input input-bordered w-full pr-10 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Exact Price */}
          <div className="form-control mb-6">
            <label className="label text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Exact Price ($)</label>
            <input
              type="number"
              placeholder="e.g. 200"
              className="input input-bordered w-full focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50"
              value={exactPrice}
              onChange={(e) => setExactPrice(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
            />
          </div>

          {/* Categories Select */}
          <div className="form-control mb-6">
            <label className="label text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Category</label>
            <select
              className="select select-bordered w-full focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 mt-4">
            <button 
              onClick={handleApplyFilters} 
              className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-500 border-none rounded-2xl text-white font-bold transition-all shadow-md shadow-indigo-500/10"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="btn btn-outline w-full border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl transition-all"
            >
              Clear
            </button>
          </div>
        </aside>

        {/* 3. Products Grid Section (Right Side) */}
        <main className="w-full lg:w-3/4 flex flex-col justify-between min-h-[600px]">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Our Catalog</h2>
                <p className="text-gray-400 text-sm mt-1">Explore our latest trends and premium picks.</p>
              </div>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                {products.length} products found
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Premium Skeleton placeholders
                Array.from({ length: 6 }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-24 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No products found</h3>
                  <p className="text-gray-400 mt-2 max-w-sm mx-auto">We couldn't find any products matching your search filters. Try resetting the criteria.</p>
                  <button onClick={handleClearFilters} className="btn btn-outline btn-sm mt-6 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-xl">
                    Reset Filter Parameters
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-14 mb-8">
              <div className="join bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-1 rounded-2xl">
                <button 
                  className="join-item btn btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  ← Previous
                </button>
                <span className="join-item px-6 py-3 font-semibold text-sm text-gray-500 select-none">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="join-item btn btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;