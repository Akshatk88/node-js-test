const mongoose = require('mongoose');

const connectDB   = async () => {
    try{
        const uri = process.MONGO_URI || "mongodb://localhost:27017/Jwt_refresh"
        await mongoose.connect(uri, {
            userNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("mongoDB connected successfully");
    }   catch (err) {
        console.log("mongoDB not connected",err.message);
        process.exit(1);
    }
};

module.exports = connectDB;