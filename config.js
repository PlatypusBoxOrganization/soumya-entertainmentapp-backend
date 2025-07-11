const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //await mongoose.connect("mongodb://localhost:27017/local", {
      await mongoose.connect("mongodb+srv://soumyadev:Soumya%401234@cluster0.qfonr.mongodb.net/entertainmentDB?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
