import { deleteOneUser, deletePostsByUser } from "../../repositories/userRepository.js";


export const deleteUserAndPosts = async (id) => {
  try {
    const postDeletionResponse = await deletePostsByUser(id);
    const userResponse = await deleteOneUser(id);
  
    return { userResponse, postDeletionResponse };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user and posts");
  }
};


