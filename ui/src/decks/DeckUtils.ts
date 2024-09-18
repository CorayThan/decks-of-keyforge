import {EnhancementType} from "../cards/EnhancementType";
import {ExtendedExpansionUtils} from "../expansions/ExtendedExpansionUtils";
import {cardStore} from "../cards/CardStore";
import {FrontendCard} from "../generated-src/FrontendCard";
import {userStore} from "../user/UserStore";
import {SynergyTrait} from "../generated-src/SynergyTrait";
import {log, roundToHundreds} from "../config/Utils";
import {SynergyCombo} from "../generated-src/SynergyCombo";
import {House} from "../generated-src/House";
import {CsvData} from "../generic/CsvDownloadButton";
import {userDeckStore} from "../userdeck/UserDeckStore";
import {DeckSearchResult, TraitInDeckInfo} from "./models/DeckSearchResult";

export class DeckUtils {

    static calculateBonusIcons = (deck: DeckSearchResult): Map<EnhancementType, number> | undefined => {
        if (ExtendedExpansionUtils.allowsEnhancements(deck.expansion)) {

            let enhancedAmber = 0
            let enhancedCapture = 0
            let enhancedDamage = 0
            let enhancedDraw = 0
            let enhancedDiscard = 0
            let enhancedBrobnar = 0
            let enhancedDis = 0
            let enhancedEkwidon = 0
            let enhancedGeistoid = 0
            let enhancedLogos = 0
            let enhancedMars = 0
            let enhancedSkyborn = 0

            const cards = deck.housesAndCards
                .flatMap(house => house.cards.map(simpleCard => cardStore.fullCardFromCardName(simpleCard.cardTitle)))
                .filter(card => card != null) as FrontendCard[]


            cards.forEach(card => {
                enhancedAmber += card.extraCardInfo.enhancementAmber
                enhancedCapture += card.extraCardInfo.enhancementCapture
                enhancedDamage += card.extraCardInfo.enhancementDamage
                enhancedDraw += card.extraCardInfo.enhancementDraw
                enhancedDiscard += card.extraCardInfo.enhancementDiscard
                enhancedBrobnar += card.extraCardInfo.enhancementBrobnar ? 1 : 0
                enhancedDis += card.extraCardInfo.enhancementDis ? 1 : 0
                enhancedEkwidon += card.extraCardInfo.enhancementEkwidon ? 1 : 0
                enhancedGeistoid += card.extraCardInfo.enhancementGeistoid ? 1 : 0
                enhancedLogos += card.extraCardInfo.enhancementLogos ? 1 : 0
                enhancedMars += card.extraCardInfo.enhancementMars ? 1 : 0
                enhancedSkyborn += card.extraCardInfo.enhancementSkyborn ? 1 : 0
            })

            if (enhancedAmber + enhancedCapture + enhancedDamage + enhancedDraw + enhancedDiscard === 0) {
                return undefined
            }

            const enhancements = new Map<EnhancementType, number>()
            enhancements.set(EnhancementType.AEMBER, enhancedAmber)
            enhancements.set(EnhancementType.CAPTURE, enhancedCapture)
            enhancements.set(EnhancementType.DAMAGE, enhancedDamage)
            enhancements.set(EnhancementType.DRAW, enhancedDraw)
            enhancements.set(EnhancementType.DISCARD, enhancedDiscard)
            enhancements.set(EnhancementType.BROBNAR, enhancedBrobnar)
            enhancements.set(EnhancementType.DIS, enhancedDis)
            enhancements.set(EnhancementType.EKWIDON, enhancedEkwidon)
            enhancements.set(EnhancementType.GEISTOID, enhancedGeistoid)
            enhancements.set(EnhancementType.LOGOS, enhancedLogos)
            enhancements.set(EnhancementType.MARS, enhancedMars)
            enhancements.set(EnhancementType.SKYBORN, enhancedSkyborn)

            return enhancements
        }

        return undefined
    }

    static findPrice = (deck: DeckSearchResult, myPriceOnly?: boolean): number | undefined => {
        const saleInfo = deck.deckSaleInfo
        if (saleInfo && saleInfo.length > 0) {
            for (const info of saleInfo) {
                if (!myPriceOnly || info.username === userStore.username) {
                    return info.buyItNow
                }
            }
        }
        return undefined
    }

