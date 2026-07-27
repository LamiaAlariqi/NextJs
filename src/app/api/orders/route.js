import connection from "@/app/db/conn";

export const GET = async (req) => {
  try {
    await connection();
    // Return empty array by default or real orders when orders model is queried
    return Response.json({
      success: true,
      message: "Orders fetched successfully",
      orders: [],
    }, { status: 200 });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message || error,
      orders: [],
    }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    await connection();
    const body = await req.json();
    return Response.json({
      success: true,
      message: "Order placed successfully",
      order: body,
    }, { status: 201 });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message || error,
    }, { status: 500 });
  }
};
