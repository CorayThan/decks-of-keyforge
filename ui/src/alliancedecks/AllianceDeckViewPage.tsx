import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import * as React from "react";
import { useEffect } from "react";
import { uiStore } from "../ui/UiStore";
import { Loader } from "../mui-restyled/Loader";
import { DeckViewFullView } from "../decks/DeckViewFull";
import { allianceDeckStore } from "./AllianceDeckStore";

export const AllianceDeckViewPage = observer(() => {
    const {id} = useParams<{ id: string }>()

    useEffect(() => {

        uiStore.setTopbarValues("Alliance Deck", "Alliance", "")

        allianceDeckStore.findDeck(id)

    }, [id])

    const deck = allianceDeckStore.deck

    if (deck == null) {
        return <Loader/>
    }
    return <DeckViewFullView deck={deck} fake={false}/>
})
