import { CardType } from "../cards/CardType"
import { findCardImageUrl } from "../cards/KCard"
import { Rarity } from "../cards/rarity/Rarity"
import { log } from "../config/Utils"
import { Expansion } from "../expansions/Expansions"
import { House } from "../houses/House"
import { reprints, sanctumoniusCards } from "./Santumpmius"
import { Spoiler } from "./Spoiler"
import { spoilerStore } from "./SpoilerStore"

export const makeSpoilers = (preExisting: Spoiler[]): Partial<Spoiler>[] => {
    const preexistingCardNumbers = preExisting.map(spoiler => spoiler.cardNumber)
    return sanctumoniusCards
        .map(spoiler => {
            const mySpoiler: Partial<Spoiler> = {
                cardTitle: spoiler.N,
                cardType: spoiler.T as CardType | undefined,
                frontImage: spoiler.I,
                cardText: spoiler.C,
                powerString: spoiler.p,
                armorString: spoiler.a,
                rarity: spoiler.R as Rarity | undefined,
                cardNumber: spoiler.X
            }

            if (mySpoiler.powerString == null) mySpoiler.powerString = ""
            if (mySpoiler.armorString == null) mySpoiler.armorString = ""

            mySpoiler.expansion = Expansion.WC
            if (spoiler.H) {
                if (spoiler.H === "Anomaly") {
                    mySpoiler.anomaly = true
                    mySpoiler.house = undefined
                } else if (spoiler.H === "Star Alliance") {
                    mySpoiler.house = House.StarAlliance
                } else if (spoiler.H === "Saurian") {
                    mySpoiler.house = House.Saurian
                } else {
                    mySpoiler.house = spoiler.H as House
                }
            }

            return mySpoiler
        })
        .filter(spoiler => spoiler.cardTitle != null && spoiler.cardTitle.length > 0
            && spoiler.cardNumber != null && spoiler.cardNumber.length > 0)
        .filter(sanctCard => !preexistingCardNumbers.includes(sanctCard.cardNumber!.padStart(3, "0")))
}

export const addUrlsToCards = (preExisting: Spoiler[]): Spoiler[] => {
    const sanctCards = sanctumoniusCards
        .map(card => ({
            cardNumber: card.X.trim().padStart(3, "0"),
            url: card.I
        }))
    return preExisting
        .filter(spoiler => spoiler.frontImage == null || spoiler.frontImage === "")
        .map(spoiler => {
            if (spoiler.cardTitle === "Alaka's Brew") {
                log.debug("Alaka's brew ")
            }
            const sanctCard = sanctCards.find(card => spoiler.cardNumber === card.cardNumber)
            if (sanctCard != null) {
                spoiler.frontImage = sanctCard.url
            }
            return spoiler
        })
        .filter(spoiler => spoiler.frontImage != null && spoiler.frontImage !== "")
}

export const makeOldCards = (preExisting: Spoiler[]): Partial<Spoiler>[] => {
    const preexistingCardNumbers = preExisting.map(spoiler => spoiler.cardNumber)
    return reprints
        .map(spoiler => {
            const mySpoiler: Partial<Spoiler> = {
                cardTitle: spoiler.N,
                cardType: spoiler.T as CardType | undefined,
                frontImage: findCardImageUrl({cardTitle: spoiler.N}),
                cardText: spoiler.C,
                powerString: spoiler.p,
                armorString: spoiler.a,
                rarity: spoiler.R as Rarity | undefined,
                cardNumber: spoiler.X,
                reprint: true
            }

            if (mySpoiler.powerString == null) mySpoiler.powerString = ""
            if (mySpoiler.armorString == null) mySpoiler.armorString = ""

            mySpoiler.expansion = Expansion.WC
            if (spoiler.H) {
                if (spoiler.H === "Anomaly") {
                    mySpoiler.anomaly = true
                    mySpoiler.house = undefined
                } else if (spoiler.H === "Star Alliance") {
                    mySpoiler.house = House.StarAlliance
                } else if (spoiler.H === "Saurian") {
                    mySpoiler.house = House.Saurian
                } else {
                    mySpoiler.house = spoiler.H as House
                }
            }

            return mySpoiler
        })
        .filter(spoiler => spoiler.cardTitle != null && spoiler.cardTitle.length > 0
            && spoiler.cardNumber != null && spoiler.cardNumber.length > 0)
        .filter(sanctCard => !preexistingCardNumbers.includes(sanctCard.cardNumber!.padStart(3, "0")))
}

export const addRealSpaces = async () => {
    await spoilerStore.loadAllSpoilers()
    const preexisting = spoilerStore.allSpoilers
    let updated = 0
    for (let x = 0; x < preexisting.length; x++) {
        const spoiler = preexisting[x]
        const updatedCardText = spoiler.cardText
            .replace("\u000a\u200b", " ")
            .replace("  ", " ")
        if (updatedCardText !== spoiler.cardText) {
            updated++
            spoiler.cardText = updatedCardText
            await spoilerStore.saveSpoiler(spoiler)
        }
    }
    log.debug(`updated spaces in ${updated}`)
}