import User from "../entities/userModel.js";
import Post from "../entities/postModel.js";

export const getAllUsers = async () => {
  try {
    const userData = await User.find().lean()
    console.log("userdata111111",userData)
    return userData;
  } catch (error) {
    console.error("An error occurred while fetching all users:", error);
    return { message: "An error occurred while fetching all users" };
  }
};


//block/unblock
export const updateUserstatus = async (id, isBlocked) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id }, 
      { $set: { is_blocked: isBlocked } }, 
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      throw new Error("User not found");
    }
    // console.log("Updated user from repo:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user status:", error);
    throw new Error("Failed to update user status");
  }
};

// to delete user
export const deleteOneUser = async (id) => {
  try {
    const response = await User.findByIdAndDelete(id);
    if (response) {
      return response;
    } else {
      return { message: "User not found" };
    }
  } catch (error) {
    console.error("An error occurred while deleting user:", error);
    return { message: "An error occurred while deleting user" };
  }
};


export const getReportProfile = async () => {
  try {
    const reportedUsers = await User.find({ reports: { $exists: true, $ne: [] } }).populate('reports.reportedBy');
    return reportedUsers;
  } catch (error) {
    console.error("An error occurred while fetching reported users:", error);
    return { message: "An error occurred while fetching reported users" };
  }
};

//deactivate status
export const updateStatus = async(id,status)=>{
  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { status: !status } },
      { new: true }
    );
    if (!user) {
      return null; 
    }
    return user; 
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error; 
  }
}


//get all posts
 export const getAll = async()=>{
  try {
  const response =await Post.find().populate('user').populate('likes.user').populate('comments.user');
  // console.log("repo response",response)
    return response
  } catch (error) {
    throw new Error('Error while fetching posts');
  }

}