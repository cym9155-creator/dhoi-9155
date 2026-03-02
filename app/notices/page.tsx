import { getNotices } from "@/lib/notices"
import Link from "next/link"

const CATEGORY_COLOR: Record<string, string> = {
  약관: "bg-blue-100 text-blue-700",
  공지: "bg-orange-100 text-orange-700",
  안내: "bg-gray-100 text-gray-600",
}

export default async function NoticesPage() {
  const notices = await getNotices()

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">공지사항</h1>
      <p className="mb-8 text-sm text-gray-500">서비스 이용에 관한 중요한 안내를 확인하세요.</p>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {notices.length === 0 ? (
          <p className="py-16 text-center text-gray-400">등록된 공지사항이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notices.map((notice, idx) => (
              <li key={notice.id}>
                <Link
                  href={`/notices/${notice.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-8 text-center text-sm text-gray-400">
                    {notice.isPinned ? "📌" : idx + 1}
                  </span>
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOR[notice.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {notice.category}
                    </span>
                    <span className="truncate font-medium text-gray-900">{notice.title}</span>
                  </div>
                  <span className="flex-shrink-0 text-xs text-gray-400">
                    {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
