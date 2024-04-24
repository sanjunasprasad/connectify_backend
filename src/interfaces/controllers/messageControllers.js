import MessageModel from "../../entities/messageModel.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text,    } = req.body;
    // Check if an image was uploaded
    const image = req.file ? req.file.path : null;
    console.log(" from controller image  is:", image)
    console.log(" from controller message:",text)
    // console.log("chatid",chatId)
    // console.log("senderid",senderId)
   
  const message = new MessageModel({
    chatId,
    senderId,
    text,
    image, 
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};





export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  // console.log("chatid",chatId)
  try {
    const result = await MessageModel.find({ chatId });
    // console.log("received message is ",result)
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
