const jwt = require("jsonwebtoken");
require("dotenv").config();
const user = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookie.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "invalid token",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while creating a token",
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route only for Students",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be verified, try again",
    });
  }
};


//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
      if (req.user.accountType !== "Instructor") {
        return res.status(401).json({
          success: false,
          message: "This is a protected route only for Instructors",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User cannot be verified, try again",
      });
    }
  };


  //isAdmin

  exports.isAdmin = async (req, res, next) => {
    try {
      if (req.user.accountType !== "Admin") {
        return res.status(401).json({
          success: false,
          message: "This is a protected route only for Admin",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User cannot be verified, try again",
      });
    }
  };