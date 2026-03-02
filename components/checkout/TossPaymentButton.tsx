"use client"

import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk"
import { useState } from "react"

interface Props {
  productId: string
  productName: string
  amount: number
  orderId: string
  customerEmail: string
  customerName: string
}

export default function TossPaymentButton({
  productId,
  productName,
  amount,
  orderId,
  customerEmail,
  customerName,
}: Props) {
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      const tossPayments = await loadTossPayments(clientKey)

      const payment = tossPayments.payment({ customerKey: ANONYMOUS })

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: amount,
        },
        orderId,
        orderName: productName,
        customerEmail,
        customerName,
        successUrl: `${window.location.origin}/checkout/${productId}/success`,
        failUrl: `${window.location.origin}/checkout/${productId}/fail`,
      })
    } catch (error) {
      console.error("결제 오류:", error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
    >
      {loading ? "결제창 열는 중..." : `${amount.toLocaleString()}원 결제하기`}
    </button>
  )
}
