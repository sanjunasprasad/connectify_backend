import { deleteOneUser, deletePostsByUser ,updateFollowersAndFollowing ,deleteReports } from "../../repositories/userRepository.js";


export const deleteUserAndPosts = async (id) => {
  try {
    // Delete posts and related data
    const postDeletionResponse = await deletePostsByUser(id);

    // Update followers and following lists
    const followersAndFollowingResponse = await updateFollowersAndFollowing(id);

      // Remove reports related to this user
      const reportsDeletionResponse = await deleteReports(id);

    // Delete user
    const userResponse = await deleteOneUser(id);

    return { userResponse, postDeletionResponse, followersAndFollowingResponse, reportsDeletionResponse };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user and related data");
  }
};


