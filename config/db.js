const mongoose=require('mongoose');
const connectDB=async() => {
    const MONGO_URI=process.env.MONGO_URL||process.env.MONGO_URI;
    if(!MONGO_URI){
        console.error('Error: Neither MONGO_URL nor MONGODB_URI is not available');
        process.exit(1);//to close connection


    }
    try{
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB successfully');
    }
    catch(err){
        console.error('Failed to connect to MONGODB:',err.message);
        process.exit(1);
    }
};
module.exports=connectDB