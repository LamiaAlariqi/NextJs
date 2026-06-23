import connection from "@/app/db/conn";
import Product from "@/app/models/productModel";

//create productscontroller
export const POST = async (req) => {
    try {
        await connection();
        const body = await req.json();
        const product = await Product.create(body);
        if (!product) {
            return Response.json({
                success: false,
                message: "Failed to create product"
            }, {
                status: 400
            })
        }
        await product.save();
        return Response.json({
            success: true,
            message: "Product created successfully",
            product
        }, {
            status: 200
        })
    }
    catch (error) {
        return Response.json({
            success: false,
            message: error.message || error
        }, {
            status: 500
        })

    }
}
export const GET = async (req) => {
    try{
        await connection();
        const products = await Product.find();
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