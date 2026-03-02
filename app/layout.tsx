import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import SignOutButton from "@/components/auth/SignOutButton";
import { isAdmin } from "@/lib/admin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My App",
  description: "Google OAuth 로그인 예제",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          {/* 상단 공지 배너 */}
          <a
            href="https://open.kakao.com/o/gjz8WmXh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 bg-[#FEE500] px-4 py-2.5 text-center text-sm font-semibold text-[#191919] hover:bg-[#F5DC00] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
              <path d="M12 3C6.477 3 2 6.582 2 11c0 2.818 1.636 5.3 4.118 6.88-.158.59-.61 2.148-.7 2.484-.112.41.15.405.316.295.13-.088 2.062-1.4 2.898-1.97A11.6 11.6 0 0012 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
            </svg>
            📅 매주 <strong>월·수 저녁 7시 30분</strong> 무료 강의 있습니다 — 카톡방 들어오세요 →
          </a>

          <header className="flex items-center justify-between border-b px-6 py-3">
            <a href="/" className="font-semibold text-gray-900">My App</a>
            <div className="flex items-center gap-3">
              {session?.user ? (
                <>
                  {isAdmin(session.user.email) && (
                    <a href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800">관리자</a>
                  )}
                  <a href="/my/downloads" className="text-sm text-gray-600 hover:text-gray-900">내 구매</a>
                  <span className="text-sm text-gray-400">{session.user.name}</span>
                  <SignOutButton />
                </>
              ) : (
                <SignInButton />
              )}
            </div>
          </header>
          <main>{children}</main>

          {/* 푸터 사업자 정보 */}
          <footer className="mt-16 border-t border-gray-200 bg-gray-50 py-10">
            <div className="mx-auto max-w-3xl px-6 text-center">
              {/* 링크 모음 */}
              <div className="mb-6 flex justify-center gap-6 text-sm">
                <a href="/notices" className="text-gray-600 hover:text-blue-600 hover:underline transition-colors">공지사항</a>
                <a href="/notices/terms" className="text-gray-600 hover:text-blue-600 hover:underline transition-colors">이용약관</a>
              </div>
              <p className="mb-1 text-sm font-semibold text-gray-700">주식회사 걸리버에이아이컴퍼니</p>
              <div className="mt-2 space-y-1 text-xs text-gray-500 leading-relaxed">
                <p>대표자 : 최영민 &nbsp;|&nbsp; 이메일 : gulliverai@naver.com</p>
                <p>전화번호 : 02-2088-8210 &nbsp;/&nbsp; 010-8715-4207</p>
                <p>주소 : 서울특별시 은평구 갈현로 135-1, 401호</p>
                <p>사업자등록번호 : 754-81-03646</p>
                <p>통신판매업신고번호 : 제 2025-서울은평-1437 호</p>
              </div>
              <p className="mt-4 text-xs text-gray-400">© 2025 주식회사 걸리버에이아이컴퍼니. All rights reserved.</p>
            </div>
          </footer>

          {/* 플로팅 카카오톡 문의 버튼 */}
          <a
            href="https://open.kakao.com/me/youngmin71"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 font-semibold text-sm text-[#191919] shadow-lg hover:bg-[#F5DC00] transition-colors"
            aria-label="카카오톡 문의"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3C6.477 3 2 6.582 2 11c0 2.818 1.636 5.3 4.118 6.88-.158.59-.61 2.148-.7 2.484-.112.41.15.405.316.295.13-.088 2.062-1.4 2.898-1.97A11.6 11.6 0 0012 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
            </svg>
            문의하기
          </a>
        </SessionProvider>
      </body>
    </html>
  );
}
