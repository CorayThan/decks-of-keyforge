import { Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import React from "react"
import { AercViewForDeck, AercViewType } from "../../aerc/views/AercViews"
import { spacing, theme } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { LinkMenuItem } from "../../mui-restyled/LinkMenuItem"
import { screenStore } from "../../ui/ScreenStore"
import { DeckScorePill } from "../DeckScoreView"
import { DeckSearchResult } from "../models/DeckSearchResult"

export const FancyDeckMenuItem = observer((props: { deck: DeckSearchResult, onClick: () => void }) => {
    const {deck, onClick} = props
    if (screenStore.smallDeckView()) {
        return (
            <LinkMenuItem
                key={deck.id}
                to={Routes.deckPage(deck.keyforgeId)}
                onClick={onClick}
            >
                <div style={{display: "flex", alignItems: "center", flexGrow: 1}}>
                    <Typography>
                        {deck.name}
                    </Typography>
                    <div style={{flexGrow: 1, marginLeft: theme.spacing(1), marginRight: theme.spacing(1)}}>
                        <Divider style={{minWidth: theme.spacing(1)}}/>
                    </div>
                    <Typography>
                        {deck.sasRating} SAS
                    </Typography>
                </div>
            </LinkMenuItem>
        )
    }
    deck.previousSasRating = deck.sasRating
    return (
        <LinkMenuItem
            key={deck.id}
            to={Routes.deckPage(deck.keyforgeId)}
            onClick={onClick}
            style={{marginTop: spacing(1), marginBottom: spacing(1)}}
        >
            <div style={{display: "flex", flexGrow: 1}}>
                <div
                    style={{marginRight: spacing(1), flexGrow: 1}}
                >
                    <Typography variant={"h6"} style={{marginBottom: spacing(1)}}>
                        {deck.name}
                    </Typography>
                    <AercViewForDeck deck={deck} type={AercViewType.MINI_DECK}/>
                </div>
                <div style={{display: "flex", alignItems: "flex-end"}}>
                    <DeckScorePill
                        deck={{...deck, ...deck.synergies!}}
                        noLinks={true}
                    />
                </div>
            </div>
        </LinkMenuItem>
    )
})
