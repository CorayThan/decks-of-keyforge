import { Divider, Tooltip } from "@material-ui/core"
import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Utils } from "../../config/Utils"
import { ExpansionIcon } from "../../expansions/ExpansionIcon"
import { cardStore } from "../CardStore"
import { CardWinRates } from "../KCard"
import { FrontendCard } from "../../generated-src/FrontendCard"

export const CardWinsDisplay = observer((props: { card: FrontendCard }) => {

    const {card} = props

    const winRates = cardStore.findWinRate(card.cardTitle)

    if (!cardStore.cardWinRatesLoaded || winRates == null) {
        return null
    }

    const results = winRates.map(winRate => (
        <IndividualCardWinsDisplay winRates={winRate} key={winRate.expansion ?? "none"}/>
    ))

    if (results.length === 0) {
        return null
    }

    return (
        <>
            <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 5fr 3fr 2fr",
                    rowGap: "4px"
                }}
            >
                {results}
            </div>
        </>
    )
})

const IndividualCardWinsDisplay = (props: { winRates: CardWinRates }) => {

    const {winRates} = props
    const {expansion, winRatePercent, relativeToAveragePercent, wins, losses} = winRates

    const totalGames = ((wins ?? 0) + (losses ?? 0))

    return (
        <>
            {expansion != null ? (
                <ExpansionIcon size={16} expansion={expansion}/>
            ) : <div/>}
            <Tooltip
                title={"This win rate is affected by house win rate, so expect cards in better houses to have higher win rates."}
            >
                <Typography color={"textPrimary"} variant={"body2"} noWrap={true} style={{fontStyle: "italic"}}>
                    {winRatePercent}% win rate
                </Typography>
            </Tooltip>
            {relativeToAveragePercent != null ? (
                <Tooltip
                    title={`Win rate relative to average win rate for this Expansion and House.`}
                >
                    <Typography
                        color={"textPrimary"}
                        variant={"body2"}
                        noWrap={true}
                        style={{color: relativeToAveragePercent > 0 ? "#4caf50" : (relativeToAveragePercent < 0 ? "#f44336" : undefined)}}
                    >
                        {relativeToAveragePercent > 0 ? "+" : ""}{relativeToAveragePercent}%
                    </Typography>
                </Tooltip>
            ) : <div/>}
            {wins != null && losses != null ? (
                <div style={{display: "flex"}}>
                    <div style={{flexGrow: 1}}/>
                    <Tooltip
                        title={"Total Games"}
                    >
                        <Typography
                            color={"textPrimary"}
                            variant={"body2"}
                            style={{marginLeft: spacing(1)}}
                        >
                            {totalGames > 999 ? Utils.roundToKs(totalGames) : totalGames}
                        </Typography>
                    </Tooltip>
                </div>
            ) : <div/>}
        </>
    )
}