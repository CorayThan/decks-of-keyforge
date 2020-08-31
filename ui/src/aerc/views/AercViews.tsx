import { Box, Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { cardStore } from "../../cards/CardStore"
import { KCard } from "../../cards/KCard"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Utils } from "../../config/Utils"
import { DeckSearchResult, DeckUtils } from "../../decks/models/DeckSearchResult"
import { Expansion } from "../../generated-src/Expansion"
import { EnhancedAmberIcon } from "../../generic/icons/enhancements/EnhancedAmberIcon"
import { EnhancedCaptureIcon } from "../../generic/icons/enhancements/EnhancedCaptureIcon"
import { EnhancedDamageIcon } from "../../generic/icons/enhancements/EnhancedDamageIcon"
import { EnhancedDrawIcon } from "../../generic/icons/enhancements/EnhancedDrawIcon"
import { AercCategoryAmber, AercCategoryBoard, AercCategoryControl, AercCategoryCounts, AercCategoryExtras, AercCategorySpeed } from "./AercCategories"

export enum AercViewType {
    DECK,
    MOBILE_DECK,
    MINI_DECK
}

export const AercViewForDeck = (props: { deck: DeckSearchResult, type: AercViewType }) => {
    const {deck, type} = props
    const combos = deck.synergies?.synergyCombos

    if (combos == null) {
        return null
    }
    if (!cardStore.cardsLoaded) {
        return null
    }

    const hasAerc = DeckUtils.hasAercFromDeck(deck)

    if (type === AercViewType.MINI_DECK) {
        return (
            <div
                style={{display: "flex", justifyContent: "space-between", backgroundColor: themeStore.aercViewBackground, padding: spacing(1)}}
            >
                <AercCategoryAmber hasAerc={hasAerc} combos={combos}/>
                <AercCategoryControl hasAerc={hasAerc} combos={combos}/>
                <AercCategorySpeed hasAerc={hasAerc} combos={combos}/>
                <AercCategoryBoard hasAerc={hasAerc} combos={combos}/>
            </div>
        )
    }

    const mobile = type === AercViewType.MOBILE_DECK

    const cards = deck.housesAndCards
        .flatMap(house => house.cards.map(simpleCard => cardStore.fullCardFromCardName(simpleCard.cardTitle)))
        .filter(card => card != null) as KCard[]

    let enhancedIcons = null

    let enhancedAmber = 0
    let enhancedCapture = 0
    let enhancedDamage = 0
    let enhancedDraw = 0
    if (deck.expansion === Expansion.MASS_MUTATION) {
        cards.forEach(card => {
            enhancedAmber += card.extraCardInfo.enhancementAmber
            enhancedCapture += card.extraCardInfo.enhancementCapture
            enhancedDamage += card.extraCardInfo.enhancementDamage
            enhancedDraw += card.extraCardInfo.enhancementDraw
        })

        enhancedIcons = (
            <Box
                display={"grid"}
                gridTemplateColumns={mobile ? "1fr" : "1fr 1fr 1fr 1fr"}
                my={1}
                px={mobile ? 1 : 0}
                gridGap={4}
            >
                <Box display={"flex"}>
                    <Typography variant={"body2"} style={{marginRight: 4}}>{enhancedAmber}</Typography>
                    <EnhancedAmberIcon/>
                </Box>
                <Box display={"flex"}>
                    <Typography variant={"body2"} style={{marginRight: 4}}>{enhancedCapture}</Typography>
                    <EnhancedCaptureIcon/>
                </Box>
                <Box display={"flex"}>
                    <Typography variant={"body2"} style={{marginRight: 4}}>{enhancedDamage}</Typography>
                    <EnhancedDamageIcon/>
                </Box>
                <Box display={"flex"}>
                    <Typography variant={"body2"} style={{marginRight: 4}}>{enhancedDraw}</Typography>
                    <EnhancedDrawIcon/>
                </Box>
            </Box>
        )
    }


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
                <AercCategorySpeed hasAerc={hasAerc} combos={combos}/>
                <AercCategoryBoard hasAerc={hasAerc} combos={combos}/>
                <AercCategoryExtras deck={deck} cards={cards} hasAerc={hasAerc} combos={combos} twoHigh={true}/>
                <AercCategoryCounts deck={deck} cards={cards} hasAerc={hasAerc} combos={combos} twoHigh={true}/>
                {enhancedIcons}
            </div>
        )
    }

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
            {enhancedIcons}
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
            {deck.dateAdded != null && (
                <Tooltip title={"Date imported to DoK. Not recorded prior to Jun 1, 19"}>
                    <div style={{marginTop: spacing(1), display: "flex", justifyContent: "flex-end"}}>
                        <Typography variant={"body2"} color={"textSecondary"}>
                            {Utils.formatDate(deck.dateAdded)}
                        </Typography>
                    </div>
                </Tooltip>
            )}
        </div>
    )
}
