import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const { name, phone, email, items, total, orderNo } = req.body;

    await transporter.sendMail({
      from: `"프로파일커머스자동견적" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `📩 새 견적 요청 - ${orderNo}`,
      html: `
        <h2>새 견적 요청</h2>
        <p><b>이름:</b> ${name}</p>
        <p><b>연락처:</b> ${phone}</p>
        <p><b>이메일:</b> ${email}</p>
        <p><b>총 금액:</b> ${total}원</p>
        <pre>${items}</pre>
      `
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
