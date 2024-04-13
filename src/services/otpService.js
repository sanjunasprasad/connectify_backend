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
                user: "sanjunasprasad@gmail.com",
                pass: "hgbexrtifxmyakpd",
            },
    });

    const mailOptions = {
      from: 'connectify@gmail.com',
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
