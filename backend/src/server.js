import express from "express"
import authRoutes from './routes/auth.js'
import messageRoutes from "./routes/message.js"
import path from "path"
import cors from "cors"
import {connectDB} from "./lib/db.js"
import { ENV } from "./lib/env.js"
import cookieParser from "cookie-parser"
const app=express()
const __dirname=path.resolve()
app.use(express.json())
app.use(cors({origin: "http://localhost:5173",credentials:true}))

app.use(cookieParser())

const port=ENV.PORT
app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)
if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}
connectDB().then(() => {
  app.listen(port, () => console.log("Server running"));
});
