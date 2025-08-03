import bcrypt from 'bcrypt';
import Profile from '../models/profile.model.js';
export const activeCheck = async (req, res) => {
    res.status(200).json({
        message: "Running"
    });
}


export const register = async (req,res)=>{
    try {
        const {name,email,password,username} = req.body;
        if(!name || !password  || !username  || !email) return res.status(400).json({message:"All fields are required"})
        const user = await User.findOne({
            email
        });
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            email,
            password : hashedPassword,
            username
        })
        await newUser.save();

        const profile = new Profile({userId:newUser._id});

        return res.json({message: "User register successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
