import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connection from "@/app/db/conn";
import User from "@/app/models/userModel";

/**
 * دالة للتحقق من هوية المستخدم المسجل عبر الـ Token المخزن في الـ Cookies.
 * ترجع كائن المستخدم (User) إذا كانت الهوية صحيحة، أو ترجع كائن Response في حال عدم تسجيل الدخول أو انتهاء صلاحية الـ Token.
 */
export const isAuthenticatedUser = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return Response.json({
                success: false,
                message: "Please login to access this resource"
            }, {
                status: 401
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await connection();
        const user = await User.findById(decoded.id);

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            });
        }

        return user;
    } catch (error) {
        return Response.json({
            success: false,
            message: "Invalid or expired token"
        }, {
            status: 401
        });
    }
};

/**
 * دالة للتحقق من الصلاحيات بناءً على أدوار المستخدمين (مثل: admin, user).
 * ترجع null إذا كان مسموحاً بالوصول، أو كائن Response بـ 403 Forbidden إذا لم يكن مصرحاً له.
 */
export const authorizeRoles = (...roles) => {
    return (user) => {
        if (!roles.includes(user.role)) {
            return Response.json({
                success: false,
                message: `Role (${user.role}) is not allowed to access this resource`
            }, {
                status: 403
            });
        }
        return null;
    };
};
