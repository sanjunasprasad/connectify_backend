import {Router} from 'express'
const userRoute = Router();
// import { upload } from '../../middlewares/multer.js';
import { decodeToken } from '../../middlewares/auth.js';
import { userRegister,fetchProfile,userLogin,forgotPassword,resetPassword,otpVerify,resendotp,updateUser,deleteUser} from '../controllers/userControllers.js';



userRoute.post('/userRegister',  userRegister);
userRoute.post('/otpVerify',  otpVerify);
userRoute.get('/resendotp',  resendotp);
userRoute.post('/userLogin', userLogin);
userRoute.post('/forgotPassword', forgotPassword); 
userRoute.post('/resetPassword',resetPassword)
userRoute.get('/userProfile', decodeToken, fetchProfile); //get logged user home,profile
// userRoute.put('/updateUser/:id', decodeToken,upload.single('file'),updateUser);
userRoute.delete('/DeleteUser/:id', decodeToken,deleteUser);



export default userRoute;