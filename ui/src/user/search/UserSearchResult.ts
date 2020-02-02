import { PatreonRewardsTier } from "../../thirdpartysites/patreon/PatreonRewardsTier"

export interface UserSearchResult {
    username: string
    deckCount: number
    forSaleCount: number
    patreonTier?: PatreonRewardsTier
    topSasAverage: number
    highSas: number
    lowSas: number
    totalPower: number
    totalChains: number
    mavericks: number
    anomalies: number
}
