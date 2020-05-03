import axios, { AxiosResponse } from "axios"
import { clone, sortBy, startCase } from "lodash"
import { computed, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { log } from "../config/Utils"
import { BackendExpansion, expansionInfos } from "../expansions/Expansions"
import { CardIdentifier } from "../extracardinfo/ExtraCardInfo"
import { OptionType } from "../mui-restyled/KeyMultiSearchSuggest"
import { includeCardOrSpoiler } from "../spoilers/SpoilerStore"
import { CardFilters, CardSort } from "./CardFilters"
import { cardNameToCardNameKey, hasAercFromCard, KCard, winPercentForCard } from "./KCard"

export class CardStore {

    static readonly CONTEXT = HttpConfig.API + "/cards"

    @observable
    cards?: KCard[]

    @observable
    searchingForCards = false

    @observable
    allCards: KCard[] = []

    // Format is ExpansionEnum-cardNumber
    @observable
    expansionNumberToCard?: Map<string, KCard>

    @observable
    cardNamesForExpansion?: {
        expansion: BackendExpansion,
        names: string[]
    }[]

    @observable
    cardNameLowercaseToCard?: Map<string, KCard>

    @observable
    cardNameHyphenDelimitedLowercaseToCard?: Map<string, KCard>

    @observable
    cardNames: OptionType[] = []

    @observable
    cardTraits: OptionType[] = []

    @observable
    cardFlavors: string[] = ["Gotta go, gotta go, gotta go..."]

    @observable
    cardNameSearchResults: KCard[] = []

    @observable
    previousExtraInfo?: { [cardName: string]: KCard }

    @observable
    findingPreviousInfo = false

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
        const toSearch = this.allCards
        let filtered = toSearch.slice().filter(card => {
            return (
                (filters.aercHistoryDate == null || card.extraCardInfo.publishedDate === filters.aercHistoryDate)
                &&
                includeCardOrSpoiler(filters, card)
                &&
                (filters.traits.length === 0 || filters.traits.some(trait => card.extraCardInfo.traits.some(extraCardTrait => trait === extraCardTrait.trait)))
                &&
                (filters.synergies.length === 0 || filters.synergies.some(trait => card.extraCardInfo.synergies.some(extraCardTrait => trait === extraCardTrait.trait)))
                &&
                (filters.powers.length === 0 || filters.powers.indexOf(card.power) !== -1)
                &&
                (!filters.thisExpansionOnly || card.extraCardInfo.cardNumbers.length === 1)
                &&
                (filters.expansion == null || card.extraCardInfo.cardNumbers.map((cardNumberSetPair: CardIdentifier) => cardNumberSetPair.expansion).indexOf(filters.expansion) !== -1)
            )
        })

        if (filters.sort === CardSort.AERC) {
            filtered = sortBy(filtered, [(card) => hasAercFromCard(card).averageAercScore!, "cardNumber"])
        } else if (filters.sort === "EXPECTED_AMBER") {
            filtered = sortBy(filtered, ["extraCardInfo.expectedAmber", "cardNumber"])
        } else if (filters.sort === "AMBER_CONTROL") {
            filtered = sortBy(filtered, ["extraCardInfo.amberControl", "cardNumber"])
        } else if (filters.sort === "CREATURE_CONTROL") {
            filtered = sortBy(filtered, ["extraCardInfo.creatureControl", "cardNumber"])
        } else if (filters.sort === "ARTIFACT_CONTROL") {
            filtered = sortBy(filtered, ["extraCardInfo.artifactControl", "cardNumber"])
        } else if (filters.sort === "WIN_RATE") {
            filtered = sortBy(filtered, ["winRate", "cardNumber"])
        } else if (filters.sort === "SET_NUMBER" && filters.expansion == null) {
            log.info("Sort by house then card number")
            filtered = sortBy(filtered, (card: KCard) => {
                return `${card.house}${card.cardNumber.toString().padStart(4, "0")}`
            })
        } else if (filters.sort === "SET_NUMBER") {
            filtered = sortBy(filtered, (card: KCard) => {
                const cardNumbers = card.extraCardInfo.cardNumbers.filter((cardNumber: CardIdentifier) => cardNumber.expansion === filters.expansion)
                if (cardNumbers.length > 0) {
                    return cardNumbers[0].cardNumber
                } else {
                    return card.cardNumber
                }
            })
        }

        if (filters.sort === "SET_NUMBER") {
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

    loadAllCards = () => {
        this.searchingForCards = true
        axios.get(`${CardStore.CONTEXT}`)
            .then((response: AxiosResponse) => {
                log.debug(`Start load all cards async`)
                this.searchingForCards = false
                const basisForCards: KCard[] = response.data.slice()
                basisForCards.forEach(card => {
                    card.winRate = winPercentForCard(card)
                })
                this.cardNameLowercaseToCard = new Map()
                this.cardNameHyphenDelimitedLowercaseToCard = new Map()
                this.expansionNumberToCard = new Map()
                this.cardNamesForExpansion = expansionInfos.map(info => ({expansion: info.backendEnum, names: []}))
                this.cardFlavors = []
                const traits: Set<string> = new Set()
                this.cardNames = basisForCards.map(card => {
                    this.cardNameLowercaseToCard!.set(card.cardTitle.toLowerCase(), card)
                    this.cardNameHyphenDelimitedLowercaseToCard!.set(cardNameToCardNameKey(card.cardTitle), card)
                    if (card.flavorText) {
                        this.cardFlavors.push(card.flavorText)
                    }
                    card.extraCardInfo.cardNumbers.forEach((cardIdentifier: CardIdentifier) => {
                        this.expansionNumberToCard!.set(`${cardIdentifier.expansion}-${cardIdentifier.cardNumber}`, card)
                    })
                    this.cardNamesForExpansion!.forEach(cardNamesForExpansion => {
                        if (card.extraCardInfo.cardNumbers.map(cardNum => cardNum.expansion).includes(cardNamesForExpansion.expansion)) {
                            cardNamesForExpansion.names.push(card.cardTitle)
                        }
                    })
                    if (card.traits != null) {
                        card.traits.forEach(trait => traits.add(trait))
                    }
                    return {label: card.cardTitle, value: card.cardTitle}
                })
                this.cardTraits = Array.from(traits).map(trait => ({label: startCase(trait.toLowerCase()), value: trait}))
                this.allCards = basisForCards
                log.debug(`End load all cards async`)
            })
    }

    findCardByIdentifier = (cardIdentifier: CardIdentifier) => {
        if (this.expansionNumberToCard == null) {
            return undefined
        }
        return this.expansionNumberToCard.get(`${cardIdentifier.expansion}-${cardIdentifier.cardNumber}`)
    }

    findCardsByName = (searchValue: string) => {
        const tokenized = this.cardSearchTokenized(searchValue)
        if (tokenized.length === 0) {
            this.cardNameSearchResults = []
        } else {
            this.cardNameSearchResults = this.allCards.slice().filter(card => {
                for (let x = 0; x < tokenized.length; x++) {
                    if (!card.cardTitle.toLowerCase().includes(tokenized[x])) {
                        return false
                    }
                }
                return true
            })
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
    }

    fullCardFromCardName = (cardTitle: string) => {
        return this.fullCardFromCardWithName({cardTitle})
    }

    fullCardFromCardNameKey = (cardNameKey: string) => {
        if (this.cardNameHyphenDelimitedLowercaseToCard) {
            return this.cardNameHyphenDelimitedLowercaseToCard.get(cardNameKey)
        }
        return undefined
    }

    fullCardFromCardWithName = (card: Partial<KCard>) => {
        if (this.cardNameLowercaseToCard && card && card.cardTitle) {
            return this.cardNameLowercaseToCard.get(card.cardTitle.toLowerCase())
        }
        return card
    }

    @computed
    get aercUpdateDates(): string[] {
        if (this.allCards != null) {
            const datesSet = new Set(this.allCards.map(card => card.extraCardInfo.publishedDate))
            log.debug("Update dates: " + Array.from(datesSet.values()).sort().reverse())
            return Array.from(datesSet.values()).sort().reverse()
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

    private cardSearchTokenized = (searchValue: string) => searchValue
        .trim()
        .toLowerCase()
        .split(/\W+/)
        .filter(token => token.length > 2)
}

export const cardStore = new CardStore()
