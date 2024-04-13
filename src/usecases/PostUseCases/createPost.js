// import { savepost } from "../../repositories/postRepository.js";
import cloudinary from "../../config/cloudinary.js"
import Post from  '../../entities/postModel.js'

export const savePost = async(caption,file) =>{
    try{
           // Upload file to Cloudinary
            const folder = 'posts_folder';
            const cloudinaryResponse = await cloudinary.uploader.upload(file.path,{folder: folder});
        
            // Save post data to MongoDB
            const newPost = new Post({
              caption,
              file: cloudinaryResponse.secure_url 
            });
            await newPost.save();
            return res.status(201).send('Post created successfully');
    }
    catch(error){
        console.log(10000)
       console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}
   