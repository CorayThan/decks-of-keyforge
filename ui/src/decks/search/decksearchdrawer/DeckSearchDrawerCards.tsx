import { Box } from "@material-ui/core"
import * as React from "react"
import { useState } from "react"
import { SearchDrawerExpansionPanel } from "../../../components/SearchDrawerExpansionPanel"
import { Loader, LoaderSize } from "../../../mui-restyled/Loader"
import { DeckCardSelect } from "../DeckCardSelect"
import { DeckFilters } from "../DeckFilters"
import { observer } from "mobx-react"
import { cardStore } from "../../../cards/CardStore"
import { DeckTokenCardSelect } from "../DeckTokenSelect"
import { HelperText } from "../../../generic/CustomTypographies"

export const DeckSearchDrawerCards = observer((props: { filters: DeckFilters }) => {

    const cards = cardStore.allCardsNoTokens
        .map(card => card.cardTitle)
    const tokens = cardStore.allTokens
        .map(card => card.cardTitle)

    const selectedCards = props.filters.cards
    const selectedTokens = props.filters.tokens

    const [initiallyOpen] = useState(!!(selectedCards && selectedCards.length) || !!(selectedTokens && selectedTokens.length))

    return (
        <SearchDrawerExpansionPanel
            initiallyOpen={initiallyOpen}
            title={"Cards"}
            onClick={() => {
                if (props.filters.cards.length === 0) {
                    props.filters.cards.push({
                        cardNames: [],
                        quantity: 1,
                    })
                }
            }}
        >
            {cards.length === 0 || tokens.length === 0 ? (
                <Loader size={LoaderSize.SMALL}/>
            ) : (
                <DeckSearchDrawerCardsInternal
                    cards={cards}
                    tokens={tokens}
                    filters={props.filters}
                />
            )}

        </SearchDrawerExpansionPanel>

    )
})

interface DeckSearchDrawerCardsInternalProps {
    cards: string[]
    tokens: string[]
    filters: DeckFilters
}

const DeckSearchDrawerCardsInternal = observer((props: DeckSearchDrawerCardsInternalProps) => {
    const {cards, tokens, filters} = props

    return (
        <Box>
            <Box mb={1}>
                <HelperText>Select expansions for better performance</HelperText>
            </Box>
            <DeckCardSelect cardNames={cards} filters={filters}/>
            <Box marginTop={1}>
                <DeckTokenCardSelect tokenNames={tokens} filters={filters}/>
            </Box>
        </Box>
    )
})
