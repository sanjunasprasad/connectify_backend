
import { getAll } from "../../repositories/adminRepository.js"


export const getFormattedPosts = async() =>{
    try {
      const posts = await getAll(); 
      // console.log("Posts from getAll():", posts);
      if (!posts || posts.length === 0) {
        throw new Error('No posts found'); 
    }
         return posts.map(post => {
          const totalLikes = post.likes.length;
          const totalComments = post.comments.length;
          const postedUser = post.user.firstName + ' ' + post.user.lastName;
          const postedUserImage =  post.user.image
          const postedDate = post.createdAt;
    
          return {
            _id: post._id,
            caption: post.caption,
            file: post.file,
            totalLikes,
            totalComments,
            postedUser,
            postedUserImage,
            postedDate
          };
        });
       
      } catch (error) {
        throw new Error('Error while formatting posts');
      }

}