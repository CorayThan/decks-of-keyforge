import { round } from "lodash"
import { HasAerc } from "../aerc/HasAerc"
import { Utils } from "../config/Utils"
import { activeSasExpansions } from "../expansions/Expansions"
import { CardType } from "../generated-src/CardType"
import { Expansion } from "../generated-src/Expansion"
import { House } from "../generated-src/House"
import { Rarity } from "../generated-src/Rarity"
import { SimpleCard } from "../generated-src/SimpleCard"
import { SynergyTrait } from "../generated-src/SynergyTrait"
import { SynTraitPlayer } from "../generated-src/SynTraitPlayer"
import { Wins } from "../generated-src/Wins"
import { CsvData } from "../generic/CsvDownloadButton"
import { statsStore } from "../stats/StatsStore"
import { synTraitValueToString } from "../synergy/SynTraitValue"
import { ExtraCardInfo } from "../generated-src/ExtraCardInfo"

export interface KCard {
    id: string
    cardTitle: string
    house: House
    houses: House[]
    frontImage: string
    cardType: CardType
    cardText: string
    traits?: string[]
    amber: number
    power: number
    armor: number
    powerString: string
    armorString: string
    rarity: Rarity
    flavorText?: string
    cardNumber: string
    expansion: number
    maverick: boolean
    anomaly: boolean
    enhanced?: boolean
    big?: boolean
    effectivePower: number

    wins?: number
    losses?: number
    winRate?: number

    aercScore: number
    aercScoreMax?: number

    extraCardInfo: ExtraCardInfo

    cardNumbers?: CardNumberSetPair[]

    /**
     * Key is BackendExpansion
     */
    expansionWins?: { [key: string]: Wins }
}

export interface CardNumberSetPair {
    expansion: Expansion
    cardNumber: string
}

export const winPercentForCard = (card: KCard): number | undefined => {
    if (card.wins == null || card.losses == null) {
        return undefined
    }
    return (card.wins / (card.wins + card.losses))
}

const cardNameReplacementRegex = /[^\d\w\s]/g
const spaceRegex = /\s/g
export const cardNameToCardNameKey = (name: string) => {
    return name.replace(cardNameReplacementRegex, "")
        .replace(spaceRegex, "-")
        .toLowerCase()
}

export const findCardImageUrl = (card: SimpleCard) => {
    return `https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/${cardNameToCardNameKey(card.cardTitle)}.png`
}

export interface CardWinRates {
    expansion?: Expansion
    winRatePercent?: number
    relativeToAveragePercent?: number
    wins?: number
    losses?: number

}

export const minCardWinsToDisplay = 250

export class CardUtils {

    static bonusIconCount = (card: SimpleCard): number => {
        return (card.bonusAember ?? 0) + (card.bonusDamage ?? 0) + (card.bonusDraw ?? 0) + (card.bonusCapture ?? 0)
    }

    static cardMatchesFriendlyTrait = (card: KCard, trait: SynergyTrait): boolean => {
        return card.extraCardInfo?.traits?.find(traitValue =>
            (traitValue.trait === trait && traitValue.player !== SynTraitPlayer.ENEMY)
        ) != null
    }

    static findCardsWithFriendlyTrait = (cards: KCard[], trait: SynergyTrait): KCard[] => {
        return cards.filter(card => CardUtils.cardMatchesFriendlyTrait(card, trait))
    }

    static cardAverageRelativeWinRate = (card: KCard): number => {

        const winRates = CardUtils.cardWinRates(card)
            .map(winRate => winRate.relativeToAveragePercent)
            .filter(rate => rate != null)

        if (winRates.length === 0) {
            return 0
        }

        return winRates.reduce(function (prev, current) {
            return prev! + current!
        })! / winRates.length
    }

