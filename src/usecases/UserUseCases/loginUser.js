import bcrypt from 'bcrypt';
import {checkUser} from '../../repositories/userRepository.js';
import { generateUserToken } from '../../middlewares/auth.js';


export const loginUser = async (email, password) => {
    try {
      const existingUser = await checkUser(email);
      // console.log("existing user:",existingUser)
  
       if (existingUser === null) {
        return { notFound: true, message: 'Email address does not exist.' };
        } 
       else if (existingUser.is_blocked) {
            //  console.log("user status from usecase:",existingUser.is_blocked)
        return { blocked: true, message: 'User account is blocked.' };
       }
       else if(existingUser.status){
        return { status: true, message: 'User account is deactivated.' };
       }
      else if (existingUser) 
      {
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (passwordMatch) 
        {
          const token = generateUserToken(existingUser);
          // console.log(" generated token in login route",token)
          return token;
        }
      }
      return null; 
    } catch (err) {
      console.error("Error during user login:", err);
      throw err; 
    }
  };