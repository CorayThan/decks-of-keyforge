import { Box, Button, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"
import { cardStore } from "../../cards/CardStore"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { activeExpansions } from "../../expansions/Expansions"
import { ExpansionSelector, SelectedExpansion } from "../../expansions/ExpansionSelector"
import { Expansion } from "../../generated-src/Expansion"
import { House } from "../../generated-src/House"
import { TheoryCard } from "../../generated-src/TheoryCard"
import { HelperText } from "../../generic/CustomTypographies"
import { KeyCard } from "../../generic/KeyCard"
import { HouseSelect, SelectedHouses } from "../../houses/HouseSelect"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { Loader } from "../../mui-restyled/Loader"
import { userStore } from "../../user/UserStore"
import { deckBuilderStore, DisplayCardsInHouseEditable } from "../DeckBuilder"
import { CardsInHouses } from "../DeckBuilderData"
import { theoreticalDeckStore } from "./TheoreticalDeckStore"

export const CreateTheoreticalDeck = observer(() => {

    const [expansionStore] = useState(new SelectedExpansion(activeExpansions))
    const [housesStore] = useState(new SelectedHouses([House.Dis, House.Logos, House.Shadows]))

    const resetDeck = () => {
        const cards: CardsInHouses = {}
        housesStore.getHousesSelectedTrue().forEach(house => cards[house] = [])
        deckBuilderStore.currentDeck = {
            name: "The One that Theoretically Exists",
            cards,
            expansion: expansionStore.currentExpansionOrDefault()
        }
    }

    useEffect(() => {
        theoreticalDeckStore.savedDeckId = undefined
        resetDeck()
    }, [])

    useEffect(() => {
        resetDeck()
    }, [expansionStore.currentExpansionOrDefault()])

    useEffect(() => {
        const oldCards: CardsInHouses = deckBuilderStore.currentDeck?.cards!
        const cards: CardsInHouses = {}
        const houses = housesStore.getHousesSelectedTrue()
        houses.forEach(house => {
            if (oldCards[house] == null) {
                cards[house] = []
            } else if (houses.includes(house)) {
                cards[house] = oldCards[house]
            }
        })
        deckBuilderStore.currentDeck = {
            name: "The One that Theoretically Exists",
            cards,
            expansion: expansionStore.currentExpansionOrDefault()
        }
    }, [housesStore.getHousesSelectedTrue()])

    if (!cardStore.cardsLoaded) {
        return <Loader/>
    }

    if (!userStore.loginInProgress && !userStore.theoreticalDecksAllowed) {
        return <Typography>Please become a $3 a month or more patron to create theoretical decks!</Typography>
    }

    const savedDeckId = theoreticalDeckStore.savedDeckId
    if (savedDeckId) {
        return <Redirect to={Routes.theoreticalDeckPage(savedDeckId)}/>
    }

    return (
        <div style={{display: "flex", flexDirection: "column", padding: spacing(4), alignItems: "center"}}>
            <div>
                <Box display={"flex"} flexWrap={"wrap"}>
                    <ExpansionSelector store={expansionStore} style={{marginBottom: spacing(2), marginRight: spacing(2), width: 200}}/>
                    <Box flexGrow={1}/>
                    <div>
                        <LinkButton href={Routes.myTheoreticalDecks}>My Past Theories</LinkButton>
                    </div>
                </Box>
                <div style={{maxWidth: 784}}>
                    <HouseSelect style={{marginBottom: spacing(4)}} selectedHouses={housesStore}/>
                </div>
                <CreateTheoreticalDeckBuilder expansion={expansionStore.currentExpansionOrDefault()} houses={housesStore.getHousesSelectedTrue()}/>
                <Button onClick={resetDeck} style={{marginRight: spacing(2)}}>
                    Reset
                </Button>
                <KeyButton
                    variant={"contained"}
                    color={"primary"}
                    style={{marginRight: spacing(2)}}
                    disabled={!deckBuilderStore.deckIsValid}
                    loading={theoreticalDeckStore.savingDeck}
                    onClick={() => {
                        theoreticalDeckStore.saveTheoreticalDeck(deckBuilderStore.currentDeck!)
                    }}
                >
                    View
                </KeyButton>
                {Utils.isDev() && (
                    <KeyButton
                        onClick={() => {
                            deckBuilderStore.currentDeck!.cards["Shadows"] = cardStore.allCards.slice(0, 12).map(card => ({
                                name: card.cardTitle,
                                enhanced: false
                            }))
                            deckBuilderStore.currentDeck!.cards["Dis"] = cardStore.allCards.slice(0, 12).map(card => ({name: card.cardTitle, enhanced: false}))
                            deckBuilderStore.currentDeck!.cards["Logos"] = cardStore.allCards.slice(0, 12).map(card => ({
                                name: card.cardTitle,
                                enhanced: false
                            }))
                        }}
                    >
                        Add test cards
                    </KeyButton>
                )}
                <HelperText style={{marginTop: spacing(2)}}>Changing the expansion will reset your cards.</HelperText>
                <HelperText style={{marginTop: spacing(1)}}>
                    After clicking view you can use the URL to share or save the theoretical deck. It will not be searchable.
                </HelperText>
            </div>
        </div>
    )
})

const CreateTheoreticalDeckBuilder = observer((props: { expansion: Expansion, houses: House[] }) => {

    const {expansion} = props

    if (deckBuilderStore.currentDeck == null) {
        return null
    }

    const deckCards = Object.entries(deckBuilderStore.currentDeck?.cards)

    return (
        <KeyCard
            topContents={
                <Typography variant={"h4"}>{deckBuilderStore.currentDeck?.name}</Typography>
            }
            light={true}
            style={{overflow: "visible", width: 784}}
            margin={0}
        >
            <div style={{display: "flex", flexWrap: "wrap", margin: spacing(2), paddingBottom: spacing(2)}}>
                {deckCards.map((value: [string, TheoryCard[]], index: number) => {
                    return (
                        <div key={value[0]} style={{marginRight: index !== 2 ? spacing(2) : 0}}>
                            <DisplayCardsInHouseEditable house={value[0] as House} cards={value[1]} expansion={expansion}/>
                        </div>
                    )
                })}
            </div>
        </KeyCard>
    )
})
