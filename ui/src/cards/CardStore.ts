import axios, { AxiosResponse } from "axios"
import { get, set } from "idb-keyval"
import { clone, sortBy } from "lodash"
import { computed, observable } from "mobx"
import { HasAerc } from "../aerc/HasAerc"
import { HttpConfig } from "../config/HttpConfig"
import { IdbUtils } from "../config/IdbUtils"
import { log, prettyJson, roundToHundreds, Utils } from "../config/Utils"
import { Cap } from "../decks/search/ConstraintDropdowns"
import { expansionInfos, expansionNumberForExpansion } from "../expansions/Expansions"
import { ExtraCardInfo } from "../extracardinfo/ExtraCardInfo"
import { Expansion } from "../generated-src/Expansion"
import { includeCardOrSpoiler } from "../spoilers/SpoilerStore"
import { statsStore } from "../stats/StatsStore"
import { userStore } from "../user/UserStore"
import { CardFilters, CardSort } from "./CardFilters"
import { cardNameToCardNameKey, CardNumberSetPair, CardUtils, CardWinRates, KCard, winPercentForCard } from "./KCard"

export class CardStore {

    static readonly CONTEXT = HttpConfig.API + "/cards"
    private nonAlphanumericSpaceRegex = /[^a-zA-Z0-9\s\-,]/g
    private cardsVersionKey = "cardsVersion"
    private cardsKey = "cards"

    @observable
    cards?: KCard[]

    @observable
    searchingForCards = false

    @observable
    cardsLoaded = false

    allCards: KCard[] = []

    private cardNameLowercaseToCard?: Map<string, KCard>
    private cardNameLowercaseToHasAerc?: Map<string, HasAerc>

    @observable
    cardNames: string[] = []

    @observable
    cardTraits: string[] = []

    @observable
    cardFlavors: string[] = ["Gotta go, gotta go, gotta go..."]

    @observable
    cardNameSearchResults: KCard[] = []

    @observable
    private previousExtraInfo?: { [cardName: string]: KCard }

    @observable
    private nextExtraInfo?: { [cardName: string]: KCard }

    @observable
    findingPreviousInfo = false

    @observable
    showFutureCardInfo = false

    @observable
    cardWinRatesLoaded = false

    private cardWinRates?: Map<string, CardWinRates[]>

    nextAdaptiveScore = (cardName: string) => {
        if (this.nextExtraInfo == null) {
            return 0
        }
        return this.nextExtraInfo[cardName]?.extraCardInfo?.adaptiveScore ?? 0
    }

    setupCardWinRates = () => {
        if (!cardStore.cardsLoaded || statsStore.stats == null || this.cardWinRatesLoaded) {
            return
        }

        const rates = new Map<string, CardWinRates[]>()

        this.allCards.forEach(card => {
            rates.set(this.cleanCardName(card.cardTitle), CardUtils.cardWinRates(card))
        })

        this.cardWinRates = rates
        this.cardWinRatesLoaded = true
    }

    findWinRate = (cardName: string) => this.cardWinRates?.get(this.cleanCardName(cardName))

    reset = () => {
        log.debug(`Reset this.cards in card store`)
        if (this.cards) {
            this.cards = undefined
        }
    }

