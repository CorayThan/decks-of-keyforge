import { Typography } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface DeckScoreViewProps {
    deck: {
        cardsRating: number,
        sasRating: number,
        synergyRating: number,
        antisynergyRating: number,
    }
    style?: React.CSSProperties
}

export const DeckScoreView = (props: DeckScoreViewProps) => {

    const {
        cardsRating,
        sasRating,
        synergyRating,
        antisynergyRating,
    } = props.deck

    return (
        <div style={props.style}>
            <RatingRow value={cardsRating} name={"CARD RATING"}/>
            <RatingRow value={synergyRating} name={"SYNERGY"} operator={"+"}/>
            <RatingRow value={antisynergyRating} name={"ANTISYNERGY"} operator={"-"}/>
            <div style={{borderBottom: "1px solid rgba(255,255,255)"}}/>
            <RatingRow value={sasRating} name={"SAS"} large={true}/>
        </div>
    )
}

const RatingRow = (props: { value: number, name: string, operator?: string, large?: boolean }) => {
    const {large} = props
    const textStyle = {color: "#FFFFFF"}
    return (

        <Tooltip title={"Synergy and Antisynergy Rating"} open={large ? undefined : false}>
            <div style={{display: "flex", alignItems: "flex-end"}}>
                <div style={{width: 76, display: "flex", marginRight: spacing(1)}}>
                    <div style={{flexGrow: 1}}/>
                    <Typography variant={large ? "h3" : "body1"} style={{...textStyle}}>{props.operator} {props.value}</Typography>
                </div>
                <Typography
                    variant={large ? "h5" : "body2"}
                    style={{fontSize: large ? undefined : 12, marginBottom: large ? undefined : 2, ...textStyle}}
                >
                    {props.name}
                </Typography>
            </div>
        </Tooltip>
    )
}

export const PercentRatingRow = (props: { value: number, name: string }) => {
            if (props.value === -1) {
                return null
            }
    return (
        <Tooltip title={"Percentile ranking among all decks (higher is better)"}>
            <div style={{display: "flex", alignItems: "flex-end"}}>
                <Typography variant={"h5"} style={{color: "#FFFFFF"}}>
                    {props.value}
                </Typography>
                <Typography variant={"body2"} style={{color: "#FFFFFF", fontWeight: 500, marginRight: spacing(1)}}>
                    %
                </Typography>
                <Typography
                    variant={"body2"}
                    style={{color: "#FFFFFF", fontWeight: 500, marginRight: spacing(2)}}
                >
                    {props.name}
                </Typography>
            </div>
        </Tooltip>
    )
}
