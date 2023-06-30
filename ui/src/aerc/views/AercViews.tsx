import { Box, Typography } from "@material-ui/core"
import * as React from "react"
import { cardStore } from "../../cards/CardStore"
import { KCard } from "../../cards/KCard"
import { spacing, themeStore } from "../../config/MuiConfig"
import { DeckSearchResult } from "../../decks/models/DeckSearchResult"
import { displaySas } from "../../expansions/Expansions"
import { HasAerc } from "../HasAerc"
import {
    AercCategoryAmber,
    AercCategoryBoard,
    AercCategoryControl,
    AercCategoryCounts,
    AercCategoryExtras,
    AercCategoryOther,
    AercCategorySpeed
} from "./AercCategories"
import { TimeUtils } from "../../config/TimeUtils"
import { userStore } from "../../user/UserStore"
import { observer } from "mobx-react"

export enum AercViewType {
    DECK,
    MOBILE_DECK,
    MINI_DECK
}

export const AercViewForDeck = observer((props: { deck: DeckSearchResult, type: AercViewType }) => {
    const {deck, type} = props
    const combos = deck.synergyDetails

    if (combos == null) {
        return null
    }
    if (!cardStore.cardsLoaded) {
        return null
    }

    if (!displaySas(deck.expansion)) {
        return <Box style={{backgroundColor: themeStore.aercViewBackground}} display={"flex"} width={"100%"}/>
    }

    const hasAerc = deck as HasAerc

    if (type === AercViewType.MINI_DECK) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: themeStore.aercViewBackground,
                    padding: spacing(1)
                }}
            >
                <AercCategoryAmber hasAerc={hasAerc} combos={combos}/>
                <AercCategoryControl hasAerc={hasAerc} combos={combos}/>
                <AercCategorySpeed hasAerc={hasAerc} combos={combos} twoHigh={true}/>
                <AercCategoryBoard hasAerc={hasAerc} combos={combos} twoHigh={true}/>
                <AercCategoryOther hasAerc={hasAerc} combos={combos}/>
            </div>
        )
    }

    const mobile = type === AercViewType.MOBILE_DECK

    const cards = deck.housesAndCards
        .flatMap(house => house.cards.map(simpleCard => {
            if (userStore.displayFutureSas) {
                return cardStore.findNextExtraInfoForCard(simpleCard.cardTitle) ?? cardStore.fullCardFromCardName(simpleCard.cardTitle)
            }
            return cardStore.fullCardFromCardName(simpleCard.cardTitle)
        }))
        .filter(card => card != null) as KCard[]

    if (mobile) {
        return (
            <div
                style={{
                    display: "grid",
                    columnGap: spacing(1),
                    gridAutoFlow: "column",
                    backgroundColor: themeStore.aercViewBackground,
                    padding: spacing(1),
                    overflowX: "auto"
                }}
            >
                <AercCategoryAmber hasAerc={hasAerc} combos={combos}/>
                <AercCategoryControl hasAerc={hasAerc} combos={combos}/>
                <AercCategorySpeed hasAerc={hasAerc} combos={combos} twoHigh={true}/>
                <AercCategoryBoard hasAerc={hasAerc} combos={combos} twoHigh={true}/>
                <AercCategoryOther hasAerc={hasAerc} combos={combos}/>
                <AercCategoryExtras deck={deck} cards={cards} hasAerc={hasAerc} combos={combos} twoHigh={true}/>
                <AercCategoryCounts deck={deck} cards={cards} hasAerc={hasAerc} combos={combos} twoHigh={true}/>
            </div>
        )
    }

    const dateAdded = deck.dateAdded == null ? "" : `on ${TimeUtils.formatShortDate(deck.dateAdded)}`

    return (
        <div
            style={{backgroundColor: themeStore.aercViewBackground, padding: spacing(1)}}
        >
            {/*{deck.previousMajorSasRating != null && deck.previousMajorSasRating > 0 && (*/}
            {/*    <div style={{marginLeft: spacing(1)}}>*/}
            {/*        <Tooltip title={"SAS Score from before the update to SAS v5."}>*/}
            {/*            <div style={{display: "flex", alignItems: "flex-end"}}>*/}
            {/*                <Typography variant={"h5"} color={"primary"} style={{fontSize: 30, marginRight: spacing(1)}}>*/}
            {/*                    {deck.previousMajorSasRating}*/}
            {/*                </Typography>*/}
            {/*                <Typography variant={"h5"} color={"primary"} style={{fontSize: 20, marginBottom: 2}} noWrap={true}>SAS v4</Typography>*/}
            {/*            </div>*/}
            {/*        </Tooltip>*/}
            {/*    </div>*/}
            {/*)}*/}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    rowGap: spacing(1),
                }}
            >
                <AercCategoryAmber hasAerc={hasAerc} combos={combos}/>
                <AercCategoryControl hasAerc={hasAerc} combos={combos}/>
                <AercCategorySpeed hasAerc={hasAerc} combos={combos}/>
                <AercCategoryBoard hasAerc={hasAerc} combos={combos}/>
                <AercCategoryExtras deck={deck} cards={cards} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryCounts deck={deck} cards={cards} hasAerc={hasAerc} combos={combos}/>
            </div>
            {deck.discoveredBy && (
                <Box mt={1} justifyContent={"flex-end"}>
                    <Typography
                        variant={"body2"}
                        color={"textSecondary"}
                        style={{fontSize: "0.75rem"}}
                        align={"right"}
                    >
                        discoverer
                    </Typography>
                    <Typography
                        variant={"body2"}
                        color={"textSecondary"}
                        style={{fontSize: "0.75rem"}}
                        align={"right"}
                    >
                        {deck.discoveredBy} {dateAdded}
                    </Typography>
                </Box>
            )}
        </div>
    )
})
