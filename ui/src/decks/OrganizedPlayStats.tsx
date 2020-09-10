import { Tooltip, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { ChainIcon } from "../generic/icons/ChainIcon"
import { PowerIcon } from "../generic/icons/PowerIcon"
import { screenStore } from "../ui/ScreenStore"
import { DeckSearchResult } from "./models/DeckSearchResult"

export const OrganizedPlayStats = observer((props: { deck: DeckSearchResult, style?: React.CSSProperties }) => {
    const {powerLevel, chains, wins, losses} = props.deck
    const showOpWins = !(!powerLevel && !chains && !wins && !losses)
    if (!showOpWins) {
        return null
    }
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: screenStore.smallDeckView() ? "column" : undefined,
                ...props.style
            }}
        >
            {showOpWins && (
                <div
                    style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: spacing(2)}}
                >
                    <OpStat value={powerLevel ?? 0} icon={<PowerIcon/>} tooltip={"Power Level"} style={{marginRight: spacing(2)}}/>
                    <OpStat value={chains ?? 0} icon={<ChainIcon/>} tooltip={"Chains"} style={{marginRight: spacing(2)}}/>
                    <OpStat
                        value={`${wins} / ${losses}`}
                        tooltip={"Organized Play Wins / Losses"}
                    />
                </div>
            )}
        </div>
    )
})

const OpStat = (props: { value: number | string, icon?: React.ReactNode, tooltip: string, style?: React.CSSProperties }) => (
    <Tooltip title={props.tooltip}>
        <div style={{display: "flex", alignItems: "center", ...props.style}}>
            <Typography variant={"h5"} style={{color: "#FFF", marginRight: spacing(1)}}>{props.value}</Typography>
            {props.icon}
        </div>
    </Tooltip>
)
