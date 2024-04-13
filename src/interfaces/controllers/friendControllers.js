import Post from "../../entities/postModel.js";
import User from "../../entities/userModel.js";

// friend profile, post, post modal
export const getUserAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    const posts = await Post.find({ user: userId })
      .populate('user', 'firstName image')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          model: 'User',
          select: 'firstName image',
        },
      });
    
    const userDataWithPosts = {
      user: user,
      posts: posts,
    };
    
    res.status(200).json(userDataWithPosts);
  } catch (error) {
    console.error("Error fetching user details and posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getfollowersandfollowing = async(req,res)=>{
  try {
    const  userId  = req.params.id;
    // console.log("logged user id",userId)
    const user = await User.findById(userId)
    .populate('followers', 'firstName lastName image')
    .populate('following', 'firstName lastName image');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const followers = user.followers.map(follower => ({
      _id: follower._id,
      firstName: follower.firstName,
      lastName: follower.lastName,
      image: follower.image
    }));

    const following = user.following.map(followedUser => ({
      _id: followedUser._id,
      firstName: followedUser.firstName,
      lastName: followedUser.lastName,
      image: followedUser.image
    }));

   res.json({ followers, following });
    // console.log("res is:",followers,following)
  }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const followUser = async (req, res) => {
  const userId = req.params.id;
  // console.log("friend id",userId)
  const { loggeduser } = req.body;
  // console.log("loggeduser id",loggeduser)
  console.log;
  try {
    const user = await User.findById(userId); //friend
    if (user.followers.includes(loggeduser)) {
      return res.status(400).send("You are already following this user");
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: loggeduser },
      });
      await User.findByIdAndUpdate(loggeduser, {
        $addToSet: { following: userId },
      });
      res.status(200).send("Followed successfully");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const unfollowUser = async (req, res) => {
  const userId = req.params.id;
  // console.log("friend id",userId)
  const { loggeduser } = req.body;
  // console.log("loggeduser id",loggeduser)

  try {
    const user = await User.findById(userId);
    if (!user.followers.includes(loggeduser)) {
      return res.status(400).send("You are not following this user");
    } else {
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: loggeduser },
      });
      await User.findByIdAndUpdate(loggeduser, {
        $pull: { following: userId },
      });
      res.status(200).send("Unfollowed successfully");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const suggetionList = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log("my id",userId)
    const user = await User.findById(userId);
    const followingList = user.following;
    // console.log("iam following them:",followingList)
    const suggestionUsers = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Exclude the current user
        { _id: { $nin: followingList } } // Exclude users in the following list
      ]
    });
    // console.log("suggestion users is+++++++++++",suggestionUsers)
    res.json(suggestionUsers);
  } catch (error) {
    console.error('Error fetching suggestion list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const reportProfile = async(req,res) =>{
  const userId = req.params.id;
  // console.log("friend id",userId)
  const { loggeduser } = req.body;
  // console.log("loggeduser id",loggeduser)
  const {reason} = req.body
  // console.log("reason",reason)

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the loggeduser has already reported this user
    const existingReport = user.reports.find(report => report.reportedBy.equals(loggeduser));
    if (existingReport) {
      return res.status(400).json({ message: "You have already reported this profile" });
    }

    // Update the user's reports array
    user.reports.push({ reportedBy: loggeduser, reason });
    await user.save();

    res.status(200).json({ message: "Profile reported successfully" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }

}
