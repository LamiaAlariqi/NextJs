import connection from "@/app/db/conn";
import User from "@/app/models/userModel";
import { sendToken } from "@/app/utils/jwtToken";

export const POST = async (req) => {
    try {
        await connection();
        const { email, password } = await req.json();
        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return Response.json({
                success: false,
                message: "Invalid password"
            }, {
                status: 401
            });
        }

        return await sendToken(user, 200);
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message || error
        }, {
            status: 500
        });
    }
}