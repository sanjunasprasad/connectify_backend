import { getAllUsers} from "../../repositories/adminRepository.js"

export const getUsers = async () => {
    try {
      const userData = await getAllUsers();
      return userData;
    } catch (error) {
      console.error("An error occurred while fetching users:", error);
      return { message: "An error occurred while fetching users" };
    }
  };
  