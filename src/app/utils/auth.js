import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connection from "@/app/db/conn";
import User from "@/app/models/userModel";

/**
 * دالة للتحقق من هوية المستخدم المسجل عبر الـ Token المخزن في الـ Cookies أو الـ Headers.
 */
export const isAuthenticatedUser = async (req) => {
  try {
    let token = "";

    // 1. Check cookies
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;

    // 2. Check Authorization Header if cookie token missing
    if (!token && req) {
      const authHeader = req.headers?.get("authorization") || req.headers?.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "").trim();
      }
    }

    // 3. Fallback check for request query / params
    if (!token && req?.url) {
      const { searchParams } = new URL(req.url);
      token = searchParams.get("token");
    }

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Please login to access this resource",
        },
        {
          status: 401,
        }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connection();
    const user = await User.findById(decoded.id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return user;
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      {
        status: 401,
      }
    );
  }
};

/**
 * دالة للتحقق من الصلاحيات بناءً على أدوار المستخدمين مع دعم المرونة لجميع صيغ الأدمن.
 */
export const authorizeRoles = (...roles) => {
  return (user) => {
    const userRoleClean = (user?.role || "").toLowerCase().trim().replace(/[\s_]/g, "");
    
    // Check if user is any variant of admin/superadmin or matches requested roles
    const isAdminVariant =
      userRoleClean === "admin" ||
      userRoleClean === "superadmin" ||
      userRoleClean.includes("admin") ||
      userRoleClean.includes("super");

    const isMatch = roles.some((r) => {
      const rClean = r.toLowerCase().trim().replace(/[\s_]/g, "");
      return rClean === userRoleClean || (rClean === "admin" && isAdminVariant);
    });

    if (!isMatch && !isAdminVariant) {
      return Response.json(
        {
          success: false,
          message: `Role (${user?.role}) is not allowed to access this resource`,
        },
        {
          status: 403,
        }
      );
    }
    return null;
  };
};