    static cardWinRates = (card: KCard): CardWinRates[] => {
        const winRates: CardWinRates[] = []
        const expansionWins = card.expansionWins
        if (expansionWins != null && card.houses.length > 0) {
            activeSasExpansions.forEach(expansion => {
                const wins = expansionWins[expansion]
                if (wins != null && (wins.wins + wins.losses > minCardWinsToDisplay)) {
                    const winRatePercent = CardUtils.calcWinRate(wins.wins, wins.losses)
                    const expHouseWinPercent = statsStore.winRateForExpansionAndHouse(expansion, card.houses[0])
                    let relativeToAveragePercent
                    if (expHouseWinPercent != null) {
                        relativeToAveragePercent = round(winRatePercent - expHouseWinPercent, 1)
                    }
                    winRates.push({
                        expansion,
                        wins: wins.wins,
                        losses: wins.losses,
                        winRatePercent: round(winRatePercent, 1),
                        relativeToAveragePercent
                    })
                }
            })
        }

        const totalWinRate = card.winRate
        if (totalWinRate != null && winRates.length !== 1 && !isNaN(totalWinRate)) {
            winRates.unshift({
                winRatePercent: round(totalWinRate * 100, 1),
                wins: card.wins,
                losses: card.losses,
            })
        }

        return winRates
    }

    private static calcWinRate = (wins: number, losses: number) => {
        return (wins / (wins + losses)) * 100
    }

    static fakeRatingFromAerc = (card: HasAerc) => {
        const aerc = card.averageAercScore!
        if (aerc <= 0.5) {
            return 0
        } else if (aerc <= 1) {
            return 1
        } else if (aerc <= 2) {
            return 2
        } else if (aerc <= 3) {
            return 3
        }
        return 4
    }

    static arrayToCSV = (cards: KCard[]): CsvData => {
        const data = cards.map(card => {

            return [
                card.cardTitle,
                card.houses,
                card.cardNumbers?.map(numbers => `${numbers.expansion} – ${numbers.cardNumber}`),
                card.cardType,
                card.rarity,
                card.aercScore,
                card.aercScoreMax,
                card.extraCardInfo.amberControl,
                card.extraCardInfo.amberControlMax,
                card.extraCardInfo.expectedAmber,
                card.extraCardInfo.expectedAmberMax,
                card.extraCardInfo.creatureProtection,
                card.extraCardInfo.creatureProtectionMax,
                card.extraCardInfo.artifactControl,
                card.extraCardInfo.artifactControlMax,
                card.extraCardInfo.creatureControl,
                card.extraCardInfo.creatureControlMax,
                card.effectivePower,
                card.extraCardInfo.effectivePowerMax,
                card.extraCardInfo.efficiency,
                card.extraCardInfo.recursion,
                card.extraCardInfo.efficiencyMax,
                card.extraCardInfo.recursionMax,
                card.extraCardInfo.disruption,
                card.extraCardInfo.disruptionMax,
                card.extraCardInfo.other,
                card.extraCardInfo.otherMax,

                card.amber,
                card.powerString,
                card.armorString,
                card.wins,
                card.losses,

                card.extraCardInfo.traits.map(trait => synTraitValueToString(trait)),
                card.extraCardInfo.synergies.map(value => synTraitValueToString(value)),
                card.traits,
                Utils.removeLineBreaks(card.cardText),
                Utils.removeLineBreaks(card.flavorText ?? ""),
            ]
        })
        data.unshift([
            "Name",
            "House",
            "Expansion – #",
            "Type",
            "Rarity",
            "Aerc Min",
            "Aerc Max",
            "Amber Control",
            "Amber Control Max",
            "Expected Amber",
            "Expected Amber Max",
            "Creature Protection",
            "Creature Protection Max",
            "Artifact Control",
            "Artifact Control Max",
            "Creature Control",
            "Creature Control Max",
            "Effective Power",
            "Effective Power Max",
            "Efficiency",
            "Efficiency Max",
            "Recursion",
            "Recursion Max",
            "Disruption",
            "Disruption Max",
            "Other",
            "Other Max",

            "Raw Amber",
            "Power",
            "Armor",

            "Wins",
            "Losses",

            "SAS traits",
            "Synergies",

            "Traits",
            "Text",
            "Flavor Text"
        ])
        return data
    }
}
