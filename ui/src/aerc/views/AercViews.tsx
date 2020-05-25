import { Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Utils } from "../../config/Utils"
import { Deck, DeckUtils } from "../../decks/Deck"
import { AercCategoryAmber, AercCategoryBoard, AercCategoryControl, AercCategoryCounts, AercCategoryExtras, AercCategorySpeed } from "./AercCategories"

export enum AercViewType {
    DECK,
    MOBILE_DECK,
    MINI_DECK
}

export const AercViewForDeck = (props: { deck: Deck, type: AercViewType }) => {
    const {deck, type} = props
    let combos
    const hasAerc = DeckUtils.hasAercFromDeck(deck)
    if (deck.synergies) {
        combos = deck.synergies.synergyCombos
    }

    if (type === AercViewType.MINI_DECK) {
        return (
            <div
                style={{display: "flex", justifyContent: "space-between", backgroundColor: themeStore.aercViewBackground, padding: spacing(1)}}
            >
                <AercCategoryAmber deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryControl deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategorySpeed deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryBoard deck={deck} hasAerc={hasAerc} combos={combos}/>
            </div>
        )
    }

    if (type === AercViewType.MOBILE_DECK) {
        return (
            <div
                style={{
                    display: "grid",
                    columnGap: spacing(1),
                    gridAutoFlow: "column",
                    backgroundColor: themeStore.aercViewBackground,
                    padding: spacing(1),
                }}
            >
                <AercCategoryAmber deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryControl deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategorySpeed deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryBoard deck={deck} hasAerc={hasAerc} combos={combos}/>
            </div>
        )
    }

    return (
        <div
            style={{backgroundColor: themeStore.aercViewBackground, padding: spacing(1)}}
        >
            {deck.previousMajorSasRating != null && deck.previousMajorSasRating > 0 && (
                <div style={{marginLeft: spacing(1)}}>
                    <Tooltip title={"SAS Score from before the update to SAS v5."}>
                        <div style={{display: "flex", alignItems: "flex-end"}}>
                            <Typography variant={"h5"} color={"primary"} style={{fontSize: 30, marginRight: spacing(1)}}>
                                {deck.previousMajorSasRating}
                            </Typography>
                            <Typography variant={"h5"} color={"primary"} style={{fontSize: 20, marginBottom: 2}} noWrap={true}>SAS v4</Typography>
                        </div>
                    </Tooltip>
                </div>
            )}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    rowGap: spacing(1),
                }}
            >
                <AercCategoryAmber deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryControl deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategorySpeed deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryBoard deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryExtras deck={deck} hasAerc={hasAerc} combos={combos}/>
                <AercCategoryCounts deck={deck} hasAerc={hasAerc} combos={combos}/>
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
