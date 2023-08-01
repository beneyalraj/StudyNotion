const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedToplogy: true,
    })
    .then(() => console.log("database connection successfull"))
    .catch((error) => {
      console.log("database connecection error");
      console.error(error);
      process.exit(1);
    });
};
