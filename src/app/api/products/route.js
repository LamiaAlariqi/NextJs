import connection from "@/app/db/conn";
import Product from "@/app/models/productModel";
import { INITIAL_PRODUCTS } from "./seed/route";

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
      ...body,
      isApproved: true,
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

    // Auto-seed database if zero products exist
    let count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(INITIAL_PRODUCTS);
    }

    let filter = {};

    // Strict case-insensitive category filtering to ensure distinct separation per category
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

    const sanitizedProducts = products.map((p) => {
      const pObj = p.toObject();
      const titleLower = (pObj.title || "").toLowerCase();
      let img = pObj.image || "";

      if (titleLower.includes("iphone7") || titleLower.includes("iphone 7")) {
        img = "/iphone7.png";
      } else if (!img || (!img.startsWith("http") && !img.startsWith("/"))) {
        if (titleLower.includes("bag")) {
          img = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80";
        } else {
          img = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
        }
      }

      return {
        ...pObj,
        image: img,
      };
    });

    return Response.json({
      success: true,
      message: "Products fetched successfully",
      products: sanitizedProducts
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