import User from  '../entities/userModel.js'
import Post from  '../entities/postModel.js'


//user registration
export const saveUser = async (firstName, lastName, phoneNo, email, password, is_blocked,status) => {
    const user = new User({ firstName, lastName, phoneNo, email, password,is_blocked, status});
    return  user.save();
    
}

//from login to verify token
export const checkUser = async (email) => {
    const existingUserData = await User.findOne({email:email});
    // console.log("from repo existingUserData:",existingUserData)
    return existingUserData;
}


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
    return await User.find().lean();
  };



  //from user to edit
  export const updateUser = async (id, userData, image) => {
    try {
      const { firstName, lastName, phoneNo, email, password, bio, location } = userData;
      const updateData = { firstName, lastName, phoneNo, email, password, bio, location };
      if (image) {
        updateData.image = image;
      }
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } catch (err) {
      console.log(err);
      throw err; // Re-throw the error for handling in the usecase layer
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
  const response = await Post.deleteMany({ user: userId });
  console.log("DELETE USER POST:",response)
  return response;
};


