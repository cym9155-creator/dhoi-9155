import { sql } from "@vercel/postgres"

export interface Notice {
  id: string
  title: string
  category: string
  isPinned: boolean
  createdAt: string
  content: string
}

function rowToNotice(row: Record<string, unknown>): Notice {
  return {
    id: row.id as string,
    title: row.title as string,
    category: row.category as string,
    isPinned: row.is_pinned as boolean,
    createdAt: (row.created_at as Date).toISOString(),
    content: row.content as string,
  }
}

export async function getNotices(): Promise<Notice[]> {
  const { rows } = await sql`
    SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC
  `
  return rows.map(rowToNotice)
}

export async function getNotice(id: string): Promise<Notice | undefined> {
  const { rows } = await sql`SELECT * FROM notices WHERE id = ${id}`
  return rows[0] ? rowToNotice(rows[0]) : undefined
}

export async function saveNotice(notice: Notice): Promise<void> {
  await sql`
    INSERT INTO notices (id, title, category, is_pinned, created_at, content)
    VALUES (
      ${notice.id}, ${notice.title}, ${notice.category},
      ${notice.isPinned}, ${notice.createdAt}, ${notice.content}
    )
  `
}

export async function deleteNotice(id: string): Promise<void> {
  await sql`DELETE FROM notices WHERE id = ${id}`
}
