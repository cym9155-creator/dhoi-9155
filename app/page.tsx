import { getProducts } from "@/lib/products"
import ProductGrid from "@/components/products/ProductGrid"
import { ProductType } from "@/types/product"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const allProducts = await getProducts()

  const filtered =
    type === "app" || type === "ebook"
      ? allProducts.filter((p) => p.type === (type as ProductType))
      : allProducts

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">스토어</h1>
        <p className="mt-1 text-gray-500">앱과 전자책을 구매하고 바로 다운로드하세요.</p>
      </div>

      <div className="mb-6 flex gap-2">
        {[
          { label: "전체", value: "" },
          { label: "앱", value: "app" },
          { label: "전자책", value: "ebook" },
        ].map((tab) => (
          <a
            key={tab.value}
            href={tab.value ? `?type=${tab.value}` : "/"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              (type ?? "") === tab.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <ProductGrid products={filtered} />
    </div>
  )
}
