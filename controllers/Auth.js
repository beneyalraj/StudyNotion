const user = require("../models/User");
const OTP = require("../models/OTP");
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt");

//create a OTP and send
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(401).jsaon({
        success: false,
        message: "User already exists",
      });
    }

    const otp = otpgenerator.generate(6, {
      LowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log("opt generated: ", otp);

    //check unique or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      const otp = otpgenerator.generate(6, {
        LowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //saving the otp in db
    const otpbody = await opt.create(otpPayload);
    console.log(otpbody);

    res.status(200).json({
      success: true,
      message: "message sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    //fetching all data
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    //make sure no fields are empty

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Enter values in all required fields",
      });
    }
    //check if passwords match in confirm password
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Passwords do not match, Please try again",
      });
    }
    //check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. login to that account",
      });
    }
    //find the most recent otp sent to the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    // check if otp is null
    if (recentOtp == NULL) {
      return res.status(400).json({
        success: false,
        message: "otp is not precent, enter otp",
      });
    }
    //if otp doesnt not match with recent otp
    else if (otp !== recentOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create entry in db
    const profileDetails = await profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactnumber: null,
    });

    const User = await User.create({
      firstname,
      lastname,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} &{lastname}`,
    });

    //return respose

    return res.status(200).json({
      success: true,
      message: "sign up successful",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, try again",
    });
  }
};

//LOGIN
exports.login = async (req, res) => {
  try {
    //get credentials from the body
    const { email, password } = req.body;

    //see if both values are null or not
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Fill all the fields",
      });
    }

    //check user exists are not
    const user = user.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesnt exist, Please signup",
      });
    }

    //create a jwt token if password match
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie
      const options = {
        expires: new Date(Date.now(3 * 24 * 60 * 60 * 1000)),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: true,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "login failed try again ",
    });
  }
};

// exports.changePassword = async (req, res) => {
//   try {
//     //get data from request body
//     const { oldPassword, newPassword, confirmPassword } = req.body;
//     //validate is above values are not empty
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       return res.status(401).json({
//         success: false,
//         message: "all fields are mandatory fill them",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//   } catch (error) {}
// };
