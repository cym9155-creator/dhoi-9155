import { auth } from "@/auth"
import { getUserPurchases, getProduct } from "@/lib/products"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const TYPE_LABEL: Record<string, string> = { app: "앱", ebook: "전자책" }

export default async function DownloadsPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const purchases = await getUserPurchases(session.user.email)
  const items = await Promise.all(
    purchases.map(async (p) => ({ purchase: p, product: await getProduct(p.productId) }))
  )
  const validItems = items.filter((item) => item.product !== undefined)

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">내 구매 내역</h1>
      <p className="mb-8 text-sm text-gray-500">{session.user.email}</p>

      {validItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-gray-400">구매한 상품이 없습니다.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            스토어 둘러보기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {validItems.map(({ purchase, product }) => (
            <div
              key={purchase.id}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product!.imageUrl}
                  alt={product!.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{product!.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {TYPE_LABEL[product!.type]} · {new Date(purchase.createdAt).toLocaleDateString("ko-KR")} 구매
                </p>
              </div>
              <a
                href={product!.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                다운로드
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
