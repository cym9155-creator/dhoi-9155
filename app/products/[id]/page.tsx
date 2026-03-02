import { getProduct } from "@/lib/products"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const TYPE_LABEL: Record<string, string> = { app: "앱", ebook: "전자책" }
const TYPE_COLOR: Record<string, string> = {
  app: "bg-blue-100 text-blue-700",
  ebook: "bg-emerald-100 text-emerald-700",
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const session = await auth()

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        ← 스토어로 돌아가기
      </Link>

      <div className="mt-4 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex flex-col gap-4">
          <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLOR[product.type]}`}>
            {TYPE_LABEL[product.type]}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <p className="text-3xl font-bold text-gray-900">
            {product.price.toLocaleString()}원
          </p>

          {session?.user ? (
            <Link
              href={`/checkout/${product.id}`}
              className="mt-2 flex h-12 items-center justify-center rounded-lg bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              구매하기
            </Link>
          ) : (
            <Link
              href="/login"
              className="mt-2 flex h-12 items-center justify-center rounded-lg border border-blue-600 px-6 font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              로그인 후 구매하기
            </Link>
          )}

          <a
            href="https://open.kakao.com/me/youngmin71"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-6 font-semibold text-[#191919] hover:bg-[#F5DC00] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3C6.477 3 2 6.582 2 11c0 2.818 1.636 5.3 4.118 6.88-.158.59-.61 2.148-.7 2.484-.112.41.15.405.316.295.13-.088 2.062-1.4 2.898-1.97A11.6 11.6 0 0012 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
            </svg>
            카카오톡으로 문의하기
          </a>
        </div>
      </div>
    </div>
  )
}
