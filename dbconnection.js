import mongoose from 'mongoose';
const dbconnection=async()=>{
    try{
        mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log(`Connected to MongoDB ${res.connection.host}`);
    } catch(error){
        console.error(`Error connecting to MongoDB: ${error.message}`);

    }


}
export default dbconnection;