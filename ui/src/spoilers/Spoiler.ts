import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { Expansion } from "../expansions/Expansions"
import { CsvData } from "../generic/CsvDownloadButton"
import { House } from "../houses/House"
import { makeFullSpoilerUrl } from "./SpoilerView"

export interface Spoiler {

    cardTitle: string
    house?: House // anomalies have no house
    houses?: House[]
    cardType: CardType
    frontImage?: string
    cardText: string
    amber: number
    powerString: string
    armorString: string
    rarity?: Rarity
    cardNumber?: string
    expansion: Expansion

    traitsString?: string

    // Received from server only, should not be sent
    traits?: string[]

    createdById: string

    reprint: boolean
    anomaly: boolean
    doubleCard: boolean

    active: boolean
    id?: number
}

export class SpoilerUtils {
    static arrayToCSV = (cards: Spoiler[] | undefined): CsvData | undefined => {
        if (cards == null) return undefined
        const data = cards.map(card => {

            return [
                card.cardTitle,
                card.house,
                card.cardNumber,
                card.cardType,
                card.rarity,

                card.amber,
                card.powerString,
                card.armorString,

                card.anomaly,
                card.reprint,

                card.traits,
                card.cardText
                    .replace(/[\r\n]+/gm, "\r"),
                makeFullSpoilerUrl(card.frontImage)
            ]
        })
        data.unshift([
            "Name",
            "House",
            "Card Number",
            "Type",
            "Rarity",

            "Raw Amber",
            "Power",
            "Armor",

            "Anomaly",
            "Reprint",

            "Traits",
            "Text",
            "Image Link"
        ])
        return data
    }
}
