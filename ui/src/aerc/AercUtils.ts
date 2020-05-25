import { hasAercFromCard, KCard } from "../cards/KCard"
import { Rarity } from "../cards/rarity/Rarity"
import { roundToHundreds } from "../config/Utils"

export const aercProperties = [
    "amberControl",
    "expectedAmber",
    "artifactControl",
    "creatureControl",
    "effectivePower",
    "efficiency",
    "disruption",
    "creatureProtection",
    "other"
]

export interface CardAercData {
    [key: string]: number | string | undefined
}

export class AercUtils {
    static cardsAverageAerc = (cards: KCard[]): CardAercData => {
        const cumulative: CardAercData = {}
        cards
            .map(card => ({aerc: hasAercFromCard(card), card: card}))
            .forEach(cardAerc => {
                const aerc = cardAerc.aerc
                aercProperties.forEach(prop => {
                    // eslint-disable-next-line
                    // @ts-ignore
                    const cardMinAerc = aerc[prop]
                    // eslint-disable-next-line
                    // @ts-ignore
                    const cardMaxAerc = aerc[prop + "Max"]
                    let value = cardMinAerc
                    if (cardMaxAerc != null && cardMaxAerc !== 0) {
                        value = (cardMinAerc + cardMaxAerc) / 2
                    }
                    if (cardAerc.card.rarity == Rarity.Common) {
                        value = value * 8
                    } else if (cardAerc.card.rarity == Rarity.Uncommon) {
                        value = value * 3
                    }
                    const before = cumulative[prop]
                    if (before == null) {
                        cumulative[prop] = value
                    } else {
                        cumulative[prop] = value + before
                    }
                })
            })
        cumulative["effectivePower"] = cumulative["effectivePower"] as number / 10
        const weightedCards = cards.map((card: KCard): number => {
            if (card.rarity == Rarity.Common) {
                return 8
            } else if (card.rarity == Rarity.Uncommon) {
                return 3
            }
            return 1
        })
            .reduce((quantLeft, quantRight) => quantLeft + quantRight)

        aercProperties.forEach(prop => {
            cumulative[prop] = roundToHundreds(cumulative[prop] as number / weightedCards)
        })
        return cumulative
    }
}
