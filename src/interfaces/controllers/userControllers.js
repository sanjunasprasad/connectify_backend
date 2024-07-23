import { registerUser } from "../../usecases/UserUseCases/registerUser.js";
import { findOneUser } from "../../repositories/userRepository.js";
import {loginUser} from '../../usecases/UserUseCases/loginUser.js';
import { editUser } from '../../usecases/UserUseCases/editUser.js';
import { deleteUserAndPosts} from '../../usecases/UserUseCases/deleteUser.js';
import { generateOTP, sendOTPByEmail } from '../../services/otpService.js';
import User from  "../../entities/userModel.js"
import bcrypt from 'bcrypt';



let savedOTP,userMail
export const userRegister = async (req, res) => {
    try {
      const { firstName, lastName, phoneNo, email, password, is_blocked} = req.body;
      // console.log('User dataoooo:', { firstName, lastName, phoneNo, email, password ,is_blocked});
       userMail=req.body.email
      savedOTP = generateOTP(); 
      await sendOTPByEmail(email, savedOTP);
      await registerUser(firstName, lastName, phoneNo, email, password,is_blocked);
      return res.status(200).end();
    } catch (err) {
      console.error("Error during user registration:", err);
      return res.status(500).send("Internal Server Error");
    }
  };

  export const otpVerify = async(req,res) =>{
    try{
      console.log("verify calleddddd")
      const { Otp } = req.body;
      console.log("from frontend",Otp)
      console.log("from backend savedotp",savedOTP)
      const OTP = parseInt(Otp, 10);
      if( OTP === savedOTP){
        res.status(200).json({ success: true, message: "OTP matched successfully." });
      }
      else {
        res.status(400).json({ success: false, message: "Invalid OTP. Please enter the correct OTP." });
      }

    }catch(err){
      console.error('Error verifying OTP:', err);
      res.status(500).json({ success: false, message: "An error occurred during OTP verification." });
    }
  }

  export const resendotp = async (req, res) => {
    try {
      console.log("resend otp calleddddddddddd");
       savedOTP = generateOTP(); 
      await sendOTPByEmail(userMail, savedOTP);
      console.log("New OTP generated iam resend controller", savedOTP);
      res.status(200).json({ success: true, message: "OTP successfully resent to your email." });
    } catch (err) {
      console.error('Error resending OTP:', err);
      res.status(500).json({ success: false, message: "An error occurred while resending OTP." });
    }
  }
  
 //user login 
export const userLogin = async (req, res) => {
  try {
   
    const { email, password } = req.body;
    const response = await loginUser(email,password);
    // console.log("from login controller response as token",response)
    if (!response) {
      return res.status(401).end(); 
    } else if(response.notFound){
      return res.status(401).json({ message: response.message });
    }
    else if (response.blocked) {
      return res.status(401).json({ message: response.message }); // User is blocked
    }else if(response.status){
      return res.status(401).json({ message: response.message }); 
    } else {
      return res.status(200).json(response); 
    }
    
  } catch (err) {
    console.log(err);
  }
};


//forgot password to send otp and verify email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
     console.log("email  from frontend for restpassword:",email)
     userMail=req.body.email
    savedOTP = generateOTP(); 
    await sendOTPByEmail(email, savedOTP);
    res.status(200).json({ success: true, message: "OTP successfully resent to your email." });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async(req,res) =>{
  const {  confirmpassword } = req.body;
  console.log("confirm password:",confirmpassword)
  console.log("user mail:",userMail)
  try {
    const user = await User.findOne({ email: userMail });
    console.log("reset pw requested user :",user)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(confirmpassword, 10);
    user.password = hashedPassword
    await user.save();
    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password' });
  }
}


//user update
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstName, email, bio, location, image } = req.body;
  console.log("User ID:", userId);
  console.log("First Name:", firstName);
  console.log("Email:", email);
  console.log("Bio:", bio);
  console.log("Location:", location);
  console.log("Image:", image);

  try {
    const updatedUser = await editUser(userId, { firstName, email, bio, location, image });
    console.log("output at contro",updatedUser)
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




// for user home page
export const fetchProfile = async (req, res) => {
  try{
    const userId = req.token.userId
    // console.log("user id from fetch profile",userId)
    const response = await findOneUser(userId);
    // console.log(" userdata from loadprofile route is:",response)
    return res.status(200).json(response);
  }catch(err){
    console.log(err);
  }
}

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log("user id",userId)
    const { userResponse, postDeletionResponse,} = await deleteUserAndPosts(userId);
    // console.log("deleted items##########",userResponse,postDeletionResponse,)
    
    res.status(200).json({ userResponse, postDeletionResponse });
  } catch (err) {
    console.log(err);
    res.json({ message: "Couldn't delete the user and posts" });
  }
};



export const searchUser = async(req,res) =>{
  try {
    const term = req.query.term;
    // console.log("term",term)
    const users = await User.find({
      $or: [
        { firstName: { $regex: term, $options: 'i' } },
        { lastName: { $regex: term, $options: 'i' } },
      ],
    }).select('image firstName lastName email _id');

    if (users.length === 0) {
      return res.status(404).json({ message: 'No results found' });
    }
    const formattedUsers = users.map(user => ({
      image: user.image,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userId: user._id
    }));
    // console.log('Found users:', formattedUsers);
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error searching user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}

