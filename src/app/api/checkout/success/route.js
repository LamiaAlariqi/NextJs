import connection from "@/app/db/conn";
import Order from "@/app/models/orderModel";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const { sessionId, userEmail, items } = await req.json();

    await connection();

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    let orderItems = items || [];
    let customerEmail = userEmail || "guest@aura.com";
    let totalAmount = 0;

    if (stripeSecretKey && sessionId) {
      try {
        const stripe = new Stripe(stripeSecretKey);
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session) {
          customerEmail = session.customer_email || session.metadata?.userEmail || customerEmail;
          
          if (session.amount_total) {
            totalAmount = session.amount_total / 100;
          }

          if (session.metadata?.cartData) {
            try {
              const parsed = JSON.parse(session.metadata.cartData);
              if (Array.isArray(parsed) && parsed.length > 0) {
                orderItems = parsed;
              }
            } catch (e) {
              console.error("Error parsing cartData metadata", e);
            }
          }
        }
      } catch (err) {
        console.error("Stripe session retrieval error (fallback to local data):", err);
      }
    }

    if (totalAmount === 0 && orderItems.length > 0) {
      totalAmount = orderItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      );
    }

    // Check if order already created for this session
    let existingOrder = null;
    if (sessionId) {
      existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    }

    if (existingOrder) {
      return Response.json({
        success: true,
        order: existingOrder,
      });
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // Save order in MongoDB
    const newOrder = await Order.create({
      orderId,
      userEmail: customerEmail,
      items: orderItems,
      totalAmount,
      paymentStatus: "Paid",
      status: "Processing",
      stripeSessionId: sessionId,
    });

    return Response.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error("Order completion error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
