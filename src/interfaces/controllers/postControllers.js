import Post from "../../entities/postModel.js";
import User from "../../entities/userModel.js";



export const createPost = async (req, res) => {
  try {
    const { caption, userId ,postUrl} = req.body;
    console.log("User Data:", userId);
    console.log("caption:", caption);
    console.log("post url :", postUrl);
    const newPost = new Post({
      caption:caption,
      file: postUrl,
      user: userId,
    });
    const savedPost = await newPost.save();
    console.log("after saving:",savedPost)
    return res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error 222" });
  }
};


//load our post
export const loadownPost = async (req, res) => {
  try {
     const {userId} = req.query;
    // console.log("my id",userId)
    const posts = await Post.find({user: userId})
    .populate('user', 'firstName image') 
    .populate('comments.user', 'firstName image')
    console.log("list ofposts:",posts)
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//load restricted post
export const loadPost = async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log("my id",userId)
    const following = JSON.parse(req.query.following);
    // console.log("i am following them",following)
    const posts = await Post.find({
      $or: [{ user: userId }, { user: { $in: following } }],
    }).populate("user")
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'firstName image', 
      },
    }).populate({
      path: 'likes',
      populate: {
        path: 'user',
        select: 'firstName  lastName image', 
      },
    });
    // console.log("selected posts:",posts)
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//post like,unlike
export const likePost = async (req, res) => {
  const id = req.params.postid;
  // console.log("postid",id)
  const { userId } = req.body;
  // console.log("user id",userId)
  try {
    const post = await Post.findById(id);
    // console.log("1111111post",userId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isLiked = post.likes.some(like => like.user.toString() === userId);
    if (isLiked) {
     const response = await Post.findByIdAndUpdate(id, { $pull: { likes: { user: userId } } });
    //  console.log("dddddddislike",response)
      res.status(200).json({ message: 'Post disliked' });
    } else {
      const response = await Post.findByIdAndUpdate(id, { $push: { likes: { user: userId } } });
      // console.log("lllllllllike",response)
      res.status(200).json({ message: 'Post liked' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


//load likedpeople
export const likedUsers = async(req,res) =>{
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate('likes.user', 'firstName lastName image');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const likedUsers = post.likes.map(like => like.user);
    res.status(200).json({ likedUsers });
  } catch (error) {
    console.error('Error occurred while fetching liked users:', error);
    res.status(500).json({ error: 'Server error' });
  }
}




//comment post
export const commentPost = async (req, res) => {
  try {
    const postId = req.params.postid;
    const { userId, comment } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = {
      user: userId,
      text: comment,
    };
    post.comments.push(newComment);
    await post.save();
    // res.status(201).json({ message: 'Comment added successfully' });
    res.status(200).json({
      postId: postId,
      userId: userId,
      commentId: newComment._id,
      comment: comment,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//delete our post
export const deletePost = async (req, res) => {
  try {
    const PostId = req.params.postId;
    console.log("post id from params", PostId);
    const post = await Post.findById(PostId);
    console.log("post details", post);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    await Post.findByIdAndDelete(PostId);
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res
      .status(500)
      .send({ message: "An error occurred while deleting the post" });
  }
};

//save post
export const savedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log("post id from params", postId);
    const { userId } = req.body;
    console.log("LOGGED USER ID",userId)
    const user = await User.findById(userId);
    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: "Post already saved" }); 
    }
    user.savedPosts.push(postId);
    await user.save();
    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



//get saved post.
export const getSavedPost = async(req, res) => {
  try {
    const userId = req.params.userId;
    console.log("user id is", userId);
    const user = await User.findById(userId).populate('savedPosts');
    const savedPosts = user.savedPosts.map(async (post) => {
      const postWithUserInfo = { ...post._doc };
      const postUser = await User.findById(post.user);
      console.log('owner of Post user:', postUser);
      postWithUserInfo.username = postUser.firstName;
      postWithUserInfo.userPhoto = postUser.image; 
   

      // Fetch names and images of users who commented on this post
      const populatedComments = await Promise.all(post.comments.map(async (comment) => {
        const commentUser = await User.findById(comment.user);
        if (commentUser) { // Check if commentUser is not null
          return {
            ...comment._doc,
            username: commentUser.firstName,
            userPhoto: commentUser.image,
          };
        } else {
          return null; // or handle as per your application's logic
        }
      }));
      postWithUserInfo.comments = populatedComments.filter(comment => comment !== null); // Remove null values

      return postWithUserInfo;
    });
    const populatedSavedPosts = await Promise.all(savedPosts);
    // console.log("Saved postsssss", populatedSavedPosts);
    res.status(200).json(populatedSavedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}



export const unSavePost = async(req,res) =>{
  try {
    const { userId, postId } = req.body; 
    console.log("useri,postid",userId,postId)
    if (!userId || !postId) {
      return res.status(400).json({ error: 'User ID and post ID are required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.savedPosts.pull(postId);
    const response = await user.save();
    // console.log("unsaveeee",response)
    return res.status(200).json({ message: 'Post unsaved successfully' });
  } catch (error) {
    console.error('Error unsaving post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


export const editPost = async(req,res) =>{
  try {
    const postId = req.params.postId;
    const { caption } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(postId, { caption }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post caption updated successfully", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}



