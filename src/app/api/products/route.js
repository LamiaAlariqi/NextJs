import connection from "@/app/db/conn";
import Product from "@/app/models/productModel";

// Create products controller
export const POST = async (req) => {
  try {
    await connection();
    const body = await req.json();

    if (!body.title || !body.description || !body.price || !body.image || !body.category) {
      return Response.json({
        success: false,
        message: "Please fill all required product fields"
      }, { status: 400 });
    }

    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: body.price,
      image: body.image,
      category: body.category,
      stocks: body.stocks || 1,
    });

    return Response.json({
      success: true,
      message: "Product created successfully",
      product
    }, { status: 201 });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message || error
    }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connection();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const searchQuery = searchParams.get("search") || searchParams.get("q");

    let filter = {};

    // Strict case-insensitive category filtering
    if (category && category.trim().toLowerCase() !== "all") {
      const escapedCategory = category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.category = { $regex: new RegExp(`^${escapedCategory}$`, "i") };
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const searchRegex = new RegExp(searchQuery.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      message: "Products fetched successfully",
      products
    }, { status: 200 });
  } catch (error) {
    console.error("Fetch products error:", error);
    return Response.json({
      success: false,
      message: error.message || error,
      products: []
    }, { status: 500 });
  }
};