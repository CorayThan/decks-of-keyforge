import { Box, Button, Divider, IconButton } from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { sortBy } from "lodash"
import { autorun, computed, makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { cardStore } from "../cards/CardStore"
import { SingleCardSearchSuggest } from "../cards/SingleCardSearchSuggest"
import { CardAsLine } from "../cards/views/CardAsLine"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { DeckSearchResult } from "../decks/models/DeckSearchResult"
import { expansionInfoMap, possibleCardExpansionsForExpansion } from "../expansions/Expansions"
import { ExtendedExpansionUtils } from "../expansions/ExtendedExpansionUtils"
import { Expansion } from "../generated-src/Expansion"
import { House } from "../generated-src/House"
import { TheoryCard } from "../generated-src/TheoryCard"
import { HouseLabel } from "../houses/HouseUtils"
import { CardsInHouses, DeckBuilderData } from "./DeckBuilderData"
import { FrontendCard } from "../generated-src/FrontendCard"
import { EnhancementType } from "../cards/EnhancementType"

class DeckBuilderStore {
    @observable
    currentDeck?: DeckBuilderData

    @observable
    houses?: House[]

    @observable
    enhanceCardDialogInfo?: { house: House, cardIdx: number }

    constructor() {
        makeObservable(this)
    }

    @computed
    get deckIsValid(): boolean {
        const deck = this.currentDeck
        if (!deck) {
            return false
        }
        const {name} = deck
        if (name.trim().length === 0 || name === "Unrecognized Deck Name") {
            return false
        }
        if (deck.expansion == null) {
            return false
        }
        const entries = Object.entries(this.currentDeck!.cards)
        if (entries.length !== 3) {
            return false
        }
        let valid = true
        entries.forEach((value: [string, TheoryCard[]]) => {
            if (value[1].length !== 12) {
                valid = false
            }
        })
        return valid
    }

    stopEnhancingCard = () => this.enhanceCardDialogInfo = undefined

    removeCard = (house: House, cardIdx: number) => {
        this.currentDeck!.cards[house]!.splice(cardIdx, 1)
    }

    cardToEnhance = (): TheoryCard | undefined => {
        if (this.enhanceCardDialogInfo == null) {
            return undefined
        }
        return this.currentDeck!.cards[this.enhanceCardDialogInfo.house]![this.enhanceCardDialogInfo.cardIdx]
    }

    enhanceCard = (enhanceType: EnhancementType, add: boolean) => {
        if (this.enhanceCardDialogInfo == null) {
            log.warn("No card available to enhance")
            return
        }
        const enhanceThis = this.currentDeck!.cards[this.enhanceCardDialogInfo.house]![this.enhanceCardDialogInfo.cardIdx]
        const change = add ? 1 : -1
        switch (enhanceType) {
            case EnhancementType.AEMBER:
                enhanceThis.bonusAember += change
                break
            case EnhancementType.CAPTURE:
                enhanceThis.bonusCapture += change
                break
            case EnhancementType.DAMAGE:
                enhanceThis.bonusDamage += change
                break
            case EnhancementType.DISCARD:
                enhanceThis.bonusDiscard += change
                break
            case EnhancementType.DRAW:
                enhanceThis.bonusDraw += change
                break
            case EnhancementType.BROBNAR:
                enhanceThis.bonusBobnar = add
                break
            case EnhancementType.DIS:
                enhanceThis.bonusDis = add
                break
            case EnhancementType.EKWIDON:
                enhanceThis.bonusEkwidon = add
                break
            case EnhancementType.GEISTOID:
                enhanceThis.bonusGeistoid = add
                break
            case EnhancementType.LOGOS:
                enhanceThis.bonusLogos = add
                break
            case EnhancementType.MARS:
                enhanceThis.bonusMars = add
                break
            case EnhancementType.SKYBORN:
                enhanceThis.bonusSkyborn = add
                break
        }
    }

    addCardHandler = (house: House) => {
        const cardHolder = observable({
            option: ""
        })

        autorun(() => {
            if (cardHolder.option !== "") {

                const foundCard = cardStore.fullCardFromCardName(cardHolder.option)!
                log.debug(`Pushing ${foundCard.cardTitle} to house ${house}`)
                const houseCards = this.currentDeck!.cards[house]
                houseCards.push({
                    name: foundCard.cardTitle,
                    enhanced: false,
                    bonusAember: foundCard.amber,
                    bonusCapture: 0,
                    bonusDamage: 0,
                    bonusDiscard: 0,
                    bonusDraw: 0,
                    bonusBobnar: false,
                    bonusDis: false,
                    bonusEkwidon: false,
                    bonusGeistoid: false,
                    bonusLogos: false,
                    bonusMars: false,
                    bonusSkyborn: false,
                })
                this.currentDeck!.cards[house] = sortBy(houseCards, (card: TheoryCard) => cardStore.fullCardFromCardName(card.name)?.cardType)
                cardHolder.option = ""
            }
        })
        return cardHolder
    }

    buildFromDeck = (deck: DeckSearchResult) => {
        const cards: CardsInHouses = {}
        this.houses = []
        deck.housesAndCards.forEach(houseAndCards => {
            this.houses?.push(houseAndCards.house)
            cards[houseAndCards.house] = houseAndCards.cards.map(card => ({
                name: card.cardTitle,
                enhanced: card.enhanced ?? false,
                bonusAember: card.bonusAember ?? 0,
                bonusCapture: card.bonusCapture ?? 0,
                bonusDamage: card.bonusDamage ?? 0,
                bonusDiscard: card.bonusDiscard ?? 0,
                bonusDraw: card.bonusDraw ?? 0,
                bonusBobnar: card.bonusBobnar ?? false,
                bonusDis: card.bonusDis ?? false,
                bonusEkwidon: card.bonusEkwidon ?? false,
                bonusGeistoid: card.bonusGeistoid ?? false,
                bonusLogos: card.bonusLogos ?? false,
                bonusMars: card.bonusMars ?? false,
                bonusSkyborn: card.bonusSkyborn ?? false,
            }))
        })
        this.currentDeck = {
            name: "Imaginary " + deck.name,
            expansion: deck.expansion,
            cards
        }
    }
}

export const deckBuilderStore = new DeckBuilderStore()

@observer
export class DisplayCardsInHouseEditable extends React.Component<{
    house: House,
    cards: TheoryCard[],
    expansion: Expansion
}> {
    render() {
        const {house, cards, expansion} = this.props
        const searchSuggestCardNames = Array.from(new Set(cardStore.findCardNamesForExpansion().flatMap(forExp => {
            const validExpansions = possibleCardExpansionsForExpansion(expansionInfoMap.get(expansion)!.expansionNumber)
            if (validExpansions.includes(expansionInfoMap.get(forExp.expansion)!.expansionNumber)) {
                return forExp.names
            } else {
                return []
            }
        })))
        const showEnhanced = ExtendedExpansionUtils.allowsEnhancements(expansion)

        return (
            <div style={{display: "flex", flexDirection: "column", width: 240}}>
                <HouseLabel title={true} house={house}/>
                <Divider style={{marginTop: 4}}/>
                {cards.map((card, idx) => {
                    const fullCard = cardStore.fullCardFromCardName(card.name) as FrontendCard
                    log.info(`Card ${fullCard.cardTitle} enhanced aember ${card.bonusAember}`)
                    return (
                        <Box display={"flex"} alignItems={"center"} key={idx}>
                            <CardAsLine
                                card={{
                                    ...card,
                                    cardTitle: fullCard.cardTitle,
                                    cardTitleUrl: fullCard.cardTitleUrl,
                                }}
                                width={showEnhanced ? 120 : 160}
                                marginTop={4}
                                cardActualHouse={this.props.house}
                            />
                            <Box flexGrow={1}/>
                            {showEnhanced && (
                                <Button
                                    onClick={() => deckBuilderStore.enhanceCardDialogInfo = {house, cardIdx: idx}}
                                    size={"small"}
                                >
                                    Enhance
                                </Button>
                            )}
                            <IconButton
                                size={"small"}
                                style={{width: 32, height: 32, minWidth: 32, minHeight: 32}}
                                onClick={() => deckBuilderStore.removeCard(house, idx)}
                            >
                                <Delete color={"action"} fontSize={"small"}/>
                            </IconButton>
                        </Box>
                    )
                })}
                <div style={{flexGrow: 1}}/>
                {cards.length < 12 ? (
                    <SingleCardSearchSuggest
                        selected={deckBuilderStore.addCardHandler(house)}
                        style={{marginTop: spacing(1)}}
                        placeholder={"Add Card"}
                        names={searchSuggestCardNames}
                    />
                ) : null}
            </div>
        )

    }
}
