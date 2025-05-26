const User = require("../models/user.model")
const Message = require("../models/message.model")
const cloudinary = require("../lib/cloudinary")
const { getReceiverSocketId, io } = require("../lib/socket")

const getUsersForSidebar = async (req , res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id : {$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("error in signup controller" , error.message)
        res.status(500).json({message : "Internal Server Error"})
    }
}

const getMessages = async (req , res) => {
    try {
        const { id:userToChatId } = req.params
        const myId = req.user._id

        //get all messages when sender is me and the receiver is other user or vice versa
        const messages = await Message.find({
            $or:[
                { senderId:myId , receiverId:userToChatId },
                { senderId:userToChatId , receiverId:myId }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("error in signup controller" , error.message)
        res.status(500).json({message : "Internal Server Error"})
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text , image } = req.body
        const { id: receiverId} = req.params
        const senderId = req.user._id

        let imageUrl;
        if(image){
            //upload base64 image to clodinary
            const uploadResponce = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponce.secure_url
        }
        
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save()

        //real time funtionality => socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            // to(receiverSocketId) -> send message only the reciver not all because this is a one-on-one chat
            io.to(receiverSocketId).emit("newMessage" , newMessage)

        }

        res.status(200).json(newMessage)

    } catch (error) {
        console.log("error in signup controller" , error.message)
        res.status(500).json({message : "Internal Server Error"})
    }
}

module.exports = {getUsersForSidebar,getMessages,sendMessage}