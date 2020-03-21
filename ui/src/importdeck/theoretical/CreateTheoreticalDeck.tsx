import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"
import { cardStore } from "../../cards/CardStore"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { activeExpansions, BackendExpansion } from "../../expansions/Expansions"
import { ExpansionSelector, SelectedExpansion } from "../../expansions/ExpansionSelector"
import { KeyCard } from "../../generic/KeyCard"
import { House } from "../../houses/House"
import { HouseSelect, SelectedHouses } from "../../houses/HouseSelect"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { Loader } from "../../mui-restyled/Loader"
import { DisplayCardsInHouseEditable, saveUnregisteredDeckStore } from "../CreateUnregisteredDeck"
import { CardsInHouses } from "../SaveUnregisteredDeck"
import { theoreticalDeckStore } from "./TheoreticalDeckStore"

export const CreateTheoreticalDeck = observer(() => {

    const [expansionStore] = useState(new SelectedExpansion(activeExpansions))
    const [housesStore] = useState(new SelectedHouses([House.Dis, House.Logos, House.Shadows], 3))

    useEffect(() => {
        theoreticalDeckStore.savedDeckId = undefined
    }, [])

    if (cardStore.allCards.length === 0) {
        return <Loader/>
    }

    const savedDeckId = theoreticalDeckStore.savedDeckId
    if (savedDeckId) {
        return <Redirect to={Routes.theoreticalDeckPage(savedDeckId)} />
    }

    return (
        <div style={{display: "flex", flexDirection: "column", padding: spacing(4), alignItems: "center"}}>
            <div>
                <div>
                    <ExpansionSelector store={expansionStore} style={{marginBottom: spacing(4), width: 200}}/>
                </div>
                <div style={{maxWidth: 784}}>
                    <HouseSelect style={{marginBottom: spacing(4)}} selectedHouses={housesStore}/>
                </div>
                <CreateTheoreticalDeckBuilder expansion={expansionStore.currentExpansionOrDefault()} houses={housesStore.getHousesSelectedTrue()}/>
                <KeyButton
                    variant={"contained"}
                    color={"primary"}
                    style={{marginRight: spacing(2)}}
                    disabled={!saveUnregisteredDeckStore.deckIsValid}
                    loading={theoreticalDeckStore.savingDeck}
                    onClick={() => {
                        theoreticalDeckStore.saveTheoreticalDeck(saveUnregisteredDeckStore.currentDeck!)
                    }}
                >
                    View
                </KeyButton>
                {Utils.isDev() && (
                    <KeyButton
                        onClick={() => {
                            saveUnregisteredDeckStore.currentDeck!.cards["Shadows"] = cardStore.allCards.slice(0, 12).map(card => card.cardTitle)
                            saveUnregisteredDeckStore.currentDeck!.cards["Dis"] = cardStore.allCards.slice(0, 12).map(card => card.cardTitle)
                            saveUnregisteredDeckStore.currentDeck!.cards["Logos"] = cardStore.allCards.slice(0, 12).map(card => card.cardTitle)
                        }}
                    >
                        Add test cards
                    </KeyButton>
                )}
            </div>
        </div>
    )
})

const CreateTheoreticalDeckBuilder = observer((props: { expansion: BackendExpansion, houses: House[] }) => {

    const {expansion, houses} = props

    useEffect(() => {
        const cards: CardsInHouses = {}
        houses.forEach(house => cards[house] = [])
        saveUnregisteredDeckStore.currentDeck = {
            name: "The One that Theoretically Exists",
            cards,
            expansion
        }

        return () => {
            saveUnregisteredDeckStore.currentDeck = undefined
        }
    }, [expansion, houses.toString()])

    if (saveUnregisteredDeckStore.currentDeck == null) {
        return null
    }

    const deckCards = Object.entries(saveUnregisteredDeckStore.currentDeck?.cards)

    return (
        <KeyCard
            topContents={
                <Typography variant={"h4"}>{saveUnregisteredDeckStore.currentDeck?.name}</Typography>
            }
            light={true}
            style={{overflow: "visible", width: 784}}
            margin={0}
        >
            <div style={{display: "flex", flexWrap: "wrap", margin: spacing(2), paddingBottom: spacing(2)}}>
                {deckCards.map((value: [string, string[]], index: number) => {
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

