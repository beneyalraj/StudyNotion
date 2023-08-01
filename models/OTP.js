const mongoose = require("mongoose");
const mailSender = require("../utils/MailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});


async function sendVerificationEmail (email,otp){
    try{
        const mailResponse = await mailSender(email, "verification email for studynotion", otp);
        console.log("Email sent successfully" , mailResponse);
    }
    catch(error){
        console.log("Error while sending email", error);
        throw error;
    }
}

otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema);
