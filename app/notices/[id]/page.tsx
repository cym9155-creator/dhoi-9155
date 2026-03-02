import { getNotice } from "@/lib/notices"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function NoticePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const notice = await getNotice(id)
  if (!notice) notFound()

  const paragraphs = notice.content.split("\n")

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/notices" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        ← 공지사항 목록
      </Link>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* 헤더 */}
        <div className="mb-6 border-b border-gray-100 pb-6">
          <span className="mb-3 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {notice.category}
          </span>
          <h1 className="text-xl font-bold text-gray-900">{notice.title}</h1>
          <p className="mt-2 text-sm text-gray-400">
            시행일 : {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>

        {/* 본문 */}
        <div className="space-y-2 text-sm text-gray-700 leading-7">
          {paragraphs.map((line, i) => {
            if (line.trim() === "") return <div key={i} className="h-2" />
            const isArticle = /^제\d+조/.test(line.trim())
            const isBullet = line.trim().startsWith("●")
            const isNote = /^부칙/.test(line.trim())
            return (
              <p
                key={i}
                className={
                  isArticle || isNote
                    ? "mt-5 font-semibold text-gray-900"
                    : isBullet
                    ? "pl-4"
                    : ""
                }
              >
                {line}
              </p>
            )
          })}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        본 약관은 2025년 08월 30일부터 시행됩니다.
      </p>
    </div>
  )
}
