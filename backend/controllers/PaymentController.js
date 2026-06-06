import Stripe from 'stripe';

// إنشاء جلسة دفع Stripe Checkout
export const createCheckoutSession = async (req, res) => {
    // نهيئ Stripe هنا بعد تحميل dotenv
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const { orderItems, shippingInfo, taxPrice, shippingPrice, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'لا توجد منتجات في الطلب' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        // تحويل المنتجات لصيغة Stripe
        const lineItems = orderItems.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), // Stripe يستخدم السنتات
            },
            quantity: item.quantity,
        }));

        // إضافة الضريبة والشحن كبنود منفصلة إذا كانت موجودة
        if (taxPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'ضريبة القيمة المضافة (15%)' },
                    unit_amount: Math.round(taxPrice * 100),
                },
                quantity: 1,
            });
        }

        if (shippingPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'رسوم الشحن والتوصيل' },
                    unit_amount: Math.round(shippingPrice * 100),
                },
                quantity: 1,
            });
        }

        // حفظ معلومات الشحن في metadata لاستخدامها عند نجاح الدفع
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/cart`,
            metadata: {
                userId: req.user._id.toString(),
                shippingAddress: shippingInfo.address,
                shippingCity: shippingInfo.city,
                shippingCountry: shippingInfo.country,
                shippingZip: shippingInfo.zipCode,
                totalPrice: totalPrice.toString(),
            },
        });

        res.status(200).json({ success: true, url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// التحقق من حالة الدفع بعد العودة من Stripe
export const verifyPayment = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ success: false, message: 'معرف الجلسة غير موجود' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            res.status(200).json({
                success: true,
                paid: true,
                sessionId: session.id,
                amountTotal: session.amount_total / 100,
                customerEmail: session.customer_details?.email,
                metadata: session.metadata,
            });
        } else {
            res.status(200).json({ success: true, paid: false, status: session.payment_status });
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
