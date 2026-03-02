import { auth } from "@/auth"
import { savePurchase, hasPurchased, getProduct } from "@/lib/products"
import { redirect } from "next/navigation"
import { Purchase } from "@/types/product"
import { randomUUID } from "crypto"
import { sendReceiptEmail } from "@/lib/mailer"
import Link from "next/link"

async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  const secretKey = process.env.TOSS_SECRET_KEY!
  const encoded = Buffer.from(`${secretKey}:`).toString("base64")

  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? "결제 승인 실패")
  }

  return response.json()
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ paymentKey: string; orderId: string; amount: string }>
}) {
  const { id } = await params
  const { paymentKey, orderId, amount } = await searchParams

  if (!paymentKey || !orderId || !amount) {
    redirect(`/checkout/${id}`)
  }

  const session = await auth()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const product = await getProduct(id)
  if (!product) redirect("/")

  // 이미 처리된 구매면 바로 다운로드 페이지로
  if (await hasPurchased(session.user.email, id)) {
    redirect("/my/downloads")
  }

  try {
    await confirmPayment(paymentKey, orderId, Number(amount))
  } catch {
    redirect(`/checkout/${id}/fail?code=CONFIRM_FAILED&message=결제 승인에 실패했습니다`)
  }

  const purchasedAt = new Date().toISOString()

  const purchase: Purchase = {
    id: randomUUID(),
    userId: session.user.email,
    userEmail: session.user.email,
    productId: id,
    createdAt: purchasedAt,
  }
  savePurchase(purchase)

  // 이메일 영수증 발송 (실패해도 결제 흐름에 영향 없음)
  try {
    await sendReceiptEmail({
      to: session.user.email,
      userName: session.user.name ?? session.user.email,
      product: product!,
      orderId,
      amount: Number(amount),
      purchasedAt,
    })
  } catch (err) {
    console.error("영수증 이메일 발송 실패:", err)
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">결제 완료!</h1>
        <p className="text-gray-500 mb-1">
          <span className="font-semibold text-gray-800">{product!.name}</span>을(를) 구매했습니다.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          {Number(amount).toLocaleString()}원 · {orderId}
        </p>
        <p className="text-xs text-emerald-600 mb-8">
          영수증이 <span className="font-medium">{session.user.email}</span>로 발송되었습니다.
        </p>
        <Link
          href="/my/downloads"
          className="block w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          다운로드하러 가기
        </Link>
        <Link href="/" className="mt-3 block text-sm text-gray-400 hover:text-gray-600">
          스토어로 돌아가기
        </Link>
      </div>
    </div>
  )
}
