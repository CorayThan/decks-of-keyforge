import { Tooltip } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Utils } from "../../config/Utils"
import { ExpansionIcon } from "../../expansions/ExpansionIcon"
import { cardStore } from "../CardStore"
import { CardWinRates, KCard } from "../KCard"

const useStyles = makeStyles({
    root: {
        display: "grid",
        gridTemplateColumns: "2fr 5fr 3fr 2fr",
        rowGap: "4px"
    }
})

export const CardWinsDisplay = observer((props: { card: KCard }) => {

    const classes = useStyles()
    const {card} = props

    const winRates = cardStore.cardWinRates?.get(card.cardTitle)
    if (!cardStore.cardWinRatesLoaded || winRates == null) {
        return null
    }

    return (
        <div className={classes.root}>
            {winRates.map(winRate => (
                <IndividualCardWinsDisplay winRates={winRate} key={winRate.expansion ?? "none"}/>
            ))}
        </div>
    )
})

const IndividualCardWinsDisplay = (props: { winRates: CardWinRates }) => {

    const {winRates} = props
    const {expansion, winRatePercent, relativeToAveragePercent, wins, losses} = winRates

    if (((wins ?? 0) + (losses ?? 0)) < 1000) {
        return <Typography variant={"body2"}>Insufficent Data</Typography>
    }

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
                            {Utils.roundToKs(wins + losses)}
                        </Typography>
                    </Tooltip>
                </div>
            ) : <div/>}
        </>
    )
}