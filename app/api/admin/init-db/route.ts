import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { auth } from "@/auth"
import { isAdmin } from "@/lib/admin"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 테이블 생성
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      price INTEGER NOT NULL,
      image_url TEXT,
      file_url TEXT,
      created_at TIMESTAMPTZ NOT NULL
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_email TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS notices (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      is_pinned BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL,
      content TEXT
    )
  `

  // 상품 시드 (비어있을 때만)
  const { rows: existingProducts } = await sql`SELECT COUNT(*) as count FROM products`
  if (existingProducts[0].count === "0") {
    await sql`
      INSERT INTO products (id, name, description, type, price, image_url, file_url, created_at) VALUES
      ('1', 'DevTools Pro', '개발자를 위한 올인원 생산성 툴. 코드 스니펫 관리, API 테스터, JSON 포매터 등 30가지 기능 포함.', 'app', 29000, 'https://placehold.co/600x400/0b84f3/ffffff?text=DevTools+Pro', 'https://example.com/files/devtools-pro-v1.0.zip', NOW()),
      ('2', 'Next.js 완전 정복', 'App Router부터 배포까지. Next.js 14 기반 실전 프로젝트를 단계별로 따라 만드는 전자책 (PDF, 350페이지).', 'ebook', 19000, 'https://placehold.co/600x400/10b981/ffffff?text=Next.js+완전정복', 'https://example.com/files/nextjs-ebook.pdf', NOW()),
      ('3', 'MarkdownFlow', '실시간 미리보기와 내보내기 기능을 갖춘 마크다운 에디터. PDF, HTML, DOCX 변환 지원.', 'app', 15000, 'https://placehold.co/600x400/6366f1/ffffff?text=MarkdownFlow', 'https://example.com/files/markdownflow-v2.1.zip', NOW()),
      ('4', 'TypeScript 핵심 패턴', '현업에서 바로 쓰는 TypeScript 고급 패턴 모음. 제네릭, 유틸리티 타입, 조건부 타입 완벽 해설 (PDF, 220페이지).', 'ebook', 14000, 'https://placehold.co/600x400/f59e0b/ffffff?text=TypeScript+패턴', 'https://example.com/files/typescript-patterns.pdf', NOW())
    `
  }

  // 공지 시드 (비어있을 때만)
  const { rows: existingNotices } = await sql`SELECT COUNT(*) as count FROM notices`
  if (existingNotices[0].count === "0") {
    await sql`
      INSERT INTO notices (id, title, category, is_pinned, created_at, content) VALUES
      (
        'customer-center',
        '고객센터 및 회사 카페 안내',
        '안내',
        false,
        '2025-08-30T00:00:00Z',
        '안내합니다. 공지사항입니다.

이용 중 문의사항은 언제든지 고객센터(02-2088-8210 / 010-8715-4207)로 문의해 주세요.

회사 카페에서도 다양한 정보를 얻을 수 있습니다.

▶ 회사 카페 바로가기
https://cafe.naver.com/gulliverai

감사합니다.'
      )
    `
    await sql`
      INSERT INTO notices (id, title, category, is_pinned, created_at, content) VALUES
      (
        'terms',
        '걸리버 AI 컴퍼니 맞춤 서비스 이용약관',
        '약관',
        true,
        '2025-08-30T00:00:00Z',
        '제1조 (목적)
본 약관은 걸리버 AI 컴퍼니(이하 ''회사'')가 제공하는 온라인 교육·AI 기반 콘텐츠 서비스(이하 ''서비스'') 이용과 관련하여, 회사와 회원의 권리·의무 및 책임사항을 규정함을 목적으로 한다.

부칙
본 약관은 2025년 08월 30일부터 시행한다.'
      )
    `
  }

  return NextResponse.json({
    ok: true,
    message: "DB 초기화 완료. 테이블이 생성되고 초기 데이터가 입력되었습니다.",
  })
}
