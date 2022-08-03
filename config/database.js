const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI, {
      usenewUrlParser: true,
      useUnifiedTopology: false,
      // useCreateIndex: true,
      // useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("Database connection failed. Exiting...");
      console.log(error);
      process.exit(1);
    });
};
