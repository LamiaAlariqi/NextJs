import Stripe from "stripe";

export async function POST(req) {
  try {
    const { items, userEmail } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: "No items provided in cart" }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

    if (!stripeSecretKey || stripeSecretKey.includes("your_stripe_secret_key_here")) {
      // Fallback mock mode if Stripe key is not configured yet in .env
      const mockSessionId = "cs_test_" + Math.random().toString(36).substr(2, 9);
      const origin = req.headers.get("origin") || "http://localhost:3000";
      return Response.json({
        url: `${origin}/checkout/success?session_id=${mockSessionId}&mock=true`,
        isMock: true,
      });
    }

    const stripe = new Stripe(stripeSecretKey);
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const lineItems = items.map((item) => {
      let validImages = [];
      let imageUrl = item.image;
      if (imageUrl && imageUrl.startsWith("/")) {
        imageUrl = `${origin}${imageUrl}`;
      }

      if (
        imageUrl &&
        typeof imageUrl === "string" &&
        (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) &&
        imageUrl.length <= 2000
      ) {
        validImages.push(imageUrl);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || item.title || "Product",
            images: validImages,
          },
          unit_amount: Math.round((item.price || 0) * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    // Clean cart items for metadata to ensure it stays within Stripe's limits
    const sanitizedCart = items.map((i) => ({
      id: i.id || i._id,
      title: i.name || i.title,
      price: i.price,
      quantity: i.quantity,
      image: typeof i.image === "string" && i.image.length <= 300 ? i.image : "",
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: userEmail || undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/home`,
      metadata: {
        userEmail: userEmail || "guest",
        cartData: JSON.stringify(sanitizedCart).slice(0, 480),
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return Response.json(
      { error: error.message || "Failed to create Stripe checkout session" },
      { status: 500 }
    );
  }
}
