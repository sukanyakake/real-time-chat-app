import express from "express"
import dotenv from "dotenv"
import authRoutes from './routes/auth.js'
import messageRoutes from "./routes/message.js"
import path from "path"
const app=express()
const __dirname=path.resolve()
dotenv.config()
const port=process.env.PORT
app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get("*",(res,req)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}
app.listen(3000,()=>{
    console.log(`server running on ${port}`)
})