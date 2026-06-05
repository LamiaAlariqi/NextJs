import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                // لا نحتاج للبحث عن الكوكي في الجافاسكريبت لأنها HttpOnly، 
                // المتصفح سيرسلها تلقائياً بفضل `withCredentials: true`
                const response = await axios.get('/api/v1/user/role', {
                    withCredentials: true 
                });
                
                if (response.data.role === 'admin') {
                    setIsAuthorized(true); // السماح بعرض المحتوى
                } else {
                    toast.error("Access denied. Admins only.");
                    navigate('/login');
                }
            } catch (error) {
                // إذا لم يكن هناك توكن أو غير صالح، سيرد الباك إند بخطأ (مثل 401)
                console.error("Error checking role:", error);
                toast.error("Please login to access admin dashboard");
                navigate('/login');
            }
        };

        checkAdminStatus();
    }, [navigate]);

    // عرض شاشة تحميل بسيطة حتى يتم التحقق من الصلاحيات
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', link: '/admin/dashboard' },
        { id: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', link: '/admin/orders' },
        { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', link: '/admin/products' },
        { id: 'create-product', label: 'Create Product', icon: 'M12 4v16m8-8H4', link: '/admin/product/new' },
        { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', link: '/admin/users' },
    ];

    return (
        <div className="min-h-screen bg-base-200 flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={`bg-base-100 w-72 flex-shrink-0 border-r border-base-300 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'} fixed md:relative z-20 h-full shadow-xl`}>
                <div className="h-full flex flex-col">
                    <div className="h-20 flex items-center px-6 border-b border-base-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                S
                            </div>
                            {isSidebarOpen && <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">StoreAdmin</span>}
                        </div>
                    </div>

                    <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.link}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-base-content/70 hover:bg-base-200 hover:text-base-content`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                {isSidebarOpen && <span>{item.label}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-base-300">
                        <Link to="/" className="w-full flex items-center gap-4 px-4 py-3 text-error rounded-xl hover:bg-error/10 transition-colors group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {isSidebarOpen && <span>Logout</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-base-100/80 backdrop-blur-md border-b border-base-300 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-square btn-ghost text-base-content/70">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-300 p-0.5 hover:border-primary transition-colors">
                                <div className="w-9 rounded-full">
                                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="Admin Avatar" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
