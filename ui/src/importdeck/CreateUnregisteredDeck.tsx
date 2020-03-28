import { Button, Divider, TextField, Typography } from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { cloneDeep, sortBy } from "lodash"
import { autorun, computed, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
import { SingleCardSearchSuggest } from "../cards/CardSearchSuggest"
import { CardAsLine } from "../cards/CardSimpleView"
import { cardStore } from "../cards/CardStore"
import { KCard } from "../cards/KCard"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log } from "../config/Utils"
import { BackendExpansion, expansionInfoMap, possibleCardExpansionsForExpansion } from "../expansions/Expansions"
import { KeyCard } from "../generic/KeyCard"
import { House, HouseLabel } from "../houses/House"
import { KeyButton } from "../mui-restyled/KeyButton"
import { deckImportStore } from "./DeckImportStore"
import { deckImportViewStore } from "./DeckImportView"
import { SaveUnregisteredDeck } from "./SaveUnregisteredDeck"

interface CreateUnregisteredDeckProps {
    initialDeck: SaveUnregisteredDeck
    expansion: BackendExpansion
}

class SaveUnregisteredDeckStore {
    @observable
    currentDeck?: SaveUnregisteredDeck

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
            cardName: ""
        })

        autorun(() => {
            if (cardHolder.cardName !== "") {
                const foundCard = cardStore.cardNameLowercaseToCard!.get(cardHolder.cardName.toLowerCase())!
                const copiedCard = cloneDeep(foundCard)
                if (copiedCard.house !== house) {
                    copiedCard.maverick = true
                    copiedCard.house = house
                }
                log.debug(`Pushing ${copiedCard.cardTitle} to house ${house}`)
                const houseCards = this.currentDeck!.cards[house]
                houseCards.push(copiedCard.cardTitle)
                this.currentDeck!.cards[house] = sortBy(houseCards, (card: string) => cardStore.fullCardFromCardName(card)?.cardNumber)
                cardHolder.cardName = ""
            }
        })
        return cardHolder
    }
}

export const saveUnregisteredDeckStore = new SaveUnregisteredDeckStore()

@observer
export class CreateUnregisteredDeck extends React.Component<CreateUnregisteredDeckProps> {

    componentDidMount(): void {
        this.setInfoFromProps(this.props)
        deckImportStore.newDeckId = undefined
    }

    componentDidUpdate(): void {
        if (saveUnregisteredDeckStore.currentDeck == null && this.props.initialDeck != null) {
            this.setInfoFromProps(this.props)
        }
    }

    setInfoFromProps = (props: CreateUnregisteredDeckProps) => {
        const expansion = expansionInfoMap.get(props.expansion)!
        saveUnregisteredDeckStore.currentDeck = cloneDeep(props.initialDeck)
        saveUnregisteredDeckStore.currentDeck.expansion = expansion.backendEnum
    }

    createUnregisteredDeck = () => {
        const deck = saveUnregisteredDeckStore.currentDeck
        if (deck) {
            deckImportStore.addUnregisteredDeck(deck)
        }
    }

    render() {
        if (deckImportStore.newDeckId) {
            return <Redirect to={Routes.deckPage(deckImportStore.newDeckId)}/>
        }

        if (saveUnregisteredDeckStore.currentDeck == null || cardStore.cardNameLowercaseToCard == null) {
            return null
        }
        const {name, cards} = saveUnregisteredDeckStore.currentDeck
        return (
            <div>
                <Typography style={{marginLeft: spacing(4)}} variant={"h4"}>Unregistered Deck</Typography>
                <Typography style={{margin: spacing(2), marginLeft: spacing(4)}} variant={"subtitle1"}>
                    Please make sure the title and cards are accurate, including punctuation.
                </Typography>
                <KeyCard
                    topContents={
                        <TextField
                            variant={"outlined"}
                            value={name}
                            label={"Deck Name"}
                            onChange={(event) => saveUnregisteredDeckStore.currentDeck!.name = event.target.value}
                            fullWidth={true}
                        />
                    }
                    light={true}
                    style={{overflow: "visible", marginLeft: spacing(4), width: 784}}
                >
                    <div style={{display: "flex", flexWrap: "wrap", margin: spacing(2), paddingBottom: spacing(2)}}>
                        {Object.entries(cards).map((value: [string, string[]], index: number) => {
                            return (
                                <div key={value[0]} style={{marginRight: index !== 2 ? spacing(2) : 0}}>
                                    <DisplayCardsInHouseEditable house={value[0] as House} cards={value[1]} expansion={this.props.expansion}/>
                                </div>
                            )
                        })}
                    </div>
                </KeyCard>
                <div style={{display: "flex", alignItems: "center"}}>
                    <Typography style={{marginLeft: spacing(4)}}>
                        Unregistered decks will be deleted when they are registered, or if no one has them marked as their deck.
                    </Typography>
                    <div style={{flexGrow: 1}}/>
                    <KeyButton
                        variant={"outlined"}
                        color={"primary"}
                        onClick={() => {
                            saveUnregisteredDeckStore.currentDeck = undefined
                            deckImportStore.readDeck = undefined
                            deckImportViewStore.deckImage = undefined
                        }}
                        style={{marginRight: spacing(2)}}
                    >
                        Clear
                    </KeyButton>
                    <KeyButton
                        variant={"contained"}
                        color={"primary"}
                        style={{marginRight: spacing(2)}}
                        disabled={!saveUnregisteredDeckStore.deckIsValid || deckImportStore.addingNewDeck}
                        onClick={this.createUnregisteredDeck}
                        loading={deckImportStore.addingNewDeck}
                    >
                        Save
                    </KeyButton>
                </div>
            </div>
        )
    }
}

@observer
export class DisplayCardsInHouseEditable extends React.Component<{ house: House, cards: string[], expansion: BackendExpansion }> {
    render() {
        const cards = this.props.cards.map(cardName => cardStore.fullCardFromCardName(cardName) as KCard)
        const searchSuggestCardNames = Array.from(new Set(cardStore.cardNamesForExpansion!.flatMap(forExp => {
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
                            onClick={() => saveUnregisteredDeckStore.removeCard(card)}
                        >
                            <Delete color={"action"}/>
                        </Button>
                    </div>
                ))}
                <div style={{flexGrow: 1}}/>
                {this.props.cards.length < 12 ? (
                    <SingleCardSearchSuggest
                        card={saveUnregisteredDeckStore.addCardHandler(this.props.house)}
                        style={{marginTop: spacing(2)}}
                        placeholder={"Add Card"}
                        names={searchSuggestCardNames}
                    />
                ) : null}
            </div>
        )

    }
}
