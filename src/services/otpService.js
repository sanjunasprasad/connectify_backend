import nodemailer from 'nodemailer';
import * as brevo from '@getbrevo/brevo';
import dotenv from "dotenv";


// Load environment variables
dotenv.config();


export const generateOTP = () => {
 return Math.floor(1000 + Math.random() * 9000);
};


//googlemail
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
     from: process.env.EMAIL_USER,
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


// brevo
const apiInstance = new brevo.TransactionalEmailsApi();
const key = process.env.BREVO_KEY;
apiInstance.setApiKey(
 brevo.TransactionalEmailsApiApiKeys.apiKey,
 key
);


export const sendOTPByBravo = async (email, otp) => {
 console.log("Generated OTP:", otp);
 console.log("Sending email to:", email);


 try {
   const sendSmtpEmail = new brevo.SendSmtpEmail();
  
   sendSmtpEmail.subject = "Your Verification OTP - Connectify";
   sendSmtpEmail.to = [{ email: email }];
   sendSmtpEmail.htmlContent = `
     <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
       <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
         <h1 style="color: white; margin: 0; font-size: 24px;">Connectify</h1>
       </div>
       <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
         <h2 style="color: #333; margin-top: 0;">Email Verification</h2>
         <p style="font-size: 16px; color: #666;">Your verification code is:</p>
         <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
           <h1 style="color: #4F46E5; letter-spacing: 10px; margin: 0; font-size: 36px; font-weight: bold;">${otp}</h1>
         </div>
         <p style="color: #666; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
         <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
           If you didn't request this code, please ignore this email.
         </p>
       </div>
     </div>
   `;
   sendSmtpEmail.sender = {
     name: "Connectify",
     email: "sanjunasprasad796@gmail.com"
   };


   const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
   console.log("✅ OTP sent successfully:", data);
   return data;
 } catch (error) {
   console.error("❌ Brevo Error:", error);
   if (error.response) {
     console.error("Error details:", error.response.body);
   }
   throw error;
 }
};
