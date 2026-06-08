// import Products from "../models/ProductModel.js";

// export const createProduct = async (req, res) => {
//     try {
//         const product = await Products.create(req.body);

//         res.status(201).json({
//             success: true,
//             product
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

import Product from "../models/ProductModel.js";
import ApiFeatures from "../util/ApiFeatures.js";
import cloudinary from "../util/cloudinary.js";

// create product 
export const createProducts = async (req, res) => {
    try {
        const { title, description, price, category, stock, images } = req.body;
        
        let imagesLinks = [];

        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        }
        
        const product = await Product.create({
            title,
            description,
            price,
            category,
            stock,
            images: imagesLinks
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not created"
            });
        }

        return res.status(200).json({
            success: true,
            message: "product created successfully",
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        });
    }
};

// get all products
export const getAllProducts = async (req, res) => {
 
    try {
    const productsPerPage = 10;
    
    // للحصول على العدد الإجمالي للمنتجات بعد تطبيق الفلاتر (بدون تقسيم الصفحات)
    const countFeature = new ApiFeatures(Product.find(), req.query).search().filter();
    const filteredProducts = await countFeature.query;
    const filteredProductsCount = filteredProducts.length;

    // جلب المنتجات للصفحة الحالية فقط
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination();
    const products = await apiFeature.query;
    
        return res.status(200).json({
            success: true,
            products,
            count: products.length,
            filteredProductsCount,
            productsPerPage
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        });
    }
};

// get single product
export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        });
    }
};

// update product
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Handle images update
        if (req.body.images) {
            const newImagesList = req.body.images;
            const oldImages = product.images;

            // Delete old images not in the new list from Cloudinary
            for (let i = 0; i < oldImages.length; i++) {
                const oldImg = oldImages[i];
                const isStillPresent = newImagesList.some(img => typeof img === 'object' && img.public_id === oldImg.public_id);
                if (!isStillPresent) {
                    await cloudinary.uploader.destroy(oldImg.public_id);
                }
            }

            const imagesLinks = [];
            for (let i = 0; i < newImagesList.length; i++) {
                const img = newImagesList[i];
                if (typeof img === 'string') {
                    // new Base64 image
                    const result = await cloudinary.uploader.upload(img, {
                        folder: "products",
                    });
                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                    });
                } else if (img && img.public_id && img.url) {
                    // existing image
                    imagesLinks.push(img);
                }
            }
            req.body.images = imagesLinks;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        });
    }
};

// delete product
export const deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete images from Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            if (product.images[i].public_id) {
                await cloudinary.uploader.destroy(product.images[i].public_id);
            }
        }

        product = await Product.findByIdAndDelete(req.params.id);
        
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error",
            error
        });
    }
};
// export const deleteProduct = async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         await product.deleteOne();

//         return res.status(200).json({
//             success: true,
//             message: "Product deleted successfully"
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             error
//         });
//     }
// };

//update product 
export const updateProductController = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Handle images update
        if (req.body.images) {
            const newImagesList = req.body.images;
            const oldImages = product.images;

            // Delete old images not in the new list from Cloudinary
            for (let i = 0; i < oldImages.length; i++) {
                const oldImg = oldImages[i];
                const isStillPresent = newImagesList.some(img => typeof img === 'object' && img.public_id === oldImg.public_id);
                if (!isStillPresent) {
                    await cloudinary.uploader.destroy(oldImg.public_id);
                }
            }

            const imagesLinks = [];
            for (let i = 0; i < newImagesList.length; i++) {
                const img = newImagesList[i];
                if (typeof img === 'string') {
                    // new Base64 image
                    const result = await cloudinary.uploader.upload(img, {
                        folder: "products",
                    });
                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                    });
                } else if (img && img.public_id && img.url) {
                    // existing image
                    imagesLinks.push(img);
                }
            }
            req.body.images = imagesLinks;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            message: "product updated successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating product",
            error
        });
    }
};

// 200 => success
// 300 => warning
// 400 => human errors
// 500 => server errors