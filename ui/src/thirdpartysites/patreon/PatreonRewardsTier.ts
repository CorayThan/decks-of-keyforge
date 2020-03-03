export enum PatreonRewardsTier {
    NOTICE_BARGAINS = "NOTICE_BARGAINS", // $1
    SUPPORT_SOPHISTICATION = "SUPPORT_SOPHISTICATION", // $5
    MERCHANT_AEMBERMAKER = "MERCHANT_AEMBERMAKER", // $10
    ALWAYS_GENEROUS = "ALWAYS_GENEROUS" // $25 Exclusive tier or $50
}

export const findPatronRewardLevel = (tier?: PatreonRewardsTier) => {
    switch (tier) {
        case PatreonRewardsTier.NOTICE_BARGAINS:
            return 1
        case PatreonRewardsTier.SUPPORT_SOPHISTICATION:
            return 2
        case PatreonRewardsTier.MERCHANT_AEMBERMAKER:
            return 3
        case PatreonRewardsTier.ALWAYS_GENEROUS:
            return 4
        default:
            return 0
    }
}

export const patronRewardLevelName =  (tier?: PatreonRewardsTier) => {
    switch (tier) {
        case PatreonRewardsTier.NOTICE_BARGAINS:
            return "It that Fastidiously Notices Bargains"
        case PatreonRewardsTier.SUPPORT_SOPHISTICATION:
            return "The Archon that Purchases the Paradigm"
        case PatreonRewardsTier.MERCHANT_AEMBERMAKER:
            return "Merchant Æmbermaker"
        case PatreonRewardsTier.ALWAYS_GENEROUS:
            return "Butterfield the Always Generous"
        default:
            return ""
    }
}

export const patronRewardLevelDescription =  (tier?: PatreonRewardsTier) => {
    switch (tier) {
        case PatreonRewardsTier.NOTICE_BARGAINS:
            return "Notices Bargains – $1"
        case PatreonRewardsTier.SUPPORT_SOPHISTICATION:
            return "Purchases the Paradigm – $5"
        case PatreonRewardsTier.MERCHANT_AEMBERMAKER:
            return "Merchant Æmbermaker – $10"
        case PatreonRewardsTier.ALWAYS_GENEROUS:
            return "Always Generous – $25+"
        default:
            return ""
    }
}

export const patronAuctionLimit =  (tier?: PatreonRewardsTier) => {
    switch (tier) {
        case PatreonRewardsTier.SUPPORT_SOPHISTICATION:
            return 5
        case PatreonRewardsTier.MERCHANT_AEMBERMAKER:
            return 10
        case PatreonRewardsTier.ALWAYS_GENEROUS:
            return undefined
        default:
            return 1
    }
}

export const patronNotificationLimit =  (tier?: PatreonRewardsTier) => {
    switch (tier) {
        case PatreonRewardsTier.SUPPORT_SOPHISTICATION:
            return 25
        case PatreonRewardsTier.MERCHANT_AEMBERMAKER:
            return 25
        case PatreonRewardsTier.ALWAYS_GENEROUS:
            return 50
        default:
            return 0
    }
}
