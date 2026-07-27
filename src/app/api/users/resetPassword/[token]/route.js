import connection from "@/app/db/conn";
import User from "@/app/models/userModel";
import crypto from "crypto";

const resetPasswordHandler = async (req, { params }) => {
    try {
        await connection();
        const { token } = await params;
        const { password, confirmPassword } = await req.json();

        if (!password || !confirmPassword) {
            return Response.json({
                success: false,
                message: "Please enter both password and confirmation password"
            }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return Response.json({
                success: false,
                message: "Passwords do not match"
            }, { status: 400 });
        }

        // Hash token from URL
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user by token and check expiry
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "Reset password token is invalid or has expired"
            }, { status: 400 });
        }

        // Update password (pre-save hook will hash it)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return Response.json({
            success: true,
            message: "Password reset successfully"
        }, { status: 200 });

    } catch (error) {
        return Response.json({
            success: false,
            message: error.message || error
        }, { status: 500 });
    }
};

export const POST = resetPasswordHandler;
export const PUT = resetPasswordHandler;
