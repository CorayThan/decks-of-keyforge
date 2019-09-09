import axios, { AxiosResponse } from "axios"
import { sortBy } from "lodash"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
import { CardFilters, CardSort } from "./CardFilters"
import { OptionType } from "./CardSearchSuggest"
import { cardNameToCardNameKey, hasAercFromCard, KCard, winPercentForCard } from "./KCard"

export class CardStore {

    static readonly CONTEXT = HttpConfig.API + "/cards"

    @observable
    cards?: KCard[]

    @observable
    searchingForCards = false

    @observable
    allCards: KCard[] = []

    @observable
    cardNameLowercaseToCard?: Map<string, KCard>

    @observable
    cardNameHyphenDelimitedLowercaseToCard?: Map<string, KCard>

    @observable
    cardNames: OptionType[] = []

    @observable
    cardFlavors: string[] = ["Gotta go, gotta go, gotta go..."]

    @observable
    cardNameSearchResults: KCard[] = []

    reset = () => {
        if (this.cards) {
            this.cards = undefined
        }
    }

    searchCards = (filters: CardFilters) => {
        log.debug(`Card filters are ${prettyJson(filters)}`)
        let filtered = this.allCards.slice().filter(card => {
            return (
                (!filters.title || card.cardTitle.toLowerCase().includes(filters.title.toLowerCase().trim()))
                &&
                (!filters.description || card.cardText.toLowerCase().includes(filters.description.toLowerCase().trim()))
                &&
                (filters.houses.length === 0 || filters.houses.indexOf(card.house) !== -1)
                &&
                (filters.types.length === 0 || filters.types.indexOf(card.cardType) !== -1)
                &&
                (filters.rarities.length === 0 || filters.rarities.indexOf(card.rarity) !== -1)
                &&
                (filters.ratings.length === 0 || filters.ratings.indexOf(card.extraCardInfo.rating) !== -1)
                &&
                (filters.ambers.length === 0 || filters.ambers.indexOf(card.amber) !== -1)
                &&
                (filters.powers.length === 0 || filters.powers.indexOf(card.power) !== -1)
                &&
                (filters.armors.length === 0 || filters.armors.indexOf(card.armor) !== -1)
                &&
                (filters.expansion == null || card.extraCardInfo.cardNumbers.map(cardNumberSetPair => cardNumberSetPair.expansion).indexOf(filters.expansion) !== -1)
            )
        })

        if (filters.sort === "CARD_RATING") {
            filtered = sortBy(filtered, ["extraCardInfo.rating", "cardNumber"])
        } else if (filters.sort === CardSort.AERC) {
            filtered = sortBy(filtered, [(card) => hasAercFromCard(card).aercScore, "cardNumber"])
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
                const cardNumbers = card.extraCardInfo.cardNumbers.filter(cardNumber => cardNumber.expansion === filters.expansion)
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
        this.cards = filtered.slice()
    }

    loadAllCards = () => {
        this.searchingForCards = true
        axios.get(`${CardStore.CONTEXT}`)
            .then((response: AxiosResponse) => {
                this.searchingForCards = false
                const basisForCards: KCard[] = response.data.slice()
                let allWins = 0
                basisForCards.forEach(card => {
                    allWins += card.wins!
                    card.winRate = winPercentForCard(card)
                    card.aercScore =
                        card.extraCardInfo.amberControl +
                        card.extraCardInfo.expectedAmber +
                        card.extraCardInfo.artifactControl +
                        card.extraCardInfo.creatureControl +
                        card.extraCardInfo.efficiency +
                        card.effectivePower / 10
                })
                log.debug(`All wins: ${allWins}`)
                this.allCards = basisForCards
                this.cards = basisForCards.slice()
                this.cardNameLowercaseToCard = new Map()
                this.cardNameHyphenDelimitedLowercaseToCard = new Map()
                this.cardFlavors = []
                this.cardNames = this.allCards!.map(card => {
                    this.cardNameLowercaseToCard!.set(card.cardTitle.toLowerCase(), card)
                    this.cardNameHyphenDelimitedLowercaseToCard!.set(cardNameToCardNameKey(card.cardTitle), card)
                    if (card.flavorText) {
                        this.cardFlavors.push(card.flavorText)
                    }
                    return {label: card.cardTitle, value: card.cardTitle}
                })
            })
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

    private cardSearchTokenized = (searchValue: string) => searchValue
        .trim()
        .toLowerCase()
        .split(/\W+/)
        .filter(token => token.length > 2)
}

export const cardStore = new CardStore()
