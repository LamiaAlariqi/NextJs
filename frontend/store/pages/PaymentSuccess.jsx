import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../src/context/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | failed
  const [paymentData, setPaymentData] = useState(null);
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyAndCreateOrder = async () => {
      if (!sessionId) {
        setStatus('failed');
        return;
      }

      try {
        // التحقق من نجاح الدفع
        const { data } = await axios.get(`/api/v1/payment/verify?session_id=${sessionId}`);
        
        if (data.success && data.paid) {
          setPaymentData(data);

          // إنشاء الطلب في قاعدة البيانات بعد نجاح الدفع
          const savedCart = localStorage.getItem('pendingOrder');
          if (savedCart) {
            const pendingOrder = JSON.parse(savedCart);
            await axios.post('/api/v1/newOrder', {
              ...pendingOrder,
              paymentInfo: {
                id: sessionId,
                status: 'Succeeded',
              },
            });
            localStorage.removeItem('pendingOrder');
          }

          clearCart();
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setStatus('failed');
      }
    };

    verifyAndCreateOrder();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200" dir="rtl">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-lg font-semibold text-base-content/70">جاري التحقق من عملية الدفع...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4" dir="rtl">
        <div className="max-w-lg w-full bg-base-100 rounded-3xl shadow-2xl p-10 text-center border border-error/20">
          <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-base-content mb-3">فشلت عملية الدفع</h1>
          <p className="text-base-content/60 mb-8">حدث خطأ أثناء معالجة دفعتك. لم يتم خصم أي مبلغ من حسابك.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/cart" className="btn btn-primary flex-1">العودة للسلة</Link>
            <Link to="/" className="btn btn-outline flex-1">الرئيسية</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-success/5 to-base-200 p-4" dir="rtl">
      <div className="max-w-2xl w-full bg-base-100 rounded-3xl shadow-2xl p-10 text-center border border-success/20">
        
        {/* Success Icon */}
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="absolute inset-0 bg-success/10 rounded-full animate-ping opacity-30"></div>
          <div className="relative w-28 h-28 bg-success/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-black text-base-content mb-2">تم الدفع بنجاح! 🎉</h1>
        <p className="text-base-content/60 text-lg mb-8">شكراً لك! تم استلام طلبك وجارٍ تجهيزه الآن.</p>

        {/* Payment Details */}
        {paymentData && (
          <div className="bg-success/5 border border-success/20 rounded-2xl p-6 text-right mb-8 space-y-3">
            <h2 className="text-lg font-bold text-base-content border-b border-success/20 pb-2 mb-3">تفاصيل الدفع</h2>
            <div className="flex justify-between text-sm">
              <span className="text-success font-semibold">✓ تم الدفع</span>
              <span className="text-base-content/60">الحالة</span>
            </div>
            {paymentData.amountTotal && (
              <div className="flex justify-between text-sm">
                <span className="font-bold text-primary text-base">${paymentData.amountTotal}</span>
                <span className="text-base-content/60">المبلغ المدفوع</span>
              </div>
            )}
            {paymentData.customerEmail && (
              <div className="flex justify-between text-sm">
                <span className="font-semibold truncate max-w-[200px]">{paymentData.customerEmail}</span>
                <span className="text-base-content/60">البريد الإلكتروني</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="font-mono text-xs text-base-content/50 truncate max-w-[180px]">{sessionId}</span>
              <span className="text-base-content/60">رقم العملية</span>
            </div>
          </div>
        )}

        {/* Stripe Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-base-content/40 mb-8">
          <svg viewBox="0 0 60 25" className="h-5 fill-current text-violet-500" xmlns="http://www.w3.org/2000/svg">
            <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.44.94V6.27h3.94l.12 1.07c.6-.77 1.7-1.36 3.23-1.36 2.83 0 5.56 2.48 5.56 7.29 0 5.07-2.7 7.03-5.49 7.03zM40 9.98c-.56 0-1.14.18-1.44.5l.02 7.27c.3.33.88.5 1.44.5 1.47 0 2.48-1.38 2.48-4.14 0-2.75-1.01-4.13-2.5-4.13zM28.24 5.07c1.44 0 2.3-.96 2.3-2.15C30.54.96 29.68 0 28.24 0c-1.44 0-2.31.96-2.31 2.92 0 1.19.87 2.15 2.31 2.15zm-2.22 15.12V6.27h4.44V20.2h-4.44zM23.39 20.2V4.91l-4.44.94V20.2h4.44zM8.89 11.06C8.89 9.3 10.5 8.6 13 8.6c1.97 0 4.15.42 6.06 1.48V6.06C17.12 5.23 15.12 4.9 13 4.9 8.27 4.9 5.1 7.28 5.1 11.23c0 6.14 8.8 5.17 8.8 8.01 0 2.04-1.9 2.7-4.16 2.7-2.08 0-4.36-.65-6.16-1.73v4.12C5.15 25.1 7.4 25.5 9.76 25.5c4.85 0 8.16-2.27 8.16-6.33 0-6.6-9.03-5.44-9.03-8.11z"/>
          </svg>
          <span>الدفع محمي ومشفر بواسطة Stripe</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="btn btn-primary flex-1 shadow-lg shadow-primary/20">
            مواصلة التسوق
          </Link>
          <Link to="/profile" className="btn btn-outline flex-1">
            عرض طلباتي
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
