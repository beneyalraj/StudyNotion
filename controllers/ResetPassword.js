const User = require("../models/User");
const mailsender = require("../utils/MailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from body
    const email = req.body.email;

    //check user exist and do validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "You are not registered with us, please signup",
      });
    }
    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiry time
    const updatedUser = await user.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExperies: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `http:localhost:3000/update-password/${token}`;

    //send email
    await mailsender(
      email,
      "Resert Password Link",
      `Reset Password Link @{url}`
    );

    //return respose
    return res.status(200).json({
      success: true,
      message: "Email sent successfully please check email and change password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
};

//resetPassword
exports.resetPassword = async (req, res) => {
  try {
    //get the values
    const { password, confirmPassword, token } = req.body;
    //validate
    if(password !== confirmPassword){
        return res.json({
            success:false,
            message:"password is not matching",
        });
    }
    //get user details from db
    const userDetails = await User.findOne({token:token});

    //if no entry ie invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:"invalid token"
        });
    }

    //token time check
    if(userDetails.resetPasswordExperies < Date.now()){
        return res.json({
            success:false,
            message:"Token has expired, generate a new one"
        });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password,10);

    //update the response
    await user.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    )

    return res.status(200).json({
        success:true,
        message:"password reset successful",
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"something went wrong while sending password reset email"
    })
  }
};

