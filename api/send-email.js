export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { orderNo, name, phone, total } = req.body;

  try {

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "견적시스템 <onboarding@resend.dev>",
        to: "jinu8732@naver.com",
        subject: `새 견적 접수 - ${orderNo}`,
        html: `
          <h2>새 견적 접수</h2>
          <p><strong>주문번호:</strong> ${orderNo}</p>
          <p><strong>고객명:</strong> ${name}</p>
          <p><strong>연락처:</strong> ${phone}</p>
          <p><strong>총금액:</strong> ${total.toLocaleString()} 원</p>
        `
      })
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "메일 발송 실패" });
  }
}
