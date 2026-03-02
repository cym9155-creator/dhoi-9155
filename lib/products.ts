import { sql } from "@vercel/postgres"
import { Product, Purchase } from "@/types/product"

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    type: row.type as "app" | "ebook",
    price: row.price as number,
    imageUrl: row.image_url as string,
    fileUrl: row.file_url as string,
    createdAt: (row.created_at as Date).toISOString(),
  }
}

function rowToPurchase(row: Record<string, unknown>): Purchase {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userEmail: row.user_email as string,
    productId: row.product_id as string,
    createdAt: (row.created_at as Date).toISOString(),
  }
}

export async function getProducts(): Promise<Product[]> {
  const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`
  return rows.map(rowToProduct)
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`
  return rows[0] ? rowToProduct(rows[0]) : undefined
}

export async function saveProduct(product: Product): Promise<void> {
  await sql`
    INSERT INTO products (id, name, description, type, price, image_url, file_url, created_at)
    VALUES (
      ${product.id}, ${product.name}, ${product.description},
      ${product.type}, ${product.price}, ${product.imageUrl},
      ${product.fileUrl}, ${product.createdAt}
    )
  `
}

export async function deleteProduct(id: string): Promise<void> {
  await sql`DELETE FROM products WHERE id = ${id}`
}

export async function hasPurchased(email: string, productId: string): Promise<boolean> {
  const { rows } = await sql`
    SELECT id FROM purchases WHERE user_email = ${email} AND product_id = ${productId}
  `
  return rows.length > 0
}

export async function getUserPurchases(email: string): Promise<Purchase[]> {
  const { rows } = await sql`
    SELECT * FROM purchases WHERE user_email = ${email} ORDER BY created_at DESC
  `
  return rows.map(rowToPurchase)
}

export async function getPurchases(): Promise<Purchase[]> {
  const { rows } = await sql`SELECT * FROM purchases ORDER BY created_at DESC`
  return rows.map(rowToPurchase)
}

export async function savePurchase(purchase: Purchase): Promise<void> {
  await sql`
    INSERT INTO purchases (id, user_id, user_email, product_id, created_at)
    VALUES (
      ${purchase.id}, ${purchase.userId}, ${purchase.userEmail},
      ${purchase.productId}, ${purchase.createdAt}
    )
  `
}
