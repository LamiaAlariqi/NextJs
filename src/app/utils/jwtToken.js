import { cookies } from "next/headers";

export const sendToken = async (user, statusCode, res) => {
    const token = user.getJWTToken();

    // Cookie options
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        expires: new Date(
            Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
        ),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });

    // Strip password from output for security
    const userOptions = user.toObject();
    delete userOptions.password;

    return Response.json({
        success: true,
        user: userOptions,
        token,
    }, {
        status: statusCode
    });
};
