import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
export const connectDB=async ()=>{
    try{
       const conn= await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB connected",conn.connection.host)
        console.log("MONGO_URI =", process.env.MONGO_URI);

    }catch(error){
        console.log("Error connecting to mongodb",error)
        process.exit(1)
    }
}