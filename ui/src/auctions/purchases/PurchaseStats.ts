import { BackendExpansion } from "../../expansions/Expansions"

export interface PurchaseStats {
    standardCount: number
    offerCount: number
    auctionCount: number

    data: PurchaseCurrencyData[]
}

export interface PurchaseCurrencyData {
    currency: string
    expansion?: BackendExpansion
    data: PurchaseAmountData[]
}

export interface PurchaseAmountData {
    amount: number
    sas: number
    count: number
}
