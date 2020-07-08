import { CsvData } from "../../generic/CsvDownloadButton"
import { SaleType } from "./SaleType"

export interface PurchaseSearchResult {
    id: string,
    deckKeyforgeId: string
    deckName: string
    saleAmount: number
    saleType: SaleType
    purchasedOn: string
    currencySymbol?: string
    sellerCountry?: string
    buyerCountry?: string
    sellerUsername?: string
    sellerId?: string
    buyerUsername?: string
}

export class PurchaseUtils {

    static arrayToCSV = (purchases: PurchaseSearchResult[]): CsvData => {
        const data = purchases.map(purchase => {

            return [
                purchase.deckName,
                purchase.currencySymbol,
                purchase.saleAmount,
                purchase.saleType,
                purchase.purchasedOn,
                purchase.buyerUsername,
                purchase.buyerCountry,
                purchase.sellerUsername,
                purchase.sellerCountry,
                `https://decksofkeyforge.com/decks/${purchase.deckKeyforgeId}`,
                `https://www.keyforgegame.com/deck-details/${purchase.deckKeyforgeId}`,
            ]
        })
        data.unshift([
            "Deck Name",
            "Currency Symbol",
            "Sale Amount",
            "Sale Type",
            "Sale Date",
            "Buyer",
            "Buyer Country",
            "Seller",
            "Seller Country",
            "DoK Link",
            "Master Vault Link",
        ])
        return data
    }
}
