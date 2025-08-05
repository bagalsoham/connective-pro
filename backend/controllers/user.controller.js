import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import PDFDocument from 'pdfkit';
import fs, { stat } from 'fs';
import crypto from 'crypto';
import ConnectionRequest from "../models/connections.model.js";
import { measureMemory } from "vm";

const convertUserdataToPdf = async (userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const fullPath = "uploads/" + outputPath;

    const stream = fs.createWriteStream(fullPath);
    doc.pipe(stream);

    // Add null check for profile picture
    if (userData.userId.profilePicture) {
        try {
            doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100 });
        } catch (error) {
            console.log("Error loading profile picture:", error.message);
            // Continue without image if file doesn't exist
        }
    }
    
    doc.fontSize(14).text(`Name: ${userData.userId.name || 'N/A'}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username || 'N/A'}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email || 'N/A'}`);
    doc.fontSize(14).text(`Bio: ${userData.userId.bio || 'N/A'}`);
    doc.fontSize(14).text(`Current Position: ${userData.userId.currentPosition || 'N/A'}`);
    doc.fontSize(14).text("Past Work");

    // Add null check for pastWork array
    if (userData.pastWork && Array.isArray(userData.pastWork)) {
        userData.pastWork.forEach((work) => {
            doc.fontSize(14).text(`Company Name: ${work.companyName || 'N/A'}`);
            doc.fontSize(14).text(`Position: ${work.position || 'N/A'}`);
            doc.fontSize(14).text(`Years: ${work.years || 'N/A'}`);
        });
    } else {
        doc.fontSize(14).text("No past work experience available");
    }

    doc.end();

    return outputPath;
};

export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !password || !username || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id });
        await profile.save();

        return res.status(201).json({ message: "User registered successfully", userId: newUser._id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({ _id: user._id }, { token });

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        user.profilePicture = req.file.filename;
        await user.save();
        return res.json({ message: "Profile picture updated " });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: "User not found " });
        }
        const { username, email } = newUserData;

        // Fixed: should be User.findOne instead of user.findOne
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        // Fixed: logic for checking if existing user is different
        if (existingUser && String(existingUser._id) !== String(user._id)) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        
        Object.assign(user, newUserData);
        await user.save();
        return res.json({ message: "User got updated!" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email username profilePicture');

        return res.json(userProfile);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;
        const userProfile = await User.findOne({ token: token });
        if (!userProfile) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        const profile_to_update = await Profile.findOne({ userId: userProfile._id });
        Object.assign(profile_to_update, newProfileData);
        await profile_to_update.save();

        return res.json({ message: "Updated profile" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');
        return res.json({ profiles });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const downloadProfile = async (req, res) => {
    try {
        const user_id = req.query.id;
        
        // Add validation for user_id
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userProfile = await Profile.findOne({ userId: user_id })
            .populate('userId', 'name username email profilePicture currentPosition bio');

        // Add null check for userProfile
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        // Add null check for populated userId
        if (!userProfile.userId) {
            return res.status(404).json({ message: "User data not found" });
        }

        let outputPath = await convertUserdataToPdf(userProfile);

        return res.json({ "message": "PDF generated successfully", "path": outputPath });
    } catch (error) {
        console.error("Error in downloadProfile:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const sendConnectionRequest = async(req,res)=>{
    const {token,connectionId} = req.body;
    
    try {
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const connectionUser = await User.findOne({_id:connectionId});
        if(!connectionUser){
            return res.status(404).json({message:"Connection not found"})
        }
        const existingRequest = await ConnectionRequest.findOne({
            userId:user._id,
            connectionId:connectionUser._id
        })

        if(existingRequest){
            return res.status(400).json({message:"REquest already sent"})
        }
        const request = new ConnectionRequest({
            userId:user._id,
            connectionId:connectionUser._id
        });
        await request.save();

        return res.json({message:"Connection Request Sent"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }   
}

export const getMyConnectionRequest = async (req,res)=>{
    const{token} =req.body;
    try {
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        const connections = await ConnectionRequest.find({userId:User._id})
        .populate('connectionId','name username email profilePicture');

        return res.json({connections})

    } catch (error) {
        return res.status(500).json({message:"User Not Found"})
    }
}

export const  whatAreMyConnections = async (req,res)=>{
    const {token} =req.body;
    try {
        const user = await User.findOne({token})
        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        const connections =await ConnectionRequest.findOne({connectionId:user._id})
        .populate('userId','name username email profilePicture')

        return res.json({connections})
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export const acceptConnectionRequest = async (req,res)=>{
    const {token,requestId,action_type} =req.body;
    try {
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const connection = await ConnectionRequest.findOne({_id:requestId});
        if(action_type ==='accept'){
            connection.status_accepted =true;
        }
        else{
            connection.status_accepted =false;
        }

        await connection.save();
        return res.json({message:"Request Updated"})
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

