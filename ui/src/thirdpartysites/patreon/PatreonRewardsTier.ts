import { PatreonRewardsTier } from "../../generated-src/PatreonRewardsTier"

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

export const patronRewardLevelName = (tier?: PatreonRewardsTier) => {
    switch (tier) {
        case PatreonRewardsTier.NOTICE_BARGAINS:
            return "It that Fastidiously Notices Bargains"
        case PatreonRewardsTier.SUPPORT_SOPHISTICATION:
            return "The Archon that Purchases the Paradigm"
        case PatreonRewardsTier.MERCHANT_AEMBERMAKER:
            return "Merchant Æmbermaker"
        case PatreonRewardsTier.ALWAYS_GENEROUS:
            return "The Charitable Champion"
        default:
            return ""
    }
}

export const patronRewardLevelDescription = (tier?: PatreonRewardsTier) => {
    switch (tier) {
        case PatreonRewardsTier.NOTICE_BARGAINS:
            return "Notices Bargains – $3"
        case PatreonRewardsTier.SUPPORT_SOPHISTICATION:
            return "Purchases the Paradigm – $6"
        case PatreonRewardsTier.MERCHANT_AEMBERMAKER:
            return "Merchant Æmbermaker – $12"
        case PatreonRewardsTier.ALWAYS_GENEROUS:
            return "Always Generous – $25+"
        default:
            return ""
    }
}

export const patronForSaleLimit = (tier?: PatreonRewardsTier) => {
    switch (tier) {
        case PatreonRewardsTier.NOTICE_BARGAINS:
            return 250
        case PatreonRewardsTier.SUPPORT_SOPHISTICATION:
            return 1000
        case PatreonRewardsTier.MERCHANT_AEMBERMAKER:
            return undefined
        case PatreonRewardsTier.ALWAYS_GENEROUS:
            return undefined
        default:
            return 100
    }
}

export const patronNotificationLimit = (tier?: PatreonRewardsTier) => {
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
