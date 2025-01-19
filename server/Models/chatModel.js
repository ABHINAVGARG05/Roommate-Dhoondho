import mongoose from "mongoose"

const chatSchema = new mongoose.Schema(
        {
        post:{
            type:String,
            ref:"Posts"
        },
        name:{
            type:String
        },
        participants:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        }],
    },
    {timestamps:true}
)

const Chat = mongoose.model("Chat",chatSchema)
export default Chat