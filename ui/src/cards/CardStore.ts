import axios, { AxiosResponse } from "axios"
import { sortBy } from "lodash"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
import { CardFilters } from "./CardFilters"
import { KCard, winPercentForCard } from "./KCard"

export class CardStore {

    static readonly CONTEXT = HttpConfig.API + "/cards"
    private static innerInstance: CardStore

    @observable
    cards?: KCard[]

    @observable
    searchingForCards = false

    @observable
    allCards: KCard[] = []

    @observable
    cardNameLowercaseToCard?: Map<string, KCard>

    @observable
    cardNames: Array<{ label: string, value: string }> = []

    @observable
    cardFlavors: string[] = ["Gotta go, gotta go, gotta go..."]

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

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
                (filters.ratings.length === 0 || filters.ratings.indexOf(card.extraCardInfo.rating - 1) !== -1)
                &&
                (filters.ambers.length === 0 || filters.ambers.indexOf(card.amber) !== -1)
                &&
                (filters.powers.length === 0 || filters.powers.indexOf(card.power) !== -1)
                &&
                (filters.armors.length === 0 || filters.armors.indexOf(card.armor) !== -1)
            )
        })

        if (filters.sort === "CARD_RATING") {
            filtered = sortBy(filtered, ["extraCardInfo.rating", "cardNumber"])
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
                        card.extraCardInfo.deckManipulation +
                        card.effectivePower / 10
                })
                log.debug(`All wins: ${allWins}`)
                this.allCards = basisForCards
                this.cards = basisForCards.slice()
                this.cardNameLowercaseToCard = new Map()
                this.cardFlavors = []
                this.cardNames = this.allCards!.map(card => {
                    this.cardNameLowercaseToCard!.set(card.cardTitle.toLowerCase(), card)
                    if (card.flavorText) {
                        this.cardFlavors.push(card.flavorText)
                    }
                    return {label: card.cardTitle, value: card.cardTitle}
                })
            })
    }

    fullCardFromCardWithName = (card: Partial<KCard>) => {
        if (this.cardNameLowercaseToCard && card.cardTitle) {
            return this.cardNameLowercaseToCard.get(card.cardTitle.toLowerCase())
        }
        return card
    }
}
