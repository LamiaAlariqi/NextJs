import connection from "@/app/db/conn";
import Order from "@/app/models/orderModel";

export const GET = async (req) => {
  try {
    await connection();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const query = email ? { userEmail: email } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });

    const formattedOrders = orders.map((o) => ({
      id: o.orderId || o._id.toString(),
      _id: o._id.toString(),
      orderId: o.orderId || o._id.toString(),
      userEmail: o.userEmail,
      date: new Date(o.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: o.status || "Processing",
      step: o.status === "Delivered" ? 3 : o.status === "Shipped" ? 2 : 1,
      paymentStatus: o.paymentStatus || "Paid",
      totalAmount: o.totalAmount,
      total: o.totalAmount,
      items: (o.items || []).map((i) => ({
        id: i._id || i.id,
        title: i.title || i.name || "Item",
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    }));

    return Response.json(
      {
        success: true,
        message: "Orders fetched successfully",
        orders: formattedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch orders error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || error,
        orders: [],
      },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    await connection();
    const body = await req.json();

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = await Order.create({
      orderId,
      userEmail: body.userEmail || "guest@aura.com",
      items: body.items || [],
      totalAmount: body.totalAmount || 0,
      paymentStatus: body.paymentStatus || "Paid",
      status: body.status || "Processing",
    });

    return Response.json(
      {
        success: true,
        message: "Order placed successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || error,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    await connection();
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return Response.json(
        { success: false, message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { $or: [{ orderId: orderId }, { _id: orderId }] },
      { status: status },
      { new: true }
    );

    return Response.json(
      {
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update order error:", error);
    return Response.json(
      { success: false, message: error.message || error },
      { status: 500 }
    );
  }
};
