import connection from "@/app/db/conn";
import Product from "@/app/models/productModel";
import { isAuthenticatedUser, authorizeRoles } from "@/app/utils/auth";

//create productscontroller
export const POST = async (req) => {
    try {
        await connection();
        const body = await req.json();

        // Ensure title, description, price, image, category are present
        if (!body.title || !body.description || !body.price || !body.image || !body.category) {
            return Response.json({
                success: false,
                message: "Please fill all required product fields"
            }, { status: 400 });
        }

        // Always set new user-submitted products to pending approval (isApproved: false)
        const product = await Product.create({
            ...body,
            isApproved: false,
        });

        if (!product) {
            return Response.json({
                success: false,
                message: "Failed to create product"
            }, { status: 400 });
        }
        await product.save();

        return Response.json({
            success: true,
            message: "Product submitted successfully. It is now pending admin approval.",
            product
        }, { status: 201 });
    }
    catch (error) {
        return Response.json({
            success: false,
            message: error.message || error
        }, { status: 500 });
    }
}
export const GET = async (req) => {
    try{
        await connection();
        const { searchParams } = new URL(req.url);
        const approvedOnly = searchParams.get("approvedOnly") === "true";

        let filter = {};
        if (approvedOnly) {
            filter = { isApproved: true };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
         if(!products){
            return Response.json({
                success: false,
                message: "No products found"
            },{
                status: 404
            })
         }
         return Response.json({
            success: true,
            message: "Products fetched successfully",
            products
         },{
            status: 200
         })
    } 
    catch(error){
        return Response.json({
            success: false,
            message: error.message || error
        },{
            status: 500
        })
    }
} 