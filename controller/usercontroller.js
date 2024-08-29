import User from "../model/usermodel.js";

export const register = async(req,res)=>{
try {
    const userinfo = req.body;
    const user = await User.create(userinfo)
    res.status(200).json({
        message:"user created successfully",
        user
    })
} catch (error) {
    res.status(401).json({
        message:"error registering user",
        error
    })
}


}