    static findHighestBid = (deck: DeckSearchResult): number | undefined => {
        const saleInfo = deck.deckSaleInfo
        if (saleInfo && saleInfo.length > 0) {
            for (const info of saleInfo) {
                if (info.highestBid != null) {
                    return info.highestBid
                }
            }
        }
        return undefined
    }

    static traits = (deck: DeckSearchResult): Map<SynergyTrait, TraitInDeckInfo> => {
        const traitsInDeck: Map<SynergyTrait, TraitInDeckInfo> = new Map()
        const houses = deck.housesAndCards.map(houseAndCards => houseAndCards.house)
        deck.housesAndCards.forEach(houseAndCards => {
            houseAndCards.cards.forEach(card => {
                const fullCard = cardStore.fullCardFromCardName(card.cardTitle)
                fullCard?.extraCardInfo?.traits?.forEach(trait => {
                    let traitInDeck = traitsInDeck.get(trait.trait)
                    if (traitInDeck == null) {
                        const newTrait = {
                            trait: trait.trait,
                            count: 0,
                            strength: 0,
                            houseCounts: new Map()
                        }
                        traitsInDeck.set(trait.trait, newTrait)
                        traitInDeck = newTrait
                        houses.forEach(house => {
                            newTrait.houseCounts.set(house, 0)
                        })
                    }
                    log.info("Add trait " + trait.trait)
                    traitInDeck.count += 1
                    traitInDeck.strength += trait.rating
                    traitInDeck.houseCounts.set(houseAndCards.house, traitInDeck.houseCounts.get(houseAndCards.house)! + 1)
                })
            })
        })
        log.info("Trait size " + traitsInDeck.size)
        return traitsInDeck
    }

    static sasForHouse = (combos: SynergyCombo[], accessor?: (combo: SynergyCombo) => number, house?: House): number => {
        let filteredCombos = combos
        if (house != null) {
            filteredCombos = combos.filter(combo => combo.house === house)
        }
        return filteredCombos.length === 0 ? 0 : filteredCombos
            .map(combo => (accessor == null ? combo.aercScore : accessor(combo)) * combo.copies)
            .reduce((prev, next) => prev + next)
    }

    static synergiesRounded = (synergies: DeckSearchResult) => {
        const {
            amberControl,
            expectedAmber,
            creatureProtection,
            artifactControl,
            creatureControl,
            effectivePower,
            efficiency,
            recursion,
            disruption,
            other,
            ...rest
        } = synergies
        return {
            amberControl: roundToHundreds(amberControl),
            expectedAmber: roundToHundreds(expectedAmber),
            creatureProtection: roundToHundreds(creatureProtection),
            artifactControl: roundToHundreds(artifactControl),
            creatureControl: roundToHundreds(creatureControl),
            effectivePower: roundToHundreds(effectivePower),
            efficiency: roundToHundreds(efficiency),
            recursion: roundToHundreds(recursion),
            disruption: roundToHundreds(disruption),
            other: roundToHundreds(other),
            ...rest
        }
    }

