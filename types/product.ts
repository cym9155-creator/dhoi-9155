export type ProductType = "app" | "ebook"

export interface Product {
  id: string
  name: string
  description: string
  type: ProductType
  price: number
  imageUrl: string
  fileUrl: string
  createdAt: string
}

export interface Purchase {
  id: string
  userId: string
  userEmail: string
  productId: string
  createdAt: string
}
