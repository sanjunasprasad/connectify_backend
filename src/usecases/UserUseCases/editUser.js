import { updateUser } from "../../repositories/userRepository.js";

export const editUser = async (id, userData, image) => {
    try {
      return await updateUser(id, userData, image);
    } catch (err) {
      console.log(err);
      throw err; // Re-throw the error for handling in the controller layer
    }
  };
  