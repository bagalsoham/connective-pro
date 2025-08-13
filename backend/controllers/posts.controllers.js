import bcrypt from 'bcrypt';
import User from "../models/user.model.js";
import Profile from '../models/profile.model.js';
import Post from '../models/posts.model.js';

export const activeCheck = async (req, res) => {
    res.status(200).json({
        message: "Running"
    });
}

export const createPost = async (req,res)=>{
    const {token} = req.body;
    try {
        const user = await User.findOne({token:token});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const post = new Post({
            userId: user._id,
            body: req.body.body, // Get 'body' text from the form
        
            // If a file is uploaded, get the filename
            media: req.file !== undefined ? req.file.filename : "",
        
            // File type (e.g., image/png, application/pdf) - Fixed: Store as string
            fileType: req.file !== undefined ? req.file.mimetype : "",
        
            // Optional: You can use spread to copy other fields from req.body if needed
            // ...req.body, // ← Use this if there are more fields to copy automatically
        });
        await post.save();

        return res.status(200).json({message:"Post Created"})
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getAllPosts = async(req,res)=>{
    try {
        const posts = await Post.find().populate('userId','name username email profilePicture');
        return res.json({posts})
        
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export const  deletePost = async (req,res)=>{
    const {token,post_id}=req.body;
    try {
        const user = await User.findOne({token:token}).select("_id");
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    const post = await Post.findOne({_id:post_id}); // Fixed: Use _id instead of id
    if(!post){
        return res.status(404).json({message:"Post not found"})
    }
    if(post.userId.toString() !== user._id.toString()){
        return res.status(401).json({message:"Unauthorized"})
    }
    await Post.deleteOne({_id:post_id}); // Fixed: Use deleteOne instead of deletePost
    return res.json({message:"Post Deleted"})
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export const commentPost = async(req,res)=>{
    const{token, post_id,commentBody} =req.body;
    try {
        const user = await User.findOne({token:token}).select("_id");;
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const post = await Post.findOne({
            _id:post_id,
        })

        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        const comment = new Comment({
            userId: user._id,
            postId: post_id,
            comment:commentBody,
        })
        await comment.save();
        return res.status(200).json({message:"Comment Added"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const get_comments_by_post = async (req,res)=>{
    const {post_id} = req.body;

    try {
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        return res.json({message:post.comments})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const delete_comment_of_user = async (req,res)=>{
    const {token,comment_id} = req.body;

    try {
        const user = await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const comment = await Comment.findOne({"_id": comment_id})
        if(!comment){
            return res.status(404).json({message:"Comment not found"})    
        }
        await Comment.deleteOne({"_id":comment_id});
        return res.json({message:"Comment Deleted"})

            
    } catch (error) {
        return res.status(500).json({message:error.message})
    }

}

export const increment_likes = async (req,res)=>{
    const {post_id} = req.body;

    try {
        const post = await Post.findOne({_id:post_id}); // Fixed: Add await
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        post.likes = post.likes + 1;
        await post.save();
        return res.status(200).json({message:"Likes Incremented!"}); // Fixed: Return 200 instead of 500
    } catch (error) {
        return res.status(500).json({message:error.message})
    }

}