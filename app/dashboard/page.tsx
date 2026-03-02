import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
      <p className="mt-2 text-gray-600">
        환영합니다, <span className="font-medium">{session.user.name}</span>님!
      </p>
      <p className="text-sm text-gray-400">{session.user.email}</p>
    </div>
  )
}
