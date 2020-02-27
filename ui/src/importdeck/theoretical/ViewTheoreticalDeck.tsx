import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { DeckViewFullView } from "../../decks/DeckViewFull"
import { Loader } from "../../mui-restyled/Loader"
import { deckImportStore } from "../DeckImportStore"
import { SaveUnregisteredDeck } from "../SaveUnregisteredDeck"

export const ViewTheoreticalDeck = observer(() => {
    const {uriEncodedDeck} = useParams()

    const deck: SaveUnregisteredDeck = JSON.parse(decodeURIComponent(uriEncodedDeck))

    useEffect(() => {
        deckImportStore.viewTheoreticalDeck(deck)
    }, [uriEncodedDeck])

    if (deckImportStore.theoreticalDeck == null) {
        return <Loader/>
    }

    return <DeckViewFullView deck={deckImportStore.theoreticalDeck}/>
})
