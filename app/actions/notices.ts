"use server"

import { saveNotice, deleteNotice } from "@/lib/notices"
import { Notice } from "@/lib/notices"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { auth } from "@/auth"
import { isAdmin } from "@/lib/admin"

async function assertAdmin() {
  const session = await auth()
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    throw new Error("관리자 권한이 없습니다.")
  }
}

export async function addNotice(formData: FormData) {
  await assertAdmin()

  const notice: Notice = {
    id: randomUUID(),
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    isPinned: formData.get("isPinned") === "on",
    createdAt: new Date().toISOString(),
    content: formData.get("content") as string,
  }

  await saveNotice(notice)
  revalidatePath("/notices")
  revalidatePath("/admin")
}

export async function removeNotice(id: string) {
  await assertAdmin()
  await deleteNotice(id)
  revalidatePath("/notices")
  revalidatePath("/admin")
}
