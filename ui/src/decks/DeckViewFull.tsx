import { Card } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { cardStore } from "../cards/CardStore"
import { spacing } from "../config/MuiConfig"
import { Loader } from "../mui-restyled/Loader"
import { DeckStatsView, ExtraDeckStatsView } from "../stats/DeckStatsView"
import { DeckSynergiesInfoView } from "../synergy/DeckSynergiesInfoView"
import { uiStore } from "../ui/UiStore"
import { ComparisonPopover } from "./comparison/ComparisonPopover"
import { deckImportPopStore } from "./DeckImportPop"
import { deckStore } from "./DeckStore"
import { DeckViewSmall } from "./DeckViewSmall"
import { DeckWithSynergyInfo } from "./models/DeckSearchResult"
import { ForSaleView } from "./sales/ForSaleView"
import { AllianceDeckPopover } from "../alliancedecks/AllianceDeckPopover";
import { useParams } from "react-router-dom";
import { DeckType } from "../generated-src/DeckType";

export const DeckViewPage = observer(() => {
    const {keyforgeDeckId} = useParams<{ keyforgeDeckId: string }>()

    useEffect(() => {
        deckStore.deck = undefined
        deckStore.saleInfo = undefined
        deckStore.randomDeckId = undefined
        deckStore.importedDeck = undefined
        deckImportPopStore.popOpen = false

        uiStore.setTopbarValues("Deck", "Deck", "")

        deckStore.findDeck(keyforgeDeckId)
        deckStore.findDeckSaleInfo(keyforgeDeckId)

    }, [keyforgeDeckId])

    const deck = deckStore.deck

    if (deck == null) {
        return <Loader/>
    }
    return <DeckViewFullView deck={deck}/>
})

interface DeckViewFullViewProps {
    deck: DeckWithSynergyInfo
    fake?: boolean
}

export const DeckViewFullView = observer((props: DeckViewFullViewProps) => {
    const {deck, fake} = props

    useEffect(() => {
        uiStore.setTopbarValues(deck.deck.name, "Deck", "")
    }, [deck])

    if (!cardStore.cardsLoaded) {
        return <Loader/>
    }

    const {saleInfo} = deckStore
    let saleInfoComponent = null
    if (saleInfo) {
        saleInfoComponent = (
            <Card style={{margin: spacing(2)}}>
                <ForSaleView
                    saleInfo={saleInfo}
                    deckName={deck.deck.name}
                    keyforgeId={deck.deck.keyforgeId}
                    deckId={deck.deck.id}
                />
            </Card>
        )
    } else if (!fake && deck.deck.deckType !== DeckType.ALLIANCE) {
        saleInfoComponent = <Loader/>
    }

    return (
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
            <ExtraDeckStatsView deck={deck.deck}/>
            <DeckViewSmall deck={deck.deck} fullVersion={true} hideActions={fake} fake={fake}/>
            <DeckStatsView deck={deck.deck}/>
            {saleInfoComponent}
            <DeckSynergiesInfoView
                synergies={deck}
            />
            <ComparisonPopover/>
            <AllianceDeckPopover/>
        </div>
    )
})
