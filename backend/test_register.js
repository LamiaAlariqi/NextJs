import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from './models/UserModel.js';
import cloudinary from './util/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("Connecting to DB:", process.env.DB_URL);
await mongoose.connect(process.env.DB_URL);
console.log("DB Connected successfully!");

const dummyBase64Image = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

try {
    const profile = dummyBase64Image;
    
    let myCloud;
    if (profile) {
        console.log("Uploading to Cloudinary...");
        myCloud = await cloudinary.uploader.upload(profile, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
        console.log("Cloudinary Upload Success!", myCloud.secure_url);
    }

    console.log("Creating user in MongoDB...");
    const randomEmail = `test_${Date.now()}@example.com`;
    const user = await User.create({
        name: "Test User",
        email: randomEmail,
        password: "password123",
        role: "user",
        profile: {
            public_id: myCloud ? myCloud.public_id : "default_avatar_id",
            url: myCloud ? myCloud.secure_url : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        }
    });
    console.log("User Created successfully in Mongoose!", user);
} catch (error) {
    console.error("Test Register Failed with Error:", error);
} finally {
    await mongoose.connection.close();
    console.log("DB Disconnected.");
}
