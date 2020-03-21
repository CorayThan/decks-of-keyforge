import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { DeckViewFullView } from "../../decks/DeckViewFull"
import { Loader } from "../../mui-restyled/Loader"
import { theoreticalDeckStore } from "./TheoreticalDeckStore"

export const ViewTheoreticalDeck = observer(() => {
    const {id} = useParams()

    useEffect(() => {
        theoreticalDeckStore.findDeck(id)
    }, [id])

    if (theoreticalDeckStore.deck == null) {
        return <Loader/>
    }

    return <DeckViewFullView deck={theoreticalDeckStore.deck}/>
})
