import {Router} from 'express'
const postRoute = Router();
import { decodeToken } from '../../middlewares/auth.js';
import { upload } from '../../middlewares/multer.js';
import {createPost,loadPost,loadownPost,likePost,likedUsers,commentPost,deletePost,savedPost,getSavedPost,editPost} from "../controllers/postControllers.js"




postRoute.post('/createPost',upload.single('file'), createPost);
postRoute.get('/loadownPost',decodeToken,loadownPost); //own post load
postRoute.get('/loadPost/:userId', decodeToken,loadPost);//restricted post load
postRoute.put('/likepost/:postid',decodeToken,likePost) // post like,unlike
postRoute.get('/likedusers/:postId',decodeToken,likedUsers)

postRoute.post('/commentpost/:postid',decodeToken, commentPost); 
postRoute.delete('/deletePost/:postId',decodeToken, deletePost); 
postRoute.post('/savePost/:postId',decodeToken,savedPost);
postRoute.get('/getSavedpost/:userId',decodeToken,getSavedPost)
postRoute.put('/editPost/:postId',decodeToken,editPost)


export default postRoute;