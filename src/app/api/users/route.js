import connection from "@/app/db/conn";
import User from "@/app/models/userModel";
import { isAuthenticatedUser, authorizeRoles } from "@/app/utils/auth";

export const GET=async (req)=>{
    try{
        const user = await isAuthenticatedUser();
        if (user instanceof Response) {
            return user;
        }

        const isAuthorized = authorizeRoles("admin")(user);
        if (isAuthorized instanceof Response) {
            return isAuthorized;
        }

        await connection();
        const users=await User.find({});
        if(!users){
            return Response.json({
                success: false,
                message: "No users found"
            },{
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Users fetched successfully",
            users
        },{
            status: 200
        })  
    }catch (error) {
        return Response.json({
            success: false,
            message: error.message || error
        }, {
            status: 500
        });

    }
}