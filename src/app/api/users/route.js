import connection from "@/app/db/conn";
import User from "@/app/models/userModel";

export const GET = async (req) => {
  try {
    await connection();
    const users = await User.find({}).sort({ createdAt: -1 });

    const formattedUsers = users.map((u) => ({
      _id: u._id.toString(),
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || "user",
      createdAt: u.createdAt,
    }));

    return Response.json(
      {
        success: true,
        message: "Users fetched successfully",
        users: formattedUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch users error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || error,
        users: [],
      },
      { status: 500 }
    );
  }
};