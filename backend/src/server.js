import express from "express"
import dotenv from "dotenv"
import authRoutes from './routes/auth.js'
import messageRoutes from "./routes/message.js"
const app=express()

app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)
app.listen(3000,()=>{
    console.log("server running on 3000")
})