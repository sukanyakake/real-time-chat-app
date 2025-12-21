import { ENV } from "../lib/env.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

export const protectedRoute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt 
        if(!token) return res.status(400).json({message:"Unauthorized- no token provided"})
        const decoded=jwt.verify(token,ENV.JWT_SECRET)
        if(!decoded) return res.status(400).json({message:"Invalid token provided"}) 
        const user=await User.findById(decoded.userId).select('-password')
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        req.user=user
        next()
    }catch(error){
        console.log("Error in protected route middleware")
        return res.status(500).json({message:"Internal Server error"})
    }
}