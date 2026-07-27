import { isAuthenticatedUser } from "@/app/utils/auth";

export const PUT = async (req) => {
    try {
        // 1. التحقق من هوية المستخدم المسجل
        const user = await isAuthenticatedUser();
        if (user instanceof Response) {
            return user;
        }

        // 3. استخراج البيانات من الطلب (استدعاء req.json مرة واحدة فقط لتجنب الخطأ)
        const { oldPassword, newPassword, confirmPassword } = await req.json();

        // 4. التحقق من مطابقة كلمة المرور الجديدة مع التأكيد
        if (newPassword !== confirmPassword) {
            return Response.json({
                success: false,
                message: "New password and confirm password do not match"
            }, {
                status: 400
            });
        }

        // 5. التحقق من صحة كلمة المرور الحالية (القديمة)
        const isPasswordMatched = await user.comparePassword(oldPassword);
        if (!isPasswordMatched) {
            return Response.json({
                success: false,
                message: "Old password is incorrect"
            }, {
                status: 400
            });
        }

        // 6. حفظ كلمة المرور الجديدة (سيقوم الـ pre-save hook بتشفيرها تلقائياً)
        user.password = newPassword;
        await user.save();

        return Response.json({
            success: true,
            message: "Password updated successfully"
        }, {
            status: 200
        });

    } catch (error) {
        // 7. إرجاع رسالة الخطأ للمستخدم بدلاً من ترك الطلب معلقاً
        return Response.json({
            success: false,
            message: error.message || error
        }, {
            status: 500
        });
    }
}