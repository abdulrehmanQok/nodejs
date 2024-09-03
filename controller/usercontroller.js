import User from "../model/usermodel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { redis } from "../middleware/redis.js";

// Token generation code using user id
const generatetoken = (userid) => {
    const accesstoken = jwt.sign({ userid }, process.env.secretkey1, { 
        expiresIn: '15m' 
    });
    const refreshtoken = jwt.sign({ userid }, process.env.secretkey, { 
        expiresIn: '7d' 
    });
    return { accesstoken, refreshtoken };
}
//generate token using user email
const generatetoken_user_email = (useremail) => {
    const accesstoken_user_email = jwt.sign({ useremail }, process.env.secretkey1, { 
        expiresIn: '15m' 
    });
    const refreshtoken_user_email = jwt.sign({ useremail }, process.env.secretkey, { 
        expiresIn: '7d' 
    });
    return { accesstoken_user_email, refreshtoken_user_email };
}
//generate token using user password
const generatetoken_user_password = (userpassword) => {
    const accesstoken_user_password = jwt.sign({ userpassword }, process.env.secretkey1, { 
        expiresIn: '15m' 
    });
    const refreshtoken_user_password = jwt.sign({ userpassword }, process.env.secretkey, { 
        expiresIn: '7d' 
    });
    return { accesstoken_user_password, refreshtoken_user_password };
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


// Cookie setting code using user email
const setCookies_user_email = (res, refreshtoken_user_email, accesstoken_user_email) => {
    res.cookie("refreshtoken using user email", refreshtoken_user_email, {
        httpOnly: true,
        // secure: process.env.Node_env === 'production',
        // sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.cookie("accesstoken using user email", accesstoken_user_email, {
        httpOnly: true, // Only accessible via HTTP, not JavaScript
        maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });
}
// Cookie setting code using user password
const setCookies_user_password = (res, refreshtoken_user_password, accesstoken_user_password) => {
    res.cookie("refreshtoken using user password", refreshtoken_user_password, {
        httpOnly: true,
        // secure: process.env.Node_env === 'production',
        // sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.cookie("accesstoken using user password", accesstoken_user_password, {
        httpOnly: true, // Only accessible via HTTP, not JavaScript
        maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });
}
//  for storing token 
const storetoken = async(userid, refreshtoken)=>{
  await redis.set("refreshtoken", refreshtoken)
  // await redis.set(refreshtoken,JSON.stringify(userid));

}
//  for storing token using user email
const storetoken_user_email = async(useremail, refreshtoken_user_email)=>{
    await redis.set("refreshtoken using user email", refreshtoken_user_email)
    // await redis.set(refreshtoken,JSON.stringify(userid));
  
  }
  //  for storing token using user email
const storetoken_user_password = async(userpassword, refreshtoken_user_password)=>{
    await redis.set("refreshtoken using user password", refreshtoken_user_password)
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

        // Generate tokens using user id
        const { refreshtoken, accesstoken } =generatetoken(user._id);
        //generate token using user email
       const{refreshtoken_user_email,accesstoken_user_email}= generatetoken_user_email(user.email);
       //generate token using user password
       const{refreshtoken_user_password,accesstoken_user_password}= generatetoken_user_password(user.password);

        // Set cookie using user id
        setCookies(res, refreshtoken, accesstoken);
        // set cookie using user email
        setCookies_user_email(res, refreshtoken_user_email, accesstoken_user_email);
         // set cookie using user password
         setCookies_user_password(res, refreshtoken_user_password, accesstoken_user_password);


        await  storetoken(user._id, refreshtoken)
        await  storetoken_user_email(user.email, refreshtoken)
        await  storetoken_user_password(user.password, refreshtoken)

        res.status(200).json({
            message: "user created successfully",
            user
        });
        await  storetoken_user_email(user._id, refreshtoken_user_email)
        res.status(200).json({
            message: "user created successfully using email",
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