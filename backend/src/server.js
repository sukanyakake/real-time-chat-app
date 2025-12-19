import express from "express"
import dotenv from "dotenv"
import authRoutes from './routes/auth.js'
import messageRoutes from "./routes/message.js"
import path from "path"
import {connectDB} from "./lib/db.js"
const app=express()
const __dirname=path.resolve()
dotenv.config()
app.use(express.json())

const port=process.env.PORT
app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}
connectDB().then(() => {
  app.listen(port, () => console.log("Server running"));
});