    searchAndReturnCards = (filtersValue: CardFilters) => {

        if (filtersValue.aercHistory) {
            this.findPreviousExtraInfo()
        }

        const filters: CardFilters = clone(filtersValue)
        if (filters.sort == null) {
            filters.sort = CardSort.SET_NUMBER
        }

        log.info("Expansions not: " + filters.excludedExpansions)
        const toSearch = this.allCards
        let filtered = toSearch.slice().filter(card => {
            const extraInfo = this.findExtraInfoToUse(card)
            const cardNumsConverted = card.cardNumbers?.map(cardNum => cardNum.expansion === Expansion.ANOMALY_EXPANSION ? {expansion: Expansion.WORLDS_COLLIDE, cardNumber: cardNum.cardNumber} : cardNum)
            return (
                (filters.aercHistoryDate == null || card.extraCardInfo.publishedDate === filters.aercHistoryDate)
                &&
                includeCardOrSpoiler(filters, card)
                &&
                (filters.constraints.length === 0 || filters.constraints.every(constraint => {
                    const cardValue = extraInfo[constraint.property as keyof ExtraCardInfo] as number
                    const constraintValue = Number(constraint.value)
                    if (constraint.cap == Cap.MAX) {
                        return cardValue <= constraintValue
                    } else {
                        return cardValue >= constraintValue
                    }
                }))
                &&
                (filters.trait == null || extraInfo.traits.some(infoTrait => infoTrait.trait === filters.trait))
                &&
                (filters.synergy == null || extraInfo.synergies.some(infoTrait => infoTrait.trait === filters.synergy))
                &&
                (filters.powers.length === 0 || filters.powers.indexOf(card.power) !== -1)
                &&
                (filters.expansions.length === 0 || cardNumsConverted?.find(cardNum => filters.expansions.includes(expansionNumberForExpansion(cardNum.expansion))) != null)
                &&
                (filters.excludedExpansions.length === 0 || cardNumsConverted?.find(cardNum => filters.excludedExpansions.includes(expansionNumberForExpansion(cardNum.expansion))) == null)
            )
        })

        if (filters.sort === CardSort.AERC) {
            filtered = sortBy(filtered, [(card) => this.hasAercFromCardName(card.cardTitle)!.averageAercScore!, "cardNumber"])
        } else if (filters.sort === "EXPECTED_AMBER") {
            filtered = sortBy(filtered, ["extraCardInfo.expectedAmber", "cardNumber"])
        } else if (filters.sort === "AMBER_CONTROL") {
            filtered = sortBy(filtered, ["extraCardInfo.amberControl", "cardNumber"])
        } else if (filters.sort === "CREATURE_CONTROL") {
            filtered = sortBy(filtered, ["extraCardInfo.creatureControl", "cardNumber"])
        } else if (filters.sort === "ARTIFACT_CONTROL") {
            filtered = sortBy(filtered, ["extraCardInfo.artifactControl", "cardNumber"])
        } else if (filters.sort === "WIN_RATE") {
            filtered = sortBy(
                filtered
                    .filter(card => ((card.wins ?? 0) + (card.losses ?? 0)) > 1000),
                ["winRate", "cardNumber"])
        } else if (filters.sort === "RELATIVE_WIN_RATE") {
            filtered = sortBy(filtered, card => CardUtils.cardAverageRelativeWinRate(card))
        } else if (filters.sort === "NAME") {
            filtered = sortBy(filtered, ["cardTitle", "cardNumber"])

        } else if (filters.sort === "SET_NUMBER" && filters.expansions.length !== 1) {
            log.info("Sort by house then card number")
            filtered = sortBy(filtered, (card: KCard) => {
                return `${card.house}${card.cardNumber.toString().padStart(4, "0")}`
            })
        } else if (filters.sort === "SET_NUMBER") {
            filtered = sortBy(filtered, (card: KCard) => {
                const cardNumbers = card.cardNumbers?.filter((cardNumber: CardNumberSetPair) => filters.expansions.includes(expansionNumberForExpansion(cardNumber.expansion))) ?? []
                if (cardNumbers.length > 0) {
                    return cardNumbers[0].cardNumber
                } else {
                    return card.cardNumber
                }
            })
        }

        if (filters.sort === "SET_NUMBER" || filters.sort === "NAME") {
            if (filters.sortDirection === "ASC") {
                filtered.reverse()
            }
        } else if (filters.sortDirection === "DESC") {
            filtered.reverse()
        }

        return filtered.slice()
    }

    searchCards = (filters: CardFilters) => {
        this.cards = this.searchAndReturnCards(filters)
        log.debug(`Changed this.cards to ${this.cards.length}`)
    }

    /**
     * Returns new version if there is one.
     */
    private checkCardsVersion = async () => {
        const versionResponse: AxiosResponse<number> = await axios.get(`${CardStore.CONTEXT}-version`)
        const version = versionResponse.data
        const preexistingVersion = await get(this.cardsVersionKey)
        if (version !== preexistingVersion) {
            log.info(`Cards data versions did not match. New version: ${version} Old: ${preexistingVersion}`)
            return version
        }
        return undefined
    }

