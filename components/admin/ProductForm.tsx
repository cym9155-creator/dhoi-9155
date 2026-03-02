"use client"

import { useRef, useState } from "react"
import { addProduct } from "@/app/actions/admin"
import Image from "next/image"

export default function ProductForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [useUrl, setUseUrl] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(formData: FormData) {
    await addProduct(formData)
    formRef.current?.reset()
    setPreview(null)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* 상품명 */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">상품명</label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 설명 */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">설명</label>
        <textarea
          name="description"
          required
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 유형 + 가격 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">유형</label>
        <select
          name="type"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="app">앱</option>
          <option value="ebook">전자책</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">가격 (원)</label>
        <input
          name="price"
          type="number"
          required
          min={0}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="sm:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">상품 이미지</label>
          <button
            type="button"
            onClick={() => { setUseUrl(!useUrl); setPreview(null) }}
            className="text-xs text-blue-600 hover:underline"
          >
            {useUrl ? "파일 업로드로 전환" : "URL로 입력하기"}
          </button>
        </div>

        {useUrl ? (
          <input
            name="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        ) : (
          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100 transition-colors">
              <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500">클릭해서 이미지 선택</span>
              <span className="mt-1 text-xs text-gray-400">JPEG, PNG, WEBP, GIF · 최대 5MB</span>
              <input
                name="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {preview && (
              <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-200">
                <Image src={preview} alt="미리보기" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => { setPreview(null) }}
                  className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-gray-600 hover:bg-white"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 파일 URL (다운로드용) */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          파일 URL <span className="text-gray-400 font-normal">(구매 후 다운로드 링크)</span>
        </label>
        <input
          name="fileUrl"
          type="url"
          required
          placeholder="https://example.com/files/product.zip"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          등록
        </button>
      </div>
    </form>
  )
}
