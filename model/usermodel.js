import mongoose from "mongoose";
const {Schema}= mongoose;
const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    // role: {type: String, default: 'user'},
    // cart: [{
    //     productId: {type: Schema.Types.ObjectId, ref: 'Product'},
    //     quantity: {type: Number, default: 1}
    // }]
})
const User = mongoose.model("user",UserSchema);
export default User;