    static arrayToCSV = (decks: DeckSearchResult[]): CsvData => {
        log.debug("Perform deck array to csv")

        const data = decks.map(deck => {
            const synergies = DeckUtils.synergiesRounded(deck)
            const enhancements = DeckUtils.calculateBonusIcons(deck)
            const house1 = deck.housesAndCards[0]
            const house2 = deck.housesAndCards[1]
            const house3 = deck.housesAndCards[2]
            let house1SAS = "House 1 missing"
            let house2SAS = ""
            let house3SAS = ""
            let house1Cards = "House 1 missing"
            let house2Cards = ""
            let house3Cards = ""
            if (house1 != null) {
                house1SAS = DeckUtils.sasForHouse(synergies.synergyDetails!, undefined, house1.house).toString()
                house1Cards = house1.cards.map(card => card.cardTitle).join("|")
            }
            if (house2 != null) {
                house2SAS = DeckUtils.sasForHouse(synergies.synergyDetails!, undefined, house2.house).toString()
                house2Cards = house2.cards.map(card => card.cardTitle).join("|")
            }
            if (house3 != null) {
                house3SAS = DeckUtils.sasForHouse(synergies.synergyDetails!, undefined, house3.house).toString()
                house3Cards = house3.cards.map(card => card.cardTitle).join("|")
            }
            return [
                deck.name,
                deck.housesAndCards.map(houseAndCards => houseAndCards.house),
                deck.expansion,
                synergies.sasRating,
                synergies.synergyRating,
                synergies.antisynergyRating,
                deck.sasPercentile,
                synergies.aercScore,
                synergies.amberControl,
                synergies.expectedAmber,
                synergies.creatureProtection,
                synergies.artifactControl,
                synergies.creatureControl,
                synergies.effectivePower,
                synergies.efficiency,
                synergies.recursion,
                synergies.disruption,
                synergies.other,

                house1SAS,
                house2SAS,
                house3SAS,

                deck.creatureCount,
                deck.actionCount,
                deck.artifactCount,
                deck.upgradeCount,

                deck.rawAmber,
                enhancements?.get(EnhancementType.CAPTURE) ?? 0,
                enhancements?.get(EnhancementType.DAMAGE) ?? 0,
                enhancements?.get(EnhancementType.DRAW) ?? 0,
                enhancements?.get(EnhancementType.DISCARD) ?? 0,
                enhancements?.get(EnhancementType.BROBNAR) ?? 0,
                enhancements?.get(EnhancementType.DIS) ?? 0,
                enhancements?.get(EnhancementType.EKWIDON) ?? 0,
                enhancements?.get(EnhancementType.GEISTOID) ?? 0,
                enhancements?.get(EnhancementType.LOGOS) ?? 0,
                enhancements?.get(EnhancementType.MARS) ?? 0,
                enhancements?.get(EnhancementType.SKYBORN) ?? 0,

                deck.keyCheatCount,
                deck.cardDrawCount,
                deck.cardArchiveCount,
                deck.totalPower,
                deck.totalArmor,

                deck.powerLevel,
                deck.chains,
                deck.wins,
                deck.losses,

                deck.forSale,
                deck.forTrade,
                DeckUtils.findPrice(deck),
                house1Cards,
                house2Cards,
                house3Cards,
                deck.wishlistCount,
                deck.funnyCount,
                `https://decksofkeyforge.com/decks/${deck.keyforgeId}`,
                `https://www.keyforgegame.com/deck-details/${deck.keyforgeId}`,
                deck.lastSasUpdate,

                (deck.id != null && userDeckStore.notesForDeck(deck.id)) ?? ""
            ]
        })
        data.unshift([
            "Name",
            "Houses",
            "Expansion",
            "Sas Rating",
            "Synergy Rating",
            "Antisynergy Rating",
            "Sas Percentile",
            "Raw Aerc Score",
            "Amber Control",
            "Expected Amber",
            "Creature Protection",
            "Artifact Control",
            "Creature Control",
            "Effective Power",
            "Efficiency",
            "Recursion",
            "Disruption",
            "Other",

            "House 1 SAS",
            "House 2 SAS",
            "House 3 SAS",

            "Creature Count",
            "Action Count",
            "Artifact Count",
            "Upgrade Count",

            "Bonus Amber",
            "Bonus Capture",
            "Bonus Damage",
            "Bonus Draw",
            "Bonus Discard",
            "Bonus Brobnar",
            "Bonus Dis",
            "Bonus Ekwidon",
            "Bonus Geistoid",
            "Bonus Logos",
            "Bonus Mars",
            "Bonus Skyborn",

            "Key Cheat Count",
            "Card Draw Count",
            "Card Archive Count",
            "Total Power",
            "Total Armor",

            "Power Level",
            "Chains",
            "Wins",
            "Losses",

            "For Sale",
            "For Trade",
            "Price",

            "House 1 Cards",
            "House 2 Cards",
            "House 3 Cards",
            "Wishlist",
            "Funny",
            "DoK Link",
            "Master Vault Link",
            "Last SAS Update",

            "My Notes"
        ])
        return data
    }
}
