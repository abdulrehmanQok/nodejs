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
export const GetUser=async(req,res)=>{
    try {
        const detail=await User.find();
        res.status(200).json({
            message:"user details",
            detail
        })
        
    } catch (error) {
        res.status(401).json({
            message:"error getting user details",
            error
        })
        
    }
}
export const UpdateUser=async(req,res)=>{
    try {
        const {id}=req.params;
        const Updateinfo=req.body;
        const Updatedetail=await User.findByIdAndUpdate(id,Updateinfo);
        res.status(200).json({
            message:"user details updated",
            Updatedetail
        })
        
    } catch (error) {
        res.status(401).json({
            message:"error updating user details",
            error
        })
        
    }
}
export const DeleteUser= async(req,res)=>{
    try {
        const {id}=req.params;
        const deleteUser=await User.findByIdAndDelete(id);
        res.status(200).json({
            message:"user deleted successfully",
            deleteUser
        })
        
    } catch (error) {
        res.status(500).json({
            message:"error deleting user",
            error
        })
        
    }

}


