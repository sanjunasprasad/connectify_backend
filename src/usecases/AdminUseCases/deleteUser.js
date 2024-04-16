import { deleteOneUser } from "../../repositories/adminRepository.js"

export const deleteUser = async (id) => {
    try {
      const response = await deleteOneUser(id);
      return response;
    } catch (error) {
      // Handle any errors that occur during the deletion process
      console.error("An error occurred while deleting user:", error);
      return { message: "An error occurred while deleting user" };
    }
  };
  