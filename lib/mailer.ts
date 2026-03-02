import nodemailer from "nodemailer"
import { Product } from "@/types/product"

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? "465")
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error("SMTP 설정이 누락되었습니다. (.env.local 확인)")
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

function buildReceiptHtml({
  userName,
  product,
  orderId,
  amount,
  purchasedAt,
}: {
  userName: string
  product: Product
  orderId: string
  amount: number
  purchasedAt: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const date = new Date(purchasedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>결제 영수증</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- 헤더 -->
          <tr>
            <td style="background:#1d4ed8;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#bfdbfe;font-size:13px;letter-spacing:0.05em;">주식회사 걸리버에이아이컴퍼니</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700;">결제 완료</h1>
            </td>
          </tr>

          <!-- 인사 -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
                안녕하세요, <strong>${userName}</strong>님.<br />
                아래 상품 구매가 정상적으로 완료되었습니다.
              </p>
            </td>
          </tr>

          <!-- 상품 정보 -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0 0 4px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">상품명</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#111827;">${product.name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #e2e8f0;">
                    <table width="100%">
                      <tr>
                        <td style="font-size:13px;color:#6b7280;">주문번호</td>
                        <td style="text-align:right;font-size:13px;color:#374151;font-family:monospace;">${orderId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #e2e8f0;">
                    <table width="100%">
                      <tr>
                        <td style="font-size:13px;color:#6b7280;">결제일시</td>
                        <td style="text-align:right;font-size:13px;color:#374151;">${date}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <table width="100%">
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#111827;">결제금액</td>
                        <td style="text-align:right;font-size:18px;font-weight:700;color:#1d4ed8;">${amount.toLocaleString("ko-KR")}원</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 다운로드 버튼 -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="${siteUrl}/my/downloads"
                style="display:inline-block;background:#1d4ed8;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:8px;">
                다운로드하러 가기
              </a>
            </td>
          </tr>

          <!-- 구분선 -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;" />
            </td>
          </tr>

          <!-- 푸터 -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">
                문의: gulliverai@naver.com &nbsp;|&nbsp; 02-2088-8210 / 010-8715-4207
              </p>
              <p style="margin:0;font-size:11px;color:#d1d5db;">
                서울특별시 은평구 갈현로 135-1, 401호 &nbsp;·&nbsp; 사업자등록번호 754-81-03646
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export async function sendReceiptEmail({
  to,
  userName,
  product,
  orderId,
  amount,
  purchasedAt,
}: {
  to: string
  userName: string
  product: Product
  orderId: string
  amount: number
  purchasedAt: string
}) {
  const transporter = createTransporter()
  const from = `"걸리버 AI 컴퍼니" <${process.env.SMTP_USER}>`

  await transporter.sendMail({
    from,
    to,
    subject: `[걸리버 AI] 결제 완료 — ${product.name}`,
    html: buildReceiptHtml({ userName, product, orderId, amount, purchasedAt }),
  })
}
