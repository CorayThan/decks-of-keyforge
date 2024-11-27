import axios, {AxiosResponse} from "axios"
import {get, set} from "idb-keyval"
import {clone, sortBy} from "lodash"
import {computed, makeObservable, observable} from "mobx"
import {HasAerc} from "../aerc/HasAerc"
import {HttpConfig} from "../config/HttpConfig"
import {IdbUtils} from "../config/IdbUtils"
import {log, roundToHundreds, Utils} from "../config/Utils"
import {Cap} from "../decks/search/ConstraintDropdowns"
import {expansionInfos, expansionNumberForExpansion} from "../expansions/Expansions"
import {Expansion} from "../generated-src/Expansion"
import {Rarity} from "../generated-src/Rarity"
import {statsStore} from "../stats/StatsStore"
import {userStore} from "../user/UserStore"
import {CardFilters, CardSort} from "./CardFilters"
import {cardNameToCardNameKey, CardUtils, CardWinRates} from "./KCard"
import {CardType} from "../generated-src/CardType"
import {ExtraCardInfo} from "../generated-src/ExtraCardInfo"
import {FrontendCard} from "../generated-src/FrontendCard"
import {CardNumberSetPair} from "../generated-src/CardNumberSetPair"
import {CardsMap} from "../generated-src/CardsMap"

export class CardStore {
    static readonly CONTEXT = HttpConfig.API + "/cards"
    @observable
    cards?: FrontendCard[]
    @observable
    searchingForCards = false
    @observable
    cardsLoaded = false
    @observable
    allCards: FrontendCard[] = []
    @observable
    allCardsNoTokens: FrontendCard[] = []
    @observable
    allTokens: FrontendCard[] = []
    @observable
    cardNames: string[] = []
    @observable
    cardTraits: string[] = []
    @observable
    cardFlavors: string[] = ["Gotta go, gotta go, gotta go..."]
    @observable
    cardNameSearchResults: FrontendCard[] = []
    @observable
    findingPreviousInfo = false
    @observable
    showFutureCardInfo = false
    @observable
    cardWinRatesLoaded = false
    private nonAlphanumericSpaceRegex = /[^a-zA-Z0-9\s\-,]/g
    private cardsVersionKey = "cardsVersion"
    private cardsKey = "cards"
    private cardNameLowercaseToCard?: Map<string, FrontendCard>
    private cardNameLowercaseToHasAerc?: Map<string, HasAerc>
    @observable
    private previousCards?: CardsMap
    @observable
    private futureCards?: CardsMap
    private cardWinRates?: Map<string, CardWinRates[]>

    constructor() {
        makeObservable(this)
    }

