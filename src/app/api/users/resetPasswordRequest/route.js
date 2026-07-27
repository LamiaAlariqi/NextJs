import connection from "@/app/db/conn";
import User from "@/app/models/userModel";
import { sendMail } from "@/app/utils/sendMail";

//reset password request 

export const POST =async (req)=>{ 
    try{
        await connection();
        const {email} =await req.json();
        const user= await User.findOne({email});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 404
            })
        }
        const resetToken=user.resetPassword();
        await user.save({validateBeforeSave:false});
        const resetpasswordUrl=`http://localhost:3000/resetpassword/${resetToken}`;
        await sendMail({
            email:user.email,
            subject:"Reset Password",
            message:`Your password reset link is :- \n\n ${resetpasswordUrl} \n\n If you have not requested this email then, please ignore it`
        })
    return Response.json({
        success: true,
        message: "Password reset link has been sent to your email"
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