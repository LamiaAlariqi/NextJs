import mongoose from  "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        default:"user"
    },
    profile:{
        type:String,
        default:""
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date   
},{
    timestamps:true
}

);

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
  userSchema.methods.resetPassword=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now() + 30 * 60 * 1000;
    return resetToken; 
  }
// Generate JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d"
    });
}

const User = mongoose.models.User || mongoose.model("User", userSchema);


export default User;