    loadAllCards = async () => {
        this.searchingForCards = true

        let cardsLoaded: KCard[]

        if (await IdbUtils.canUseIdb()) {
            const newVersion = await this.checkCardsVersion()

            const msStart = performance.now()
            if (newVersion == null) {
                // this version of cards already saved, just load it
                cardsLoaded = await get(this.cardsKey)
            } else {
                const cardsData: AxiosResponse<KCard[]> = await axios.get(`${CardStore.CONTEXT}`)
                cardsLoaded = cardsData.data.slice()
                await set(this.cardsKey, cardsLoaded)
                await set(this.cardsVersionKey, newVersion)
            }
            log.info(`Loaded cards from ${newVersion == null ? "db" : "api"} took ${Math.round(performance.now() - msStart)}ms`)
        } else {
            const cardsData: AxiosResponse<KCard[]> = await axios.get(`${CardStore.CONTEXT}`)
            cardsLoaded = cardsData.data.slice()
        }

        log.debug(`Start load all cards async`)
        this.searchingForCards = false

        cardsLoaded.forEach(card => {
            card.winRate = winPercentForCard(card)
            card.enhanced = false
        })
        this.cardNameLowercaseToCard = new Map()
        this.cardNameLowercaseToHasAerc = new Map()
        this.cardNames = cardsLoaded.map(card => {
            this.cardNameLowercaseToCard!.set(this.cleanCardName(card.cardTitle.toLowerCase()), card)
            this.cardNameLowercaseToHasAerc!.set(this.cleanCardName(card.cardTitle.toLowerCase()), this.hasAercFromCard(card))
            return card.cardTitle
        })
        this.allCards = cardsLoaded

        if (userStore.contentCreator) {
            this.findNextExtraInfo()
            this.loadCardTraits()
        }

        log.debug(`End load all cards async`)
        this.cardsLoaded = true
        this.setupCardWinRates()

    }

    loadCardFlavors = () => {
        this.allCards.map(card => {
            if (card.flavorText) {
                this.cardFlavors.push(card.flavorText)
            }
        })
    }

    loadCardTraits = () => {
        const traits: Set<string> = new Set()
        this.allCards.map(card => {
            if (card.traits != null) {
                card.traits.forEach(trait => traits.add(trait))
            }
        })
        this.cardTraits = Array.from(traits)
    }

    findCardNamesForExpansion = () => {
        const cardNamesForExpansion: {
            expansion: Expansion,
            names: string[]
        }[] = expansionInfos.map(info => ({expansion: info.backendEnum, names: []}))
        this.allCards.map(card => {
            this.cardNameLowercaseToCard!.set(this.cleanCardName(card.cardTitle.toLowerCase()), card)
            cardNamesForExpansion.forEach(cardNamesForExpansion => {
                if (card.cardNumbers?.map(cardNum => cardNum.expansion).includes(cardNamesForExpansion.expansion)) {
                    cardNamesForExpansion.names.push(card.cardTitle)
                }
            })

            return card.cardTitle
        })
        return cardNamesForExpansion
    }

    findCardsByName = (searchValue: string) => {
        if (Utils.tokenizeCardSearch(searchValue).length === 0) {
            this.cardNameSearchResults = []
        } else {
            this.cardNameSearchResults = this.allCards.slice().filter(card => Utils.cardNameIncludes(card.cardTitle, searchValue))
            if (this.cardNameSearchResults.length > 5) {
                this.cardNameSearchResults = this.cardNameSearchResults.slice(0, 5)
            }
        }
    }

    findPreviousExtraInfo = async () => {
        if (this.previousExtraInfo != null || this.findingPreviousInfo) {
            return
        }
        this.findingPreviousInfo = true
        log.debug("Find previous extra card info")
        const prevInfo = await axios.get(`${CardStore.CONTEXT}/historical`)
        this.findingPreviousInfo = false
        this.previousExtraInfo = prevInfo.data
        log.debug("Found previous info")
        log.debug("prev info for waking nightmare" + prettyJson(this.findPrevExtraInfoForCard("Waking Nightmare")))
    }

