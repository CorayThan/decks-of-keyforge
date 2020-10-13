import { Button, Divider } from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { cloneDeep, sortBy } from "lodash"
import { autorun, computed, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { cardStore } from "../cards/CardStore"
import { KCard } from "../cards/KCard"
import { SingleCardSearchSuggest } from "../cards/SingleCardSearchSuggest"
import { CardAsLine } from "../cards/views/CardAsLine"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { expansionInfoMap, possibleCardExpansionsForExpansion } from "../expansions/Expansions"
import { Expansion } from "../generated-src/Expansion"
import { House } from "../generated-src/House"
import { HouseLabel } from "../houses/HouseUtils"
import { DeckBuilderData } from "./DeckBuilderData"

class DeckBuilderStore {
    @observable
    currentDeck?: DeckBuilderData

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
        entries.forEach((value: [string, string[]]) => {
            if (value[1].length !== 12) {
                valid = false
            }
        })
        return valid
    }

    removeCard = (card: KCard) => {
        Object.entries(this.currentDeck!.cards).forEach((value: [string, string[]]) => {
            const cards = value[1]
            const firstIdx = cards.indexOf(card.cardTitle)
            if (firstIdx !== -1) {
                cards.splice(firstIdx, 1)
            }
        })
    }

    addCardHandler = (house: House) => {
        const cardHolder = observable({
            option: ""
        })

        autorun(() => {
            if (cardHolder.option !== "") {

                const foundCard = cardStore.fullCardFromCardName(cardHolder.option)!
                const copiedCard = cloneDeep(foundCard)
                if (copiedCard.house !== house) {
                    copiedCard.maverick = true
                    copiedCard.house = house
                }
                log.debug(`Pushing ${copiedCard.cardTitle} to house ${house}`)
                const houseCards = this.currentDeck!.cards[house]
                houseCards.push(copiedCard.cardTitle)
                this.currentDeck!.cards[house] = sortBy(houseCards, (card: string) => cardStore.fullCardFromCardName(card)?.cardNumber)
                cardHolder.option = ""
            }
        })
        return cardHolder
    }
}

export const deckBuilderStore = new DeckBuilderStore()

@observer
export class DisplayCardsInHouseEditable extends React.Component<{ house: House, cards: string[], expansion: Expansion }> {
    render() {
        const cards = this.props.cards.map(cardName => cardStore.fullCardFromCardName(cardName) as KCard)
        const searchSuggestCardNames = Array.from(new Set(cardStore.findCardNamesForExpansion().flatMap(forExp => {
            const validExpansions = possibleCardExpansionsForExpansion(expansionInfoMap.get(this.props.expansion)!.expansionNumber)
            if (validExpansions.includes(expansionInfoMap.get(forExp.expansion)!.expansionNumber)) {
                return forExp.names
            } else {
                return []
            }
        })))
        return (
            <div style={{display: "flex", flexDirection: "column", width: 240}}>
                <HouseLabel title={true} house={this.props.house}/>
                <Divider style={{marginTop: 4}}/>
                {cards.map((card, idx) => (
                    <div key={idx} style={{display: "flex", alignItems: "center"}}>
                        <CardAsLine card={card} width={160} marginTop={4} cardActualHouse={this.props.house}/>
                        <div style={{flexGrow: 1}}/>
                        <Button
                            size={"small"}
                            style={{width: 32, height: 32, minWidth: 32, minHeight: 32}}
                            onClick={() => deckBuilderStore.removeCard(card)}
                        >
                            <Delete color={"action"}/>
                        </Button>
                    </div>
                ))}
                <div style={{flexGrow: 1}}/>
                {this.props.cards.length < 12 ? (
                    <SingleCardSearchSuggest
                        selected={deckBuilderStore.addCardHandler(this.props.house)}
                        style={{marginTop: spacing(2)}}
                        placeholder={"Add Card"}
                        names={searchSuggestCardNames}
                    />
                ) : null}
            </div>
        )

    }
}
