import { getProduct, hasPurchased } from "@/lib/products"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { randomUUID } from "crypto"
import TossPaymentButton from "@/components/checkout/TossPaymentButton"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const product = await getProduct(id)
  if (!product) notFound()

  if (await hasPurchased(session.user.email, id)) {
    redirect("/my/downloads")
  }

  const orderId = `order-${randomUUID()}`

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <Link href={`/products/${id}`} className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        ← 상품으로 돌아가기
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-gray-900">주문 확인</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* 상품 요약 */}
        <div className="flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {product.type === "app" ? "앱" : "전자책"}
            </p>
          </div>
        </div>

        {/* 금액 */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>상품 금액</span>
            <span>{product.price.toLocaleString()}원</span>
          </div>
          <div className="mt-3 flex justify-between font-bold text-gray-900">
            <span>결제 금액</span>
            <span>{product.price.toLocaleString()}원</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          구매자: {session.user.email}
        </p>

        {/* 토스페이먼츠 결제 버튼 */}
        <div className="mt-6">
          <TossPaymentButton
            productId={id}
            productName={product.name}
            amount={product.price}
            orderId={orderId}
            customerEmail={session.user.email}
            customerName={session.user.name ?? "고객"}
          />
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        결제 완료 후 즉시 다운로드 링크가 제공됩니다.
      </p>
    </div>
  )
}
