import Post from  '../entities/postModel.js'


export const savepost =async() =>{
    console.log("reached end")
    const post = new Post ({
        caption,
        file,
        postedBy,
        likes,
        comments,
        savedBy,
        createdAt})
    return post.save()
  
}