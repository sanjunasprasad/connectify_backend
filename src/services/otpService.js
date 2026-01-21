import nodemailer from 'nodemailer';

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); 
};

export const sendOTPByEmail = async (email, otp) => {
    console.log("generated otp from fn:",otp);
    console.log("sented mail from fn:",email)
  try {
    const transporter = nodemailer.createTransport({
      // Configure Nodemailer to use your email service provider
      service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
              connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: 'process.env.EMAIL_USER',
      to: email,
      subject: 'Verification OTP',
      text: `Your OTP for email verification is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};
