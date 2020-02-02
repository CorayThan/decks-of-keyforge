import { PatreonRewardsTier } from "../../thirdpartysites/patreon/PatreonRewardsTier"
import { UserType } from "../KeyUser"

export interface UserSearchResult {
    username: string
    deckCount: number
    forSaleCount: number
    patreonTier?: PatreonRewardsTier
    manualPatreonTier?: PatreonRewardsTier
    topSasAverage: number
    highSas: number
    lowSas: number
    totalPower: number
    totalChains: number
    mavericks: number
    anomalies: number
    role: UserType
}
