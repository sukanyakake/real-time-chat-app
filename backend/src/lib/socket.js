import express from "express"
import {Server} from "socket.io"
import http from "http"
const app=express()
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:[ENV.CLIENT_URL],
        credentials:true,
    }
})

//apply authentication middleware to all socket connection
io.use(socketAuthMiddleware)
const userSocketMap={}
io.on("connection",(socket)=>{
    console.log("A user conneted",socket.user.fullName)
    const userId=socket.userId
    userSocketMap[userId]=socket.id
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.user.fullName)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {io,app,server}