    @computed
    get aercUpdateDates(): string[] {
        if (this.allCards != null) {
            const datesSet = new Set(this.allCards.filter(card => card.extraCardInfo.publishedDate != null).map(card => card.extraCardInfo.publishedDate!))
            log.debug("Update dates: " + Array.from(datesSet.values()).sort().reverse())
            return Array.from(datesSet.values()).filter(date => date != null).sort().slice(1).reverse()
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
            const cardNumsConverted = card.cardNumbers.map((cardNum: CardNumberSetPair) => cardNum.expansion === Expansion.ANOMALY_EXPANSION ? {
                expansion: Expansion.WORLDS_COLLIDE,
                cardNumber: cardNum.cardNumber
            } : cardNum)
            return (
                (filters.aercHistoryDate == null || card.extraCardInfo.publishedDate === filters.aercHistoryDate)
                &&
                this.includeCard(filters, card)
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
                (!filters.anomalies || (filters.anomalies && card.expansions.find(expansion => expansion.expansion === Expansion.ANOMALY_EXPANSION) != null))
                &&
                (!filters.gigantic || (filters.gigantic && card.big))
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
        } else if (filters.sort === "NAME") {
            filtered = sortBy(filtered, ["cardTitle", "cardNumber"])
        } else if (filters.sort === "SET_NUMBER" && filters.expansions.length !== 1) {
            log.info("Sort by house then card name")
            filtered = sortBy(filtered, (card: FrontendCard) => {
                return `${card.houses}${card.cardTitle}`
            })
        } else if (filters.sort === "SET_NUMBER") {
            filtered = sortBy(filtered, (card: FrontendCard) => {
                const cardNumbers = card.cardNumbers?.filter((cardNumber: CardNumberSetPair) => filters.expansions.includes(expansionNumberForExpansion(cardNumber.expansion))) ?? []
                if (cardNumbers.length > 0) {
                    return cardNumbers[0].cardNumber
                } else {
                    return card.cardTitle
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

    loadAllCards = async () => {
        this.searchingForCards = true

        let cardsLoaded: FrontendCard[]

        if (IdbUtils.idbAvailable) {
            const newVersion = await this.checkCardsVersion()

            const msStart = performance.now()
            if (newVersion == null) {
                // this version of cards already saved, just load it
                cardsLoaded = (await get(this.cardsKey)) ?? []
            } else {
                const cardsData: AxiosResponse<FrontendCard[]> = await axios.get(`${CardStore.CONTEXT}`)
                cardsLoaded = cardsData.data.slice()
                await set(this.cardsKey, cardsLoaded)
                await set(this.cardsVersionKey, newVersion)
            }
            log.info(`Loaded cards from ${newVersion == null ? "db" : "api"} took ${Math.round(performance.now() - msStart)}ms`)
        } else {
            log.info("IDB unavailable in card store.")
            const cardsData: AxiosResponse<FrontendCard[]> = await axios.get(`${CardStore.CONTEXT}`)
            cardsLoaded = cardsData.data.slice()
        }

        log.debug(`Start load all cards async`)
        this.searchingForCards = false

        this.cardNameLowercaseToCard = new Map()
        this.cardNameLowercaseToHasAerc = new Map()
        this.cardNames = cardsLoaded.map(card => {
            this.cardNameLowercaseToCard!.set(this.cleanCardName(card.cardTitle.toLowerCase()), card)
            this.cardNameLowercaseToHasAerc!.set(this.cleanCardName(card.cardTitle.toLowerCase()), this.hasAercFromCard(card))
            return card.cardTitle
        })
        this.allCards = cardsLoaded
        this.allCardsNoTokens = cardsLoaded.filter(card => card.cardType !== CardType.TokenCreature)
        this.allTokens = cardsLoaded.filter(card => card.cardType === CardType.TokenCreature)

        if (userStore.contentCreator) {
            this.loadCardTraits()
        }
        if (userStore.displayFutureSas) {
            this.findNextExtraInfo()
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
        if (this.previousCards != null || this.findingPreviousInfo) {
            return
        }
        this.findingPreviousInfo = true
        log.debug("Find previous extra card info")
        const prevInfo: AxiosResponse<CardsMap> = await axios.get(`${CardStore.CONTEXT}/historical`)
        this.findingPreviousInfo = false
        this.previousCards = prevInfo.data
        log.debug("Found previous info")
    }

    findNextExtraInfo = async () => {
        if (this.futureCards == null) {
            const nextInfo: AxiosResponse<CardsMap> = await axios.get(`${CardStore.CONTEXT}/future`)
            this.futureCards = nextInfo.data
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

    findExtraInfoToUse = (card: FrontendCard) => {
        let extraInfo = card.extraCardInfo
        const cardNameKey = cardNameToCardNameKey(card.cardTitle)
        if ((userStore.displayFutureSas || this.showFutureCardInfo) && this.futureCards && this.futureCards.cards[cardNameKey] != null) {
            extraInfo = this.futureCards.cards[cardNameKey].extraCardInfo
        }
        return extraInfo
    }

    findPrevExtraInfoForCard = (cardTitle: string) => {
        if (this.previousCards == null) {
            return undefined
        }
        const cardNameKey = cardNameToCardNameKey(cardTitle)
        return this.previousCards.cards[cardNameKey]
    }

    findNextExtraInfoForCard = (cardTitle: string) => {
        if (this.futureCards == null) {
            return undefined
        }
        const cardNameKey = cardNameToCardNameKey(cardTitle)
        return this.futureCards.cards[cardNameKey]
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

    /**
     * Don't use on the fly
     * @param card
     */
    private hasAercFromCard = (card: FrontendCard): HasAerc => {
        const {effectivePower, aercScore, aercScoreMax} = card.extraCardInfo
        const extraCardInfo = cardStore.findExtraInfoToUse(card)
        const {
            amberControl,
            expectedAmber,
            creatureControl,
            artifactControl,
            efficiency,
            recursion,
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
            otherMax
        } = extraCardInfo

        let averageAercScore = card.extraCardInfo.aercScore
        if (card.extraCardInfo.aercScoreMax != null) {
            averageAercScore = roundToHundreds((card.extraCardInfo.aercScore + card.extraCardInfo.aercScoreMax) / 2)
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

    private includeCard = (filters: CardFilters, card: FrontendCard): boolean => {
        // Convert fixed rarity to Variant
        let cardRarities: Rarity[] = []
        card.expansions.forEach(expansion => {
            const cardExpansionRarity = expansion.rarity == Rarity.Special || expansion.rarity == Rarity.Variant || expansion.rarity == Rarity.FIXED ? Rarity.Variant : expansion.rarity
            cardRarities.push(cardExpansionRarity)
        })

        const filtersRarities = filters.rarities.map(rarity => (rarity as Rarity | "Special") === "Special" ? Rarity.Variant : rarity)

        return (!filters.title || Utils.cardNameIncludes(card.cardTitle, filters.title))
            &&
            (!filters.description || (
                card.cardText.toLowerCase().includes(filters.description.toLowerCase().trim())
                || (card.traits ?? []).join("").includes(filters.description.toLowerCase().trim())
            ))
            &&
            (filters.houses.length === 0 || (card.houses != null && card.houses.length > 0 && filters.houses.some(house => card.houses!.includes(house))))
            &&
            (filters.types.length === 0 || filters.types.indexOf(card.cardType) !== -1)
            &&
            (filtersRarities.length === 0 || (cardRarities.length > 0 && filtersRarities.find(filterRarity => cardRarities.includes(filterRarity)) != null))
            &&
            (filters.ambers.length === 0 || filters.ambers.indexOf(card.amber) !== -1)
    }
}

export const cardStore = new CardStore()
