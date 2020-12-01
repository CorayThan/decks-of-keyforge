import * as React from "react"
import Chain from "../generic/imgs/chains.png"
import PowerLevel from "../generic/imgs/power-level.png"
import { LargeValueIconsRow } from "../generic/LargeValueIcon"
import { DeckSearchResult } from "./models/DeckSearchResult"

export const OrganizedPlayStats = (props: { deck: DeckSearchResult, style?: React.CSSProperties }) => {
    const {powerLevel, chains, wins, losses} = props.deck
    const showOpWins = !(!powerLevel && !chains && !wins && !losses)
    if (!showOpWins) {
        return null
    }

    return (
        <LargeValueIconsRow values={[
            {value: powerLevel ?? 0, iconSrc: PowerLevel, tooltip: "Power Level"},
            {value: chains ?? 0, iconSrc: Chain, tooltip: "Chains"},
            {value: `${wins ?? 0} / ${losses ?? 0}`, tooltip: "Organized Play Wins / Losses"},
        ]}/>
    )
}
