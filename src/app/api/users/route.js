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

export const POST = async (req) => {
  try {
    await connection();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json(
        { success: false, message: "Email address is already registered" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // userModel pre-save hook will hash it with bcrypt automatically
      role: role || "user",
    });

    return Response.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          _id: newUser._id.toString(),
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return Response.json(
      { success: false, message: error.message || error },
      { status: 500 }
    );
  }
};