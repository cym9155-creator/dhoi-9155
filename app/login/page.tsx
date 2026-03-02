import SignInButton from "@/components/auth/SignInButton"

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
        <p className="mt-2 text-sm text-gray-500">Google 계정으로 계속하세요</p>
      </div>
      <SignInButton />
    </div>
  )
}
