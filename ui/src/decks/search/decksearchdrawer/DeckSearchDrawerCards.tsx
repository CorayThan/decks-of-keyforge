import { Box } from "@material-ui/core"
import * as React from "react"
import { useState } from "react"
import { SearchDrawerExpansionPanel } from "../../../components/SearchDrawerExpansionPanel"
import { Loader, LoaderSize } from "../../../mui-restyled/Loader"
import { DeckCardSelect } from "../DeckCardSelect"
import { DeckFilters } from "../DeckFilters"
import { observer } from "mobx-react"
import { cardStore } from "../../../cards/CardStore"
import { DeckCardQuantity } from "../../../generated-src/DeckCardQuantity"
import { log } from "../../../config/Utils"
import { DeckTokenSelect } from "../DeckTokenSelect"

export const DeckSearchDrawerCards = observer((props: { filters: DeckFilters }) => {

    const cards = cardStore.allCardsNoTokens
        .map(card => card.cardTitle)
    const tokens = cardStore.allTokens
        .map(card => card.cardTitle)

    const selectedCards = props.filters.cards
    const selectedTokens = props.filters.tokens

    const [initiallyOpen] = useState(!!(selectedCards && selectedCards.length) || !!(selectedTokens && selectedTokens.length))

    log.info(`in render initially open is ${initiallyOpen}`)

    const updateSelectedCards = (cards: DeckCardQuantity[]) => props.filters.cards = cards
    const updateSelectedTokens = (tokens: string[]) => props.filters.tokens = tokens

    return (
        <SearchDrawerExpansionPanel
            initiallyOpen={initiallyOpen}
            title={"Cards"}
        >
            {cards.length === 0 || tokens.length === 0 ? (
                <Loader size={LoaderSize.SMALL}/>
            ) : (
                <DeckSearchDrawerCardsInternal
                    cards={cards}
                    tokens={tokens}
                    selectedCards={selectedCards}
                    selectedTokens={selectedTokens}
                    updateSelectedCards={updateSelectedCards}
                    updateSelectedTokens={updateSelectedTokens}
                />
            )}

        </SearchDrawerExpansionPanel>

    )
})

interface DeckSearchDrawerCardsInternalProps {
    cards: string[]
    tokens: string[]
    selectedCards: DeckCardQuantity[]
    selectedTokens: string[]
    updateSelectedCards: (cards: DeckCardQuantity[]) => void
    updateSelectedTokens: (tokens: string[]) => void
}

const DeckSearchDrawerCardsInternal = (props: DeckSearchDrawerCardsInternalProps) => {
    const {
        cards, tokens, selectedCards, selectedTokens, updateSelectedCards, updateSelectedTokens
    } = props

    return (
        <Box>
            <DeckTokenSelect tokenNames={tokens} selectedTokens={selectedTokens}
                             updateSelectedTokens={updateSelectedTokens}/>
            <DeckCardSelect cardNames={cards} selectedCards={selectedCards} updateSelectedCards={updateSelectedCards}/>
        </Box>
    )
}
