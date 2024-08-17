require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URL

exports.connectToDatabase = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}` )
    } catch (error){
        console.log("Error connecting to Database", error.message)
        process.exit(1) // 1 failure, 0 success
    };
}