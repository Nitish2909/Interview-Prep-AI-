const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {});
    console.log("Database connected Successfully");
  } catch (error) {
    console.error("Error conneting to database", error);
    process.exit(1);
  }
};

module.exports = connectDB;
