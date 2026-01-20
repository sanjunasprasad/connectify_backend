import User from  '../entities/userModel.js'
import Post from  '../entities/postModel.js'


//user registration
export const saveUser = async (firstName, lastName, phoneNo, email, password, is_blocked, status) => {
  try {
    const user = new User({ firstName, lastName, phoneNo, email, password, is_blocked, status });
    return user.save();
  } catch (error) {
    console.error("An error occurred while saving the user:", error);
    return { message: "An error occurred while saving the user" };
  }
};


//from login to verify token
export const checkUser = async (email) => {
  try {
    const existingUserData = await User.findOne({ email: email });
    const role = existingUserData.isAdmin ? 'admin' : 'user';
    // console.log("from repo existingUserData role:",role)
    return { existingUser: existingUserData, role };
  } catch (error) {
    console.error("An error occurred while checking user:", error);
    return { message: "An error occurred while checking user" };
  }
};


//after login userhomepage
export const findOneUser = async (id) => {
    try{
        return await User.findById(id);
    }catch(err){
        console.log(err)
    }
}

//for admin to get all users
export const getAllUsers = async () => {
  try {
    return await User.find().lean();
  } catch (error) {
    console.error("An error occurred while fetching all users:", error);
    return { message: "An error occurred while fetching all users" };
  }
};



   //from user to edit
  export const updateUser = async (userId, userData) => {
    try {
      const { firstName,  phoneNo, email, password, bio, location ,image } = userData;
      const updateData = { firstName,  phoneNo, email, password, bio, location  ,image};
      const response = await User.findByIdAndUpdate(userId, updateData, { new: true });
      console.log("final update",response)
      return response 
    } catch (err) {
      console.log(err);
      throw err; 
    }
  };
  

// Delete one  user
export const deleteOneUser = async (id) => {
  const response = await User.findByIdAndDelete(id);
  console.log("DELETE USER:",response)
  if (response) {
    return response;
  } else {
    return { message: "User not found" };
  }
};

// Delete posts, likes,comments associated with the user
export const deletePostsByUser = async (userId) => {
  try {
    // Remove comments by the user from all posts
    await Post.updateMany(
      { "comments.user": userId },
      { $pull: { comments: { user: userId } } }
    );

    // Remove likes by the user from all posts
    await Post.updateMany(
      { "likes.user": userId },
      { $pull: { likes: { user: userId } } }
    );

    // Delete all posts by the user
    const response = await Post.deleteMany({ user: userId });
    // console.log("DELETE USER POST:", response);
    return response;
  } catch (error) {
    console.error("An error occurred while deleting posts by user:", error);
    return { message: "An error occurred while deleting posts by user" };
  }
};



export const updateFollowersAndFollowing = async (userId) => {
  try {
    // Remove user from followers' list
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // Remove user from following's list
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );

    return { message: "Followers and following lists updated successfully" };
  } catch (error) {
    console.error("An error occurred while updating followers and following lists:", error);
    return { message: "An error occurred while updating followers and following lists" };
  }
};

export const deleteReports = async (userId) => {
  try {
    // Remove reports made by this user
    const reportsMadeResponse = await deleteReportsMadeByUser(userId);

    // Remove reports against this user
    const reportsAgainstResponse = await deleteReportsAgainstUser(userId);

    return { reportsMadeResponse, reportsAgainstResponse };
  } catch (error) {
    console.error("An error occurred while deleting reports:", error);
    return { message: "An error occurred while deleting reports" };
  }
};

export const deleteReportsAgainstUser = async (userId) => {
  try {
    // Remove reports against this user
    await User.updateMany(
      { _id: userId },
      { $set: { reports: [] } }
    );

    return { message: "Reports against the user removed successfully" };
  } catch (error) {
    console.error("An error occurred while deleting reports against the user:", error);
    return { message: "An error occurred while deleting reports against the user" };
  }
};


export const deleteReportsMadeByUser = async (userId) => {
  try {
    // Remove reports made by this user from other users
    await User.updateMany(
      { "reports.reportedBy": userId },
      { $pull: { reports: { reportedBy: userId } } }
    );

    return { message: "Reports made by the user removed successfully" };
  } catch (error) {
    console.error("An error occurred while deleting reports made by the user:", error);
    return { message: "An error occurred while deleting reports made by the user" };
  }
};
