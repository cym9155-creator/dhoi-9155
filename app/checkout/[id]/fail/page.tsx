import Link from "next/link"

export default async function FailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ code?: string; message?: string }>
}) {
  const { id } = await params
  const { code, message } = await searchParams

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">결제 실패</h1>
        <p className="mb-1 text-gray-500">{message ?? "결제 중 오류가 발생했습니다."}</p>
        {code && (
          <p className="mb-8 text-xs text-gray-400">오류 코드: {code}</p>
        )}
        <Link
          href={`/checkout/${id}`}
          className="block w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          다시 시도하기
        </Link>
        <Link href="/" className="mt-3 block text-sm text-gray-400 hover:text-gray-600">
          스토어로 돌아가기
        </Link>
      </div>
    </div>
  )
}
