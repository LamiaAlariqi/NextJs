import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// صور بطاقات الدفع
const paymentIcons = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
};

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'stripe'

  // Shipping Form State
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    country: 'اليمن',
    zipCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 150 || subtotal === 0 ? 0 : 10;
  const taxPrice = Math.round(subtotal * 0.15 * 100) / 100; // 15% VAT
  const totalPrice = Math.round((subtotal + shippingPrice + taxPrice) * 100) / 100;

  // Checkout Handler (Cash on Delivery)
  const handleCheckout = async (e) => {
    e.preventDefault();

    // 1. Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast.error('الرجاء تسجيل الدخول أولاً لإكمال الطلب');
      navigate('/login');
      return;
    }

    // 2. Validate inputs
    if (!shippingInfo.address.trim()) {
      toast.error('الرجاء كتابة العنوان بالتفصيل');
      return;
    }
    if (!shippingInfo.city.trim()) {
      toast.error('الرجاء تحديد المدينة');
      return;
    }
    if (!shippingInfo.zipCode.trim()) {
      toast.error('الرجاء إدخال الرمز البريدي');
      return;
    }

    if (paymentMethod === 'stripe') {
      // دفع عن طريق Stripe
      await handleStripeCheckout();
      return;
    }

    setLoading(true);

    // 3. Prepare order payload (Cash on Delivery)
    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product,
      })),
      shippingInfo: {
        address: shippingInfo.address,
        city: shippingInfo.city,
        country: shippingInfo.country,
        zipCode: shippingInfo.zipCode,
      },
      paymentInfo: {
        id: `COD_${Date.now()}`,
        status: 'Succeeded',
      },
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    try {
      const response = await axios.post('/api/v1/newOrder', orderData);
      
      if (response.data.success) {
        toast.success('تم إرسال وطلب المنتجات بنجاح!');
        setOrderSuccess(response.data.order);
        clearCart();
      } else {
        toast.error(response.data.message || 'حدث خطأ أثناء إتمام الطلب');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'فشل إرسال الطلب، الرجاء التحقق من المدخلات والمخزون');
    } finally {
      setLoading(false);
    }
  };

  // Stripe Checkout Handler
  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      // حفظ الطلب مؤقتاً لاستخدامه بعد نجاح الدفع
      const pendingOrder = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item.product,
        })),
        shippingInfo,
        taxPrice,
        shippingPrice,
        totalPrice,
      };
      localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));

      // جلب التوكن من localStorage للمصادقة
      const token = localStorage.getItem('token');

      // إنشاء جلسة Stripe مع إرسال التوكن
      const { data } = await axios.post('/api/v1/payment/checkout', pendingOrder, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (data.success && data.url) {
        // تحويل المستخدم لصفحة Stripe للدفع
        window.location.href = data.url;
      } else {
        toast.error('حدث خطأ في بوابة الدفع، حاول مرة أخرى');
      }
    } catch (error) {
      console.error('Stripe Error:', error);
      const status = error.response?.status;
      const msg = error.response?.data?.message;

      if (status === 401 || msg === 'Plz Login first') {
        toast.error('يجب تسجيل الدخول أولاً لإتمام الدفع');
        // توجيه للصفحة الرئيسية أو صفحة الدخول
        setTimeout(() => window.location.href = '/login', 1500);
      } else {
        toast.error(msg || 'فشل الاتصال ببوابة الدفع');
      }
    } finally {
      setStripeLoading(false);
    }
  };

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in" dir="rtl">
        <div className="max-w-2xl mx-auto bg-base-100 p-8 md:p-12 rounded-3xl shadow-2xl border border-success/20">
          <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-base-content mb-2">تهانينا! تم تسجيل طلبك بنجاح</h1>
          <p className="text-gray-500 mb-8">رقم الطلب الخاص بك: <span className="font-mono text-primary font-bold">{orderSuccess._id}</span></p>

          <div className="bg-base-200 p-6 rounded-2xl text-right mb-8 space-y-3">
            <h3 className="font-bold text-lg border-b pb-2 mb-2">تفاصيل التوصيل:</h3>
            <p className="text-sm"><span className="text-gray-500">العنوان:</span> {orderSuccess.shippingInfo.address}</p>
            <p className="text-sm"><span className="text-gray-500">المدينة:</span> {orderSuccess.shippingInfo.city}</p>
            <p className="text-sm"><span className="text-gray-500">البلد:</span> {orderSuccess.shippingInfo.country}</p>
            <p className="text-sm"><span className="text-gray-500">إجمالي المبلغ المدفوع (عند الاستلام):</span> <span className="font-bold text-primary text-base">${orderSuccess.totalPrice}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="btn btn-primary flex-1 shadow-lg shadow-primary/20">
              مواصلة التسوق
            </Link>
            <Link to="/profile" className="btn btn-outline flex-1">
              عرض حسابي الشخصي
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/50 py-10" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* Title */}
        <div className="mb-8 text-right">
          <h1 className="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-3">
            <span>سلة التسوق</span>
            <span className="badge badge-lg badge-primary">{cartItems.length} منتجات</span>
          </h1>
          <p className="text-gray-500 mt-2">قم بمراجعة المنتجات التي اخترتها وتأكيد عملية الشراء</p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-xl mx-auto bg-base-100 p-12 rounded-3xl shadow-xl text-center border border-base-200">
            <div className="text-8xl mb-6 select-none animate-pulse">🛒</div>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">سلتك فارغة تماماً!</h2>
            <p className="text-gray-400 mb-8">لم تقم بإضافة أي منتجات للسلة بعد. تصفح المتجر وأضف بعض المنتجات الرائعة.</p>
            <Link to="/" className="btn btn-primary btn-wide shadow-lg shadow-primary/20">
              تسوق الآن
            </Link>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Products List (Left / 2 Columns on desktop) */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.product} 
                  className="card card-side bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-base-200 flex items-center gap-4"
                >
                  {/* Image */}
                  <figure className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 shrink-0 border">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain p-2"
                    />
                  </figure>

                  {/* Body */}
                  <div className="flex-1 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-1 text-right">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {item.category || 'عام'}
                      </span>
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg line-clamp-1">
                        <Link to={`/product-detail/${item.product}`} className="hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-xl font-black text-gray-700 dark:text-gray-300">
                        ${item.price}
                      </p>
                    </div>

                    {/* Controls & Actions */}
                    <div className="flex items-center gap-6 justify-between md:justify-end">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-base-100">
                        <button 
                          onClick={() => updateCartQuantity(item.product, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-base-200 active:bg-base-300 transition-colors font-bold text-md"
                        >
                          -
                        </button>
                        <span className="px-4 font-bold text-md select-none w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.product, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-base-200 active:bg-base-300 transition-colors font-bold text-md"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price & Delete Button */}
                      <div className="flex items-center gap-4">
                        <span className="font-black text-xl text-primary text-left min-w-[70px]">
                          ${Math.round(item.price * item.quantity * 100) / 100}
                        </span>
                        
                        <button 
                          onClick={() => removeFromCart(item.product)}
                          className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/15"
                          title="حذف من السلة"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <Link to="/" className="btn btn-outline btn-sm">
                  ← مواصلة التسوق
                </Link>
                <button 
                  onClick={clearCart}
                  className="btn btn-ghost text-error btn-sm hover:bg-error/10"
                >
                  إفراغ السلة بالكامل
                </button>
              </div>
            </div>

            {/* Sidebar Checkout Form (Right / 1 Column) */}
            <div className="space-y-6">
              
              {/* Receipt Summary Card */}
              <div className="card bg-base-100 shadow-md border border-base-200 p-6">
                <h2 className="text-xl font-bold border-b pb-4 mb-4 text-right">ملخص الطلب</h2>
                
                <div className="space-y-3 text-right">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">المجموع الفرعي:</span>
                    <span className="font-bold">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ضريبة القيمة المضافة (15%):</span>
                    <span className="font-bold">${taxPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">تكلفة التوصيل:</span>
                    <span className="font-bold">
                      {shippingPrice === 0 ? (
                        <span className="text-success">شحن مجاني</span>
                      ) : (
                        `$${shippingPrice}`
                      )}
                    </span>
                  </div>
                  
                  {shippingPrice > 0 && (
                    <div className="alert alert-info py-2 rounded-xl text-xs gap-1.5 mt-2">
                      <span>اشترِ بمبلغ أكبر من $150 للحصول على شحن مجاني!</span>
                    </div>
                  )}

                  <div className="divider"></div>
                  
                  <div className="flex justify-between text-lg font-black">
                    <span>الإجمالي الكلي:</span>
                    <span className="text-primary text-xl">${totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information & Checkout Form */}
              <div className="card bg-base-100 shadow-md border border-base-200 p-6">
                <h2 className="text-xl font-bold border-b pb-4 mb-4 text-right">معلومات الشحن والتوصيل</h2>
                
                <form onSubmit={handleCheckout} className="space-y-4 text-right">
                  
                  {/* Address */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">العنوان بالتفصيل</span>
                    </label>
                    <input 
                      type="text" 
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="اسم الشارع، رقم المنزل، الحي..." 
                      className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                      required
                    />
                  </div>

                  {/* City */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">المدينة</span>
                    </label>
                    <input 
                      type="text" 
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder="مثال: صنعاء، عدن، تعز..." 
                      className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                      required
                    />
                  </div>

                  {/* Row for Country & Zip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">الدولة</span>
                      </label>
                      <input 
                        type="text" 
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        className="input input-bordered w-full bg-base-200/50"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">الرمز البريدي</span>
                      </label>
                      <input 
                        type="text" 
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        placeholder="00000" 
                        className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-3 mt-2">
                    <p className="font-bold text-sm text-right">اختر طريقة الدفع:</p>
                    
                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-primary bg-primary/5'
                          : 'border-base-200 hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="radio radio-primary radio-sm"
                      />
                      <span className="text-2xl">💵</span>
                      <div className="text-right flex-1">
                        <p className="font-semibold text-sm">الدفع عند الاستلام</p>
                        <p className="text-xs text-base-content/50">Cash on Delivery</p>
                      </div>
                    </label>

                    {/* Stripe */}
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10'
                          : 'border-base-200 hover:border-violet-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={() => setPaymentMethod('stripe')}
                        className="radio radio-sm"
                        style={{ accentColor: '#7c3aed' }}
                      />
                      <span className="text-2xl">💳</span>
                      <div className="text-right flex-1">
                        <p className="font-semibold text-sm">الدفع ببطاقة ائتمانية</p>
                        <p className="text-xs text-base-content/50">Visa / Mastercard عبر Stripe</p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-black flex items-center justify-center">VISA</div>
                        <div className="w-8 h-5 rounded overflow-hidden flex">
                          <div className="w-4 h-5 bg-red-500 opacity-80"></div>
                          <div className="w-4 h-5 bg-yellow-400 opacity-80"></div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Submit Order Button */}
                  <button 
                    type="submit" 
                    disabled={loading || stripeLoading}
                    className={`btn w-full text-white font-bold text-lg mt-4 h-12 shadow-lg ${
                      paymentMethod === 'stripe'
                        ? 'bg-violet-600 hover:bg-violet-700 border-violet-600 shadow-violet-300'
                        : 'btn-primary shadow-primary/20'
                    }`}
                  >
                    {(loading || stripeLoading) ? (
                      <span className="loading loading-spinner"></span>
                    ) : paymentMethod === 'stripe' ? (
                      <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        ادفع الآن عبر Stripe
                      </span>
                    ) : (
                      'تأكيد الطلب وشراء'
                    )}
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
