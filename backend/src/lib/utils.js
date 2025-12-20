import jwt from "jsonwebtoken"
import { ENV } from "./env";
export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId:userId},ENV.JWT_SECRET,{expiresIn:"7d"});
    res.cookie("jwt",token,{maxAge:7*24*60*60*1000,
        httpOnly:true,//prevent xss attacks:Crooss-site scirping
        sameSite:"strict",//CSRF attack
        secure:ENV.NODE_ENV==="development"?false:true
    })
}