import User from "../entities/userModel.js";

// to get all users
export const getAllUsers = async () => {

  const userData = await User.find().lean();
  // console.log("reached last of loaduser admin repo:",userData);
  return userData
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
  const response = await User.findByIdAndDelete(id);
  if (response) {
    return response;
  } else {
    return { message: "User not found" };
  }
};

export const getReportProfile = async() =>{
    const reportedUsers = await User.find({ reports: { $exists: true, $ne: [] } }).populate('reports.reportedBy');
    // console.log("from last stage list",reportedUsers)
    return  reportedUsers
}

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