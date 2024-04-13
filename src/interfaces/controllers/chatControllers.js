import ChatModel from "../../entities/chatModel.js";

export const createChat = async (req, res) => {
  try {
      // console.log("senderid",req.body.senderId)
      // console.log("reciverid",req.body.receiverId)
    const existingChat = await ChatModel.findOne({
      members: {
        $all: [req.body.senderId, req.body.receiverId]
      }
    });

    if (existingChat) {
      // console.log("Existing chat:", existingChat);
      res.status(200).json(existingChat);
      return;
    }

    // If no existing chat is found, create a new one
    const newChat = new ChatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    const result = await newChat.save();
    console.log("New chat:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json(error);
  }
};


export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};