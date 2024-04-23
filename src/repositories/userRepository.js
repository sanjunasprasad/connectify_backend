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
    // console.log("from repo existingUserData:",existingUserData)
    return existingUserData;
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
  



// Delete user
export const deleteOneUser = async (id) => {
  // console.log("userid in delete one user *******",id)
  // console.log("type of delete one user",typeof(id))
  const response = await User.findByIdAndDelete(id);
  console.log("DELETE USER:",response)
  if (response) {
    return response;
  } else {
    return { message: "User not found" };
  }
};

// Delete posts associated with the user
export const deletePostsByUser = async (userId) => {
  try {
    const response = await Post.deleteMany({ user: userId });
    console.log("DELETE USER POST:", response);
    return response;
  } catch (error) {
    console.error("An error occurred while deleting posts by user:", error);
    return { message: "An error occurred while deleting posts by user" };
  }
};



