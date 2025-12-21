import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts=async (req,res)=>{
    try{
            const loggedInUserId=req.user._id ;
            const filteredUsers=await User.find({_id:{$ne :loggedInUserId}}).select('-password')
            res.status(200).json(filteredUsers)

    }    catch(error){
        console.log(error)
                    res.status(500).json({message:"ServerError"})

    }
    
}

export const getMessagesByUserId=async (req,res)=>{
    try{
        const myId=req.user._id
        const {id:userToChatId}=req.params 
        const messages=await Message.find({
            $or:[
                {
                    senderId:myId,receiverId:userToChatId
                },
                {
                    senderId:userToChatId,receiverId:myId
                }
            ],
        })
        res.status(200).json(messages)

    }catch(error){
        console.log("Error in getMessages Controller",error.message)
        res.status(500).json({message:"Internal Server"})
    }
}

export const sendMessage=async (req,res)=>{
    try{
        const {text,image}=req.body
        const {id:receiverId}=req.params
        const senderId=req.user._id
        if(!text && !image){
            return res.status(400).json({message:"TExt or image is required"})
        }
        if(senderId.equals(receiverId)){
                        return res.status(400).json({message:"Cannot send messages to yourself"})

        }
        const receiverExists=await User.exists({_id:receiverId})
        if(!receiverExists){
                        return res.status(400).json({message:"Receievr not found"})

        }
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
        }
        const newMessage=new Message({
            senderId,receiverId,text,image:imageUrl 
        })
        await newMessage.save()
        //semd message in real time later
        res.status(200).json(newMessage)

    }catch(error){
        console.log("error",error)
                res.status(500).json({message:"Internal server error"})

    }

}

export const getChatPartners=async (req,res)=>{
    try{
        const loggedInUserId=req.user._id
        //find all messages where logged in user is eihger sender or reciever
        const messages=await Message.find({
            $or:[{
                    senderId:loggedInUserId
                },
                {
                    receiverId:loggedInUserId
                }],
        })
        const chatPartnerIds=[...new  Set(messages.map(msg=>msg.senderId.toString()===loggedInUserId.toString()?msg.receiverId.toString():msg.senderId.toString()))]
        const chatPartners=await User.find({_id:{$in:chatPartnerIds}}).select("-password") 
        
        res.status(200).json(chatPartners)
    }
    catch(error){
        console.log(error)
                res.status(500).json({message:"Internal Server Erro"})

    }
}