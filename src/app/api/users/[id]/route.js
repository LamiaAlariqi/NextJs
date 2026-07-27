import connection from "@/app/db/conn"; 
import User from "@/app/models/userModel";  
import { sendToken } from "@/app/utils/jwtToken";

export const GET = async (req, { params }) => {
    try {
        await connection();
         const { id } = await params;
        const user = await User.findById(id);
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }
        return Response.json({
            success: true,
            message: "User found successfully",
            user
        }, {
            status: 200
        });
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message || error
        }, {
            status: 500
        });
    }
}

export const PUT = async (req, { params }) => {
    try {
        await connection();
        const { id } = await params;
        const body = await req.json();
        const user = await User.findByIdAndUpdate(id, body, {
            runValidators: true,
            new: true
        });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }
        return Response.json({
            success: true,
            message: "User updated successfully",
            user
        }, {
            status: 200
        });
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message || error
        }, {
            status: 500
        });
    }
}

export const DELETE = async (req, { params }) => {   
    try {
        await connection();
        const {id}=await params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }
        return Response.json({
            success: true,
            message: "User deleted successfully",
            user
        }, {
            status: 200
        });     
    }catch (error) {
        return Response.json({
            success: false,
            message: error.message || error
        }, {
            status: 500
        });
    }
}       