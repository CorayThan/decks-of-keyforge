import { HasAerc } from "../aerc/HasAerc"
import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { Expansion } from "../expansions/Expansions"
import { House } from "../houses/House"

export interface Spoiler extends HasAerc {

    cardTitle: string
    house?: House // anomalies have no house
    cardType: CardType
    frontImage: string
    cardText: string
    amber: number
    powerString: string
    armorString: string
    rarity: Rarity
    cardNumber: string
    expansion: Expansion

    reprint: boolean

    anomaly: boolean
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

                card.amber,
                card.powerString,
                card.armorString,

                card.anomaly,
                card.reprint,

                card.cardText.replace(/"/g, "\"\""),

                card.aercScore,
                card.amberControl,
                card.expectedAmber,
                card.amberProtection,
                card.artifactControl,
                card.creatureControl,
                card.effectivePower,
                card.efficiency,
                card.disruption,
                card.houseCheating,
                card.other,
            ]
        })
        data.unshift([
            "Name",
            "House",
            "Card Number",

            "Raw Amber",
            "Power",
            "Armor",

            "Anomaly",
            "Reprint",

            "Text",

            "Aerc Score",
            "Amber Control",
            "Expected Amber",
            "Aember Protection",
            "Artifact Control",
            "Creature Control",
            "Effective Power",
            "Efficiency",
            "Disruption",
            "House Cheating",
            "Other",
        ])
        return data
    }
}
