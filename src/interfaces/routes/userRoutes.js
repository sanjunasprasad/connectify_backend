import {Router} from 'express'
const userRoute = Router();
import { decodeToken } from '../../middlewares/auth.js';
import { userRegister,fetchProfile,userLogin,forgotPassword,resetPassword,otpVerify,resendotp,updateUser,deleteUser,searchUser} from '../controllers/userControllers.js';




userRoute.post('/userRegister',  userRegister);
userRoute.post('/otpVerify',  otpVerify);
userRoute.get('/resendotp',  resendotp);
userRoute.post('/userLogin', userLogin);
userRoute.post('/forgotPassword', forgotPassword); // cant set middleware, not loggedin yet
userRoute.post('/resetPassword',resetPassword) // cant set middleware, not loggedin yet
userRoute.get('/userProfile', decodeToken, fetchProfile); //get logged user home,profile
userRoute.put('/updateUser/:id', decodeToken,updateUser);
userRoute.delete('/DeleteUser/:id', decodeToken,deleteUser);
userRoute.get('/search', decodeToken,searchUser)


export default userRoute;