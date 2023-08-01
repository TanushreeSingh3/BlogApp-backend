import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";

export const getAllBlogs = async(req , res , next)=>{
    let blogs;
    try{
        blogs= await Blog.findOne();

    }catch(err){
        console.log("error");
    }
    if(!blogs){
        res.status(404).json({message:"No blogs found"});
    }
    return res.status(200).json({blogs});
}

export const addBlog = async(req,res,next)=>{
    const {title,description,image,user} = req.body;


    let exisistingUser;
    try{
        exisistingUser = await User.findById(user);
    }catch(err){
        console.log("error");
    }
    if(!exisistingUser){
        return    res.status(404).json({message:"No user found"});

    }
    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    try{
       const session = await mongoose.startSession();
       session.startTransaction();
       await blog.save({session});
       exisistingUser.blogs.push(blog);
       await exisistingUser.save({session});
       await session.commitTransaction();

    }catch(err){
        console.log("error");
        return res.status(500).json({message:"err"});
    }
    res.status(200).json({blog})
}

export const updateBlog = async(req,res,next)=>{
    const { title,description} = req.body;
    const blogId = req.params.id;
    
    let blog ;
    try{
        blog = await Blog.findByIdAndUpdate(blogId,{
            title,
            description
        })

    }catch(err){
        console.log("error");
    }
    if(!blog){
        return res.status(500).json({message:"Unable to update the blog"});
    }
    return res.status(200).json({blog});
    
};

export const getById = async(req,res,next)=>{
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id);
    }catch(err){
        console.log("error");
    }
    if(!blog){
        return res.status(404).json({message:"No blog found"});
    }
    return res.status(200).json({blog});

};

export const deleteBlog = async(req,res,next)=>{
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndRemove(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err){
        console.log("error");
    }
    if(!blog){
        return res.status(404).json({message:"No blog found"});
    }
    return res.status(200).json({message:"successfully deleted"});
}

export const getUserById = async(req,res,next)=>{
    let userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blogs");
    }catch(err){
        console.log("error");
    }
    if(!userBlogs){
        return res.status(404).json({message:"No blog found"});
    }
    return res.status(200).json({blog:userBlogs});
}