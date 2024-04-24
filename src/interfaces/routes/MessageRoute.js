import express from 'express';
const messageRoute = express.Router();
import { upload } from '../../middlewares/multer.js';
import {  addMessage,getMessages } from '../controllers/messageControllers.js';




messageRoute.post('/', upload.single("image"),addMessage)
messageRoute.get('/:chatId', getMessages);






export default messageRoute