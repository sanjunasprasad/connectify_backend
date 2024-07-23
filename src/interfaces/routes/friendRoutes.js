import {Router} from "express"
const friendRoute = Router()
import { decodeToken } from '../../middlewares/auth.js';
import { getUserAccount,followUser,unfollowUser,suggetionList,reportProfile,getfollowersandfollowing ,fetchFollowers ,fetchFollowings} from "../controllers/friendControllers.js"





friendRoute.get('/userAccount/:id',decodeToken,getUserAccount); //get frienduser(follower/following) profiledetails,postdetails
friendRoute.get('/getfollowersandfollowing/:id',decodeToken,getfollowersandfollowing)
friendRoute.post('/follow/:id',decodeToken,followUser);
friendRoute.post('/unfollow/:id',decodeToken,unfollowUser)
friendRoute.get('/suggestionlist/:id',decodeToken,suggetionList)
friendRoute.post('/reportProfile/:id',decodeToken,reportProfile)
friendRoute.get('/fetchFollowers/:userId',decodeToken,fetchFollowers)
friendRoute.get('/fetchFollowings/:userId',decodeToken,fetchFollowings)
export default friendRoute