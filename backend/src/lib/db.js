import mongoose from "mongoose"
import { ENV } from "./env.js";

export const connectDB=async ()=>{
    try{
       const conn= await mongoose.connect(ENV.MONGO_URI)
        console.log("MONGODB connected",conn.connection.host)
        console.log("MONGO_URI =", ENV.MONGO_URI);

    }catch(error){
        console.log("Error connecting to mongodb",error)
        process.exit(1)
    }
}