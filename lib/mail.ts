import nodemailer from "nodemailer";

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"BetterStreaming" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your verification code is: ${otp}`,
  });
  console.log(otp);
  console.log("✅ Email sent:", info.messageId);
};
