import User from "../model/usermodel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { redis } from "../middleware/redis.js";

// Token generation code
const generatetoken = (userid) => {
    const accesstoken = jwt.sign({ userid }, process.env.secretkey1, { 
        expiresIn: '15m' 
    });
    const refreshtoken = jwt.sign({ userid }, process.env.secretkey, { 
        expiresIn: '7d' 
    });
    return { accesstoken, refreshtoken };
}

// Cookie setting code
const setCookies = (res, refreshtoken, accesstoken) => {
    res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        // secure: process.env.Node_env === 'production',
        // sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.cookie("accesstoken", accesstoken, {
        httpOnly: true, // Only accessible via HTTP, not JavaScript
        maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });
}
//  for storing token 
const storetoken = async(userid, refreshtoken)=>{
  await redis.set("refreshtoken", refreshtoken)
  // await redis.set(refreshtoken,JSON.stringify(userid));

}
// create
export const register = async (req, res) => {
    try {
        const userinfo = req.body;
        const { name, email, password } = userinfo;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                message: "email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate tokens
        const { refreshtoken, accesstoken } =generatetoken(user._id);

        // Set cookies
        setCookies(res, refreshtoken, accesstoken);

        await  storetoken(user._id, refreshtoken)
        res.status(200).json({
            message: "user created successfully",
            user
        });
    } catch (error) {
        res.status(401).json({
            message: "error registering user",
            error
        });
    }
}

// To READ
export const GetUser = async (req, res) => {
    try {
        const detail = await User.find();
        res.status(200).json({
            message: "user details",
            detail
        });
    } catch (error) {
        res.status(500).json({
            message: "error getting user details",
            error
        });
    }
}

// To Update
export const UpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateinfo = req.body;
        const updatedetail = await User.findByIdAndUpdate(id, updateinfo);
        res.status(200).json({
            message: "user details updated successfully",
            updatedetail
        });
    } catch (error) {
        res.status(500).json({
            message: "error updating user details",
            error
        });
    }
}

// To Delete
export const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteuser = await User.findByIdAndDelete(id);
        res.status(200).json({
            message: "user deleted successfully",
            deleteuser
        });
    } catch (error) {
        res.status(500).json({
            message: "error deleting user",
            error
        });
    }
}

// Login 
export const login = async (req, res) => {
    try {
        const user = req.body;
        const { email, password } = user;
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "invalid credentials"
            });
        }

        

        // Set cookies
        setCookies(res, refreshtoken, accesstoken);

        res.status(200).json({
            message: "User logged in successfully",
            user: userExist
        });
    } catch (error) {
        res.status(401).json({
            message: "error logging in user",
            error
        });
    }
}