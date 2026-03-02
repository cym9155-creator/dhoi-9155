"use server"

import { saveProduct, deleteProduct } from "@/lib/products"
import { Product } from "@/types/product"
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

export async function addProduct(formData: FormData) {
  await assertAdmin()

  // 프로덕션에서는 파일 업로드 대신 URL 사용 (Vercel 파일시스템 read-only)
  const imageUrl = formData.get("imageUrl") as string

  const product: Product = {
    id: randomUUID(),
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as "app" | "ebook",
    price: Number(formData.get("price")),
    imageUrl,
    fileUrl: formData.get("fileUrl") as string,
    createdAt: new Date().toISOString(),
  }

  await saveProduct(product)
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function removeProduct(id: string) {
  await assertAdmin()
  await deleteProduct(id)
  revalidatePath("/")
  revalidatePath("/admin")
}
