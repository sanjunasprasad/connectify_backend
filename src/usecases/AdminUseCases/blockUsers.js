import { updateUserstatus } from '../../repositories/adminRepository.js';


export const blockUsers = async (id,isBlocked) =>{
  try {
    const response = await updateUserstatus(id, isBlocked);
    console.log(1000000000000000,response)
    return response; 
  } catch (error) {
    throw new Error('Failed to update user status');
  }

}


