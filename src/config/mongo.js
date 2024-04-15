import mongoose, { mongo } from 'mongoose';

const connectDB = async() =>{
    try{
        // await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connect("mongodb+srv://sanjuna:sanjuna@cluster0.it5a6dp.mongodb.net/mernApp?retryWrites=true&w=majority");
        console.log('Database Connected');
    }catch(err){
        console.log(err);
    }
}

export default connectDB;

