import user from "../model/User";
import User from "../model/User";
import bcrypt from "bcryptjs";

export const getAllUser = async(req, res, next)=>{
    let users ;
    try{
        users  = await User.find();
    }catch(err){
        console.log("error");
    }
    if(!users){
        res.status(404).json({message:"No Users Found"});
    }

    return res.status(200).json({users});
};

export const signup = async(req , res , next)=>{
    const{ name , email , password} =req.body;
    let exisistingUser;
    try{
        exisistingUser = await User.findOne({email});

    }catch(err){
        return console.log("error");
    }
    if(exisistingUser){
        return res.status(200).json({message:"User already exists ,login instead"});
    }

    const hashedPassword = bcrypt.hashSync(password);
    
    const user = new User({
        name,
        email,
        password:hashedPassword,
        blogs:[],
    });

   

    try{
       await user.save();
    }catch(err){
        console.log("error");
    }
    return res.status(201).json({user})
};


export const login = async(req,res,next )=>{
    const{  email , password} =req.body;
    let exisistingUser;
    try{
        exisistingUser = await User.findOne({email});

    }catch(err){
        return console.log("error");
    }
    if(!exisistingUser){
        return res.status(404).json({message:"No User  exists ,signup instead"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password,exisistingUser.password);
    if(!isPasswordCorrect){
        return res.status(404) . json({message:"Incorrect password"})
    }

    return res.status(200).json({message:"login successful"})
}

