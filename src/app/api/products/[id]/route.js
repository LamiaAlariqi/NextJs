// 📌 لماذا أنشأنا مجلد [id] بدلاً من وضع كل الأكواد في ملف واحد؟

// تحديد المنتج المستهدف: العمليات (جلب تفاصيل، تعديل، حذف) تحتاج إلى معرّف المنتج (ID). مجلد [id] يسمح لـ Next.js بقراءة هذا الـ ID تلقائياً من الرابط (مثال: /api/products/123).
// منع تكرار الدوال: لا يمكنك تعريف دالتي GET في نفس الملف (واحدة لجلب الكل، وواحدة لجلب منتج واحد). لذا نقوم بفصلهما في ملفين مستقلين.
// تنظيم الروابط (Clean URLs):
// الرابط العام /api/products ⬅️ لجلب كل المنتجات أو إضافة منتج جديد.
// الرابط الخاص /api/products/[id] ⬅️ لـ تعديل أو حذف أو عرض منتج واحد محدد.

import connection from "@/app/db/conn";
import Product from "@/app/models/productModel";
  export async function GET(req,{params}){
    try{
        await connection();
        const {id} = await params;
        const product = await Product.findById(id);
        if(!product){
            return Response.json({
                success: false,
                message: "Product not found"
            },{
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Product fetched successfully",
            product
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
  export async function PUT(req,{params}){
    try{
        await connection();
        const {id} = await params;
        const body = await req.json();
        const product = await Product.findByIdAndUpdate(id,body,{
            runValidators:true,
            new:true
        });
        if(!product){
            return Response.json({
                success: false,
                message: "Product not found"
            },{
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Product updated successfully",
            product
        },{
            status: 200
        })
    }catch(error){
        return Response.json({
            success: false,
            message: error.message || error
        },{
            status: 500
        })
    }
}
export async function DELETE(req,{params}){
 try{
    await connection();
    const {id} = await params;
    const product = await Product.findByIdAndDelete(id);
    if(!product){
        return Response.json({
            success: false,
            message: "Product not found"
        },{
            status: 404
        })
    }
    return Response.json({
        success: true,
        message: "Product deleted successfully",
        product
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