    findNextExtraInfo = async () => {
        if (this.nextExtraInfo == null) {
            const nextInfo = await axios.get(`${CardStore.CONTEXT}/future`)
            this.nextExtraInfo = nextInfo.data
        }
    }

    fullCardFromCardName = (cardTitle: string) => {
        if (this.cardNameLowercaseToCard) {
            return this.cardNameLowercaseToCard.get(this.cleanCardName(cardTitle.toLowerCase()))
        }
        return undefined
    }

    hasAercFromCardName = (cardTitle: string) => {
        if (this.cardNameLowercaseToHasAerc) {
            return this.cardNameLowercaseToHasAerc.get(this.cleanCardName(cardTitle.toLowerCase()))
        }
        return undefined
    }

    fullCardFromCardNameKey = (cardNameKey: string) => {
        return this.allCards.find(card => cardNameToCardNameKey(card.cardTitle) === cardNameKey)
    }

    findExtraInfoToUse = (card: KCard) => {
        let extraInfo = card.extraCardInfo
        if (this.showFutureCardInfo && this.nextExtraInfo && this.nextExtraInfo[card.cardTitle] != null) {
            extraInfo = this.nextExtraInfo[this.cleanCardName(card.cardTitle)].extraCardInfo
        }
        return extraInfo
    }

    findPrevExtraInfoForCard = (cardName: string) => {
        if (this.previousExtraInfo == null) {
            return undefined
        }
        return this.previousExtraInfo[this.cleanCardName(cardName)]
    }

    findNextExtraInfoForCard = (cardName: string) => {
        if (this.nextExtraInfo == null) {
            return undefined
        }
        return this.nextExtraInfo[this.cleanCardName(cardName)]
    }

    @computed
    get aercUpdateDates(): string[] {
        if (this.allCards != null) {
            const datesSet = new Set(this.allCards.map(card => card.extraCardInfo.publishedDate))
            log.debug("Update dates: " + Array.from(datesSet.values()).sort().reverse())
            return Array.from(datesSet.values()).filter(date => date != null).sort().reverse()
        }
        return []
    }

    @computed
    get mostRecentAercUpdateDate(): string | undefined {
        const dates = this.aercUpdateDates
        if (dates.length > 0) {
            return dates[0]
        }
        return undefined
    }

    /**
     * Don't use on the fly
     * @param card
     */
    private hasAercFromCard = (card: KCard): HasAerc => {
        const {effectivePower, aercScore, aercScoreMax} = card
        const extraCardInfo = cardStore.findExtraInfoToUse(card)
        const {
            amberControl, expectedAmber, creatureControl, artifactControl, efficiency, recursion, creatureProtection, disruption, other,
            amberControlMax, expectedAmberMax, creatureControlMax, artifactControlMax, efficiencyMax, recursionMax, effectivePowerMax, creatureProtectionMax, disruptionMax, otherMax
        } = extraCardInfo

        let averageAercScore = card.aercScore
        if (card.aercScoreMax != null) {
            averageAercScore = roundToHundreds((card.aercScore + card.aercScoreMax) / 2)
        }

        return {
            amberControl,
            expectedAmber,
            creatureControl,
            artifactControl,
            efficiency,
            recursion,
            effectivePower,
            creatureProtection,
            disruption,
            other,
            amberControlMax,
            expectedAmberMax,
            creatureControlMax,
            artifactControlMax,
            efficiencyMax,
            recursionMax,
            effectivePowerMax,
            creatureProtectionMax,
            disruptionMax,
            otherMax,
            aercScoreMax: aercScoreMax == null ? undefined : roundToHundreds(aercScoreMax),
            aercScore: roundToHundreds(aercScore),
            averageAercScore
        }
    }

    private cleanCardName = (cardName: string) => {
        return cardName.replace(this.nonAlphanumericSpaceRegex, "")
    }
}

export const cardStore = new CardStore()
