import { getProducts } from "@/lib/products"
import { getNotices } from "@/lib/notices"
import { removeProduct } from "@/app/actions/admin"
import { removeNotice } from "@/app/actions/notices"
import ProductForm from "@/components/admin/ProductForm"
import NoticeForm from "@/components/admin/NoticeForm"
import { auth } from "@/auth"
import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"

const TYPE_LABEL: Record<string, string> = { app: "앱", ebook: "전자책" }

const CATEGORY_COLOR: Record<string, string> = {
  약관: "bg-blue-100 text-blue-700",
  공지: "bg-orange-100 text-orange-700",
  안내: "bg-gray-100 text-gray-600",
}

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/")
  }

  const products = await getProducts()
  const notices = await getNotices()

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {session.user.email}
        </span>
      </div>

      {/* ── 상품 관리 ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-bold text-gray-800">상품 관리</h2>

        {/* 상품 등록 폼 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">새 상품 등록</h3>
          <ProductForm />
        </div>

        {/* 상품 목록 */}
        <h3 className="mb-3 font-semibold text-gray-700">등록된 상품 ({products.length})</h3>
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
            >
              <div>
                <span className="text-xs font-medium text-gray-400 mr-2">[{TYPE_LABEL[product.type]}]</span>
                <span className="font-medium text-gray-900">{product.name}</span>
                <span className="ml-3 text-sm text-gray-500">{product.price.toLocaleString()}원</span>
              </div>
              <form
                action={async () => {
                  "use server"
                  await removeProduct(product.id)
                }}
              >
                <button
                  type="submit"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* ── 공지 관리 ── */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-800">공지 관리</h2>

        {/* 공지 등록 폼 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">새 공지 작성</h3>
          <NoticeForm />
        </div>

        {/* 공지 목록 */}
        <h3 className="mb-3 font-semibold text-gray-700">등록된 공지 ({notices.length})</h3>
        <div className="flex flex-col gap-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                {notice.isPinned && <span className="flex-shrink-0 text-sm">📌</span>}
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[notice.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {notice.category}
                </span>
                <span className="truncate font-medium text-gray-900">{notice.title}</span>
                <span className="flex-shrink-0 text-xs text-gray-400">
                  {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <form
                action={async () => {
                  "use server"
                  await removeNotice(notice.id)
                }}
              >
                <button
                  type="submit"
                  className="ml-4 flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
