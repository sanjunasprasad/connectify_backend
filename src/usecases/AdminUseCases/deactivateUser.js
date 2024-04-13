import { updateStatus } from '../../repositories/adminRepository.js';


export const deactivate = async (id,status) =>{
  try {
    const response = await updateStatus(id, status);
    return response; 
  } catch (error) {
    throw new Error('Failed to update user status'); 
  }

}


