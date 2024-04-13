import express from 'express'
const chatRoute = express.Router()
import { createChat, findChat, userChats } from '../controllers/chatControllers.js';


chatRoute.post('/createchat', createChat);
chatRoute.get('/:userId', userChats);
chatRoute.get('/find/:firstId/:secondId', findChat);







export default chatRoute