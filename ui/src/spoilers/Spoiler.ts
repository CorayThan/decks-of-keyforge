import { HasAerc } from "../aerc/HasAerc"
import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { Expansion } from "../expansions/Expansions"
import { House } from "../houses/House"

export interface Spoiler extends HasAerc {

    cardTitle: string
    house?: House // anomalies have no house
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
    static arrayToCSV = (cards: Spoiler[] | undefined) => {
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
                    .replace(/[\r\n]+/gm, "\r")
                    .replace(/"/g, "\"\""),
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
        ])
        return data
    }
}
