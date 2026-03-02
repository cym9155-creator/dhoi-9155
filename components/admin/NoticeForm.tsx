"use client"

import { useRef } from "react"
import { addNotice } from "@/app/actions/notices"

const CATEGORIES = ["공지", "안내", "약관"]

export default function NoticeForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await addNotice(formData)
    formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      {/* 제목 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">제목 *</label>
        <input
          name="title"
          required
          placeholder="공지 제목을 입력하세요"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 카테고리 + 고정 */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">카테고리 *</label>
          <select
            name="category"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <label className="flex cursor-pointer items-center gap-2 pb-2">
          <input
            type="checkbox"
            name="isPinned"
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">📌 상단 고정</span>
        </label>
      </div>

      {/* 내용 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">내용 *</label>
        <textarea
          name="content"
          required
          rows={8}
          placeholder="공지 내용을 입력하세요"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
        />
      </div>

      <button
        type="submit"
        className="self-end rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        공지 등록
      </button>
    </form>
  )
}
