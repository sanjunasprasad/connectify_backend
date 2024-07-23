import bcrypt from 'bcrypt';
import {checkUser} from '../../repositories/userRepository.js';
import { generateUserToken } from '../../middlewares/auth.js';


export const loginUser = async (email, password) => {
    try {
      const {existingUser ,role} = await checkUser(email);
      // console.log("existing user:",existingUser)
      // console.log("role isss",role)
  
       if (existingUser === null) {
        return { notFound: true, message: 'Email address does not exist.' };
        } 

       if (existingUser.is_blocked) {
             console.log("user status from usecase:",existingUser.is_blocked)
        return { blocked: true, message: 'User account is blocked.' };
       }

       if(existingUser.status){
        return { status: true, message: 'User account is deactivated.' };
       }

      if (existingUser) {
        if (typeof existingUser.password === 'string') {
          const passwordMatch = await bcrypt.compare(password, existingUser.password);
          if (passwordMatch) {
            const token = generateUserToken(existingUser ,role);
            return token;
          }
        } else {
          console.error('User password is not a string:', existingUser.password);
          return { error: 'User password is not a string' };
        }
      }
      
      return null; 

    } catch (err) {
      console.error("Error during user login:", err);
      throw err; 
    }
  };