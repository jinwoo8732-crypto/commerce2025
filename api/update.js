

import nodemailer from "nodemailer";

export default async function handler(req, res) {

  const { email, orderNo, status } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"프로파일커머스자동견적" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `견적 상태 변경 - ${orderNo}`,
    html: `<h3>견적 상태가 "${status}" 로 변경되었습니다.</h3>`
  });

  res.status(200).json({ success: true });
}
