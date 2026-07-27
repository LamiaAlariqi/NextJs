import connection from "@/app/db/conn";
import User from "@/app/models/userModel";
import { sendToken } from "@/app/utils/jwtToken";

export const POST = async (req) => {
    try {
        await connection();
        const body = await req.json();
        const email = body.email ? body.email.toLowerCase().trim() : "";

        const exisitingUser= await User.findOne({email});
        if(exisitingUser){
            return Response.json({
                success: false,
                message: "User already exists"
            },{
                status: 400
            })
        }
       
          const user=await User.create({
            ...body,
            email
          });
          if(!user){
            return Response.json({
                success: false,
                message: "Failed to create user"
            },{
                status: 400
            })
          }
          return await sendToken(user, 201);
    }
    catch (error) {
        return Response.json({              
         success: false,
          message: error.message || error
        },{
            status: 500
        })
    }
};

