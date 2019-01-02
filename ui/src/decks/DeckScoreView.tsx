import { Typography } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Deck } from "./Deck"

interface DeckScoreViewProps {
    deck: Deck
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

        <div style={{display: "flex", alignItems: "flex-end"}}>
            <div style={{width: 70, display: "flex", marginRight: spacing(1)}}>
                <div style={{flexGrow: 1}}/>
                <Typography variant={large ? "h3" : "body1"} style={{...textStyle}}>{props.operator} {props.value}</Typography>
            </div>
            <Tooltip title={"Synergy and Antisynergy Rating"} open={large ? undefined : false}>
                <Typography
                    variant={large ? "h5" : "body2"}
                    style={{fontSize: large ? undefined : 12, marginBottom: large ? undefined : 2, ...textStyle}}
                >
                    {props.name}
                </Typography>
            </Tooltip>
        </div>
    )
}