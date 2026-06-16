const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connection Successful");
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;