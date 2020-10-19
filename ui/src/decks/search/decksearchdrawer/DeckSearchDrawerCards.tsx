import * as React from "react"
import { memo } from "react"
import { SearchDrawerExpansionPanel } from "../../../components/SearchDrawerExpansionPanel"
import { Loader, LoaderSize } from "../../../mui-restyled/Loader"
import { DeckCardSelect, DeckCardSelectStore } from "../DeckCardSelect"

interface DeckSearchDrawerCardsProps {
    loading: boolean
    store: DeckCardSelectStore
}

export const DeckSearchDrawerCards = memo((props: DeckSearchDrawerCardsProps) => {
    const {
        loading, store
    } = props

    return (
        <SearchDrawerExpansionPanel
            initiallyOpen={!store.isDefaultValue()}
            title={"Cards"}
        >
            {loading ? (
                <Loader size={LoaderSize.SMALL}/>
            ) : (
                <DeckCardSelect store={store}/>
            )}
        </SearchDrawerExpansionPanel>
    )
})
