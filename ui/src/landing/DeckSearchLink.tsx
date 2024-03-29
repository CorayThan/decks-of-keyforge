import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { LinkButton } from "../mui-restyled/LinkButton"
import { AllianceDeckFilters } from "../generated-src/AllianceDeckFilters";

export const DeckSearchLink = (props: { name: React.ReactNode, filters: DeckFilters, color?: "secondary", style?: React.CSSProperties }) => {
    const {name, filters, color, style} = props

    return (
        <div style={{display: "flex", ...style}}>
            <LinkButton
                variant={"contained"}
                size={"large"}
                color={color ? color : "primary"}
                href={Routes.deckSearch(filters)}
                style={{marginLeft: spacing(2)}}
            >
                {name}
            </LinkButton>
        </div>
    )
}

export const AlliancesSearchLink = (props: { name: React.ReactNode, filters: AllianceDeckFilters, color?: "secondary", style?: React.CSSProperties }) => {
    const {name, filters, color, style} = props

    return (
        <div style={{display: "flex", ...style}}>
            <LinkButton
                variant={"contained"}
                size={"large"}
                color={color ? color : "primary"}
                href={Routes.allianceDeckSearch(filters)}
                style={{marginLeft: spacing(2)}}
            >
                {name}
            </LinkButton>
        </div>
    )
}

export const LandingPageLink = (props: { name: React.ReactNode, to: string, color?: "secondary", style?: React.CSSProperties }) => {
    const {name, color, style, to} = props

    return (
        <div style={{display: "flex", ...style}}>
            <LinkButton
                variant={"contained"}
                size={"large"}
                color={color ? color : "primary"}
                href={to}
                style={{marginLeft: spacing(2)}}
            >
                {name}
            </LinkButton>
        </div>
    )
}
