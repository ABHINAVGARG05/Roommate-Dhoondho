import UserModel from "../Models/userModel.js"
import Chat from "../Models/chatModel.js"
import Message from "../Models/messageModel.js"

import apiResponse from "../utils/responseModel.js"
import errResponse from "../utils/errApiResponse.js"

export const createChat = async (userId, postId) => {

    if(!userId) {
        return new errResponse(
            400,
            null,
            "User missing",
        )
    }
    console.log(userId)

    const chat = new Chat({
        participants : [userId],
        post: postId
    })
    try{
        await chat.save();
        const user = await UserModel.findById(userId).populate({
            path: "activeChats",
            populate: {
              path: "participants",
              model: "Users", 
            },
          });
        if (!user) {
            return new errResponse(404, null, "User not found");
        }
        console.log(user.activeChats)
        if (user.activeChats.length >= 3) {
            return new errResponse(
                400, 
                [], 
                "User present in 3 chats"
            );
        }

        console.log("hi")

        if (!user.activeChats.includes(chat._id)) {
            user.activeChats.push(chat._id);
            await user.save();
            return new apiResponse(
                200,
                {chat},
            )    
        }
        
        return new apiResponse(
            200,
            chat,
            "Chat created successfully",
        )
    }catch(error) {
        console.log(error)
        return new errResponse(
            500,
            null,
            "failed to create chat",
        )
    }

}

export const joinChat = async(req, res) => {
    const {userId,chatId} = req.body();

    if (!userId || !chatId) {
        return res.json(new errResponse(
            400,
            null,
            "UserId or chatId missing"
        ));
    }
    try{
        const user = await UserModel.findById(userId).populate("activeChats")

        if (!user) {
            return res.json(new errResponse(
                400,
                null,
                "User not found"
            ));
        }

        if (user.activeChat.length >= 3) {
            return res.json(new errResponse(
                400, 
                [], 
                "User present in 3 chats"
            ));
        }

        const chat = await Chat.findById(chatId).populate("chat");
        if(!chat) {
            return res.json(new errResponse(
                400,
                [],
                "Chat not found"
            ))
        }

        const message = await Message.findById({chatId}).sort({ createdAt :1})

        if (!user.activeChat.includes(chatId)) {
            user.activeChat.push(chatId);
            await user.save();
            return res.json(new apiResponse(
                200,
                {chat,message},
                "Chat joined successfully"
            ))
            
        }
        else {
            return res.json(new errResponse(
                400,
                null,
                "User is already in a chat"
            ));
        }
    }
    catch(error){
        return res.json(new errResponse(
            500,
            [],
            "Internal Server Error"
        ));
    }
}

export const leaveChat = async (req,res) => {
    const {userId,chatId} = req.body;

    try {
        if (!userId, !chatId) {
            return res.json(new errResponse(
                400,
                null,
                "UserId or chatId missing",
            ))
        }
        const user = await User.findById(userId)
        const chat = await chat.findById(chatId)

        if (!chat) {
            return res.json(new errResponse(
                400,
                null,
                "user not present in this chat"
            )) 
        }

        user.activeChat.remove(chatId)
        await user.save();

        return res.json(new apiResponse(
            200,
            null,
            "Chat left successfully"
        ))
    }
    catch (error) {
        return res.json(new errResponse(
            400,
            null,
            "failed to leave chat"
        ))
    }
    
}
