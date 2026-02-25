import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Writable } from "stream";

export default async function handler(req, res) {

  const { name, email, total, orderNo, items } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const doc = new PDFDocument();
  let buffers = [];
  doc.pipe(new Writable({
    write(chunk, encoding, callback) {
      buffers.push(chunk);
      callback();
    }
  }));

  doc.fontSize(18).text("프로파일커머스자동견적", { align: "center" });
  doc.moveDown();
  doc.text(`주문번호: ${orderNo}`);
  doc.text(`고객명: ${name}`);
  doc.text(`총 금액: ${total}원`);
  doc.moveDown();
  doc.text("상품 내역:");
  doc.text(items);
  doc.end();

  doc.on("end", async () => {

    const pdfBuffer = Buffer.concat(buffers);

    await transporter.sendMail({
      from: `"프로파일커머스자동견적" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `견적 접수 완료 - ${orderNo}`,
      html: `
        <h3>${name}님 견적 접수 완료되었습니다.</h3>
        <p>주문번호: ${orderNo}</p>
        <p>총 금액: ${total}원</p>
      `,
      attachments: [
        {
          filename: `견적서_${orderNo}.pdf`,
          content: pdfBuffer
        }
      ]
    });

    res.status(200).json({ success: true });

  });
}
