import Post from  '../entities/postModel.js'


export const savePost = async () => {
    try {
      console.log("reached end");
      const post = new Post({
        caption,
        file,
        postedBy,
        likes,
        comments,
        savedBy,
        createdAt
      });
      return post.save();
    } catch (error) {
      console.error("An error occurred while saving the post:", error);
      return { message: "An error occurred while saving the post" };
    }
  };
  