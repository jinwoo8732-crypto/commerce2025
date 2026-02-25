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
      from: `"견적 시스템" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `견적 요청 - ${orderNo}`,
      html: `
        <h2>새 견적 요청</h2>
        <p>이름: ${name}</p>
        <p>연락처: ${phone}</p>
        <p>이메일: ${email}</p>
        <p>총 금액: ${total}원</p>
        <p>주문번호: ${orderNo}</p>
        <p>상품:</p>
        <pre>${items}</pre>
      `
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
