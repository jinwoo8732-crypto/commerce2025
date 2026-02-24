export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 🔎 환경변수 체크 (디버그용)
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY 없음");
    return res.status(500).json({ error: "RESEND_API_KEY not found" });
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
        from: "onboarding@resend.dev",   // 무료 테스트용 발신자
        to: "jinu8732@naver.com",        // ✅ 실제 받을 이메일
        subject: `새 견적 접수 - ${orderNo}`,
        html: `
          <h2>새 견적 접수</h2>
          <p><strong>주문번호:</strong> ${orderNo}</p>
          <p><strong>고객명:</strong> ${name}</p>
          <p><strong>연락처:</strong> ${phone}</p>
          <p><strong>총금액:</strong> ${Number(total).toLocaleString()} 원</p>
        `
      })
    });

    const data = await response.json();

    // 🔎 Resend 응답 로그 출력
    console.log("Resend Response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Resend API Error",
        details: data
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("메일 발송 실패:", error);
    return res.status(500).json({ error: "메일 발송 실패" });
  }
}
