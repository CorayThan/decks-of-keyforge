import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { deckStore } from "../decks/DeckStore"
import { DeckFilters } from "../decks/search/DeckFilters"
import { LinkButton } from "../mui-restyled/LinkButton"

export const DeckSearchLink = (props: { name: string, filters: DeckFilters, color?: "secondary", dontSearch?: boolean, style?: React.CSSProperties }) => {
    const {name, filters, color, dontSearch, style} = props

    return (
        <div style={{display: "flex", ...style}}>
            <LinkButton
                variant={"contained"}
                size={"large"}
                color={color ? color : "primary"}
                to={Routes.deckSearch(filters)}
                onClick={() => {
                    if (dontSearch) {
                        deckStore.reset()
                        deckStore.autoSearch = false
                    }
                }}
                style={{marginLeft: spacing(2)}}
            >
                {name}
            </LinkButton>
        </div>
    )
}
