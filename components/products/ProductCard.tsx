import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types/product"

const TYPE_LABEL: Record<string, string> = {
  app: "앱",
  ebook: "전자책",
}

const TYPE_COLOR: Record<string, string> = {
  app: "bg-blue-100 text-blue-700",
  ebook: "bg-emerald-100 text-emerald-700",
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLOR[product.type]}`}>
            {TYPE_LABEL[product.type]}
          </span>
        </div>
        <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h2>
        <p className="line-clamp-2 flex-1 text-sm text-gray-500">
          {product.description}
        </p>
        <p className="mt-2 text-lg font-bold text-gray-900">
          {product.price.toLocaleString()}원
        </p>
      </div>
    </Link>
  )
}
