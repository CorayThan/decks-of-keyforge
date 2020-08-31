import { Expansion } from "../../generated-src/Expansion"

export interface PurchaseStats {
    standardCount: number
    offerCount: number
    auctionCount: number

    data: PurchaseCurrencyData[]
}

export interface PurchaseCurrencyData {
    currency: string
    expansion?: Expansion
    data: PurchaseAmountData[]
}

export interface PurchaseAmountData {
    amount: number
    sas: number
    count: number
}
