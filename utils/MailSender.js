const nodeMailer = require("nodemailer");

const mailSender = async(async (email, title, body) => {
  try {
    let transporter = nodeMailer.Transporter({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "StudyNotion || Abi beniyal",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
    
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = mailSender;
