import { updateUser } from "../../repositories/userRepository.js";

export const editUser = async (userId,userData) => {
  try {
    return await updateUser(userId, userData);
  } catch (error) {
    throw error;
  }
  };
  