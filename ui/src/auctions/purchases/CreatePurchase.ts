import { SaleType } from "./SaleType"

export interface CreatePurchase {
    deckId: number
    amount: number
    saleType: SaleType
    buyerId?: string
    sellerId?: string
}
