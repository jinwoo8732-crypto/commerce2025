import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { orderNo, name, phone, total } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.naver.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `새 견적 접수 - ${orderNo}`,
      text: `
주문번호: ${orderNo}
고객명: ${name}
연락처: ${phone}
총금액: ${Number(total).toLocaleString()}원
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("메일 발송 실패:", error);
    return res.status(500).json({ error: "메일 발송 실패" });
  }
}
