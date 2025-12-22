import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import {ENV} from "../lib/env.js"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  console.log(fullname,email,password)

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullname,
      email,
      password: hashPassword,
    });

    generateToken(newUser._id, res);

    res.status(201).json({
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
    //send a welcome email to user
    try{
      await sendWelcomeEmail(newUser.email,newUser.fullName,ENV.CLIENT_URL)
    }catch(error){
      console.log(error)
    }
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login=async (req,res)=>{
  const {email,password}=req.body;
  if(!email || !password) return res.status(400).json({message:"Email and password are required"})
  try{
    const user=await User.findOne({email});
    if(!user) return res.status(400).json({message:"Invalid Credentials"});
    //donot tell which one is incorrect
  const isPasswordCorrect=await bcrypt.compare(password,user.password);
  if(!isPasswordCorrect){
    return res.status(400).json({message:"Invalid Credentials"});
  }
  generateToken(user._id,res);
     res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  }catch(error){
    console.error("Error in login controlller",error);
    res.status(500).json({message:"INterval server error"});
  }
}
export const logout=async (_,res)=>{
  res.cookie("jwt","",{maxAge:0});
  res.status(200).json({message:"Logout Sucessfully"});
}

export const updateProfile=async (req,res)=>{
  try{
    const {profilePic}=req.body
    if(!profilePic) return res.status(400).json({message:"Profile pic is required"})
    const userId=req.user_id;
  const uploadResponse=await cloudinary.uploader.upload(profilePic)

  const updatedUser=await findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
  res.status(200).json(updatedUser)
  }catch(error){
     console.error("Error in update:", error);
    res.status(500).json({ message: "Update profilel error" });

  }
}