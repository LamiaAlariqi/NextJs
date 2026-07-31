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

    if (category && category.toLowerCase() !== "all") {
      const catLower = category.toLowerCase();
      let pattern = category;

      if (catLower.includes("electronics")) {
        pattern = "Electronics|Audio|Smartphones|Wearables|Ambient Home|Gadgets|إلكترونيات";
      } else if (catLower.includes("furniture")) {
        pattern = "Furniture|Ambient Home|Home|Decor|أثاث";
      } else if (catLower.includes("cars")) {
        pattern = "Cars|Automotive|Vehicles|سيارات";
      } else if (catLower.includes("makeup") || catLower.includes("beauty")) {
        pattern = "Makeup|Beauty|Skincare|Perfume|ميك أب";
      } else if (catLower.includes("clothing") || catLower.includes("fashion")) {
        pattern = "Clothing|Fashion|Shoes|Wearables|Accessories|ملابس";
      }

      filter.category = { $regex: new RegExp(pattern, "i") };
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