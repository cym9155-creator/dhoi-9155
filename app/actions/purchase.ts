"use server"

import { auth } from "@/auth"
import { savePurchase, hasPurchased } from "@/lib/products"
import { redirect } from "next/navigation"
import { Purchase } from "@/types/product"
import { randomUUID } from "crypto"

export async function purchaseProduct(productId: string) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const userEmail = session.user.email

  if (await hasPurchased(userEmail, productId)) {
    redirect("/my/downloads")
  }

  const purchase: Purchase = {
    id: randomUUID(),
    userId: session.user.email,
    userEmail,
    productId,
    createdAt: new Date().toISOString(),
  }

  await savePurchase(purchase)
  redirect("/my/downloads")
}
