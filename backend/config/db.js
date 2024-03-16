const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    
    const fetched_data = await mongoose.connection.db.collection("users");
    fetched_data.find({}).toArray(function (err, data) {
      if (err) {
        console.error("Error fetching data:", err);
      } else {
        console.log("Fetched data:", data);
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = connectDB;

