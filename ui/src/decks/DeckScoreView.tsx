import { Typography } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"
import HistoryIcon from "@material-ui/icons/History"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface DeckScoreViewProps {
    deck: {
        cardsRating: number,
        previousSasRating?: number,
        sasRating: number,
        synergyRating: number,
        antisynergyRating: number,
        expansion?: number
    }
    style?: React.CSSProperties
}

export const DeckScoreView = (props: DeckScoreViewProps) => {

    const {
        cardsRating,
        previousSasRating,
        sasRating,
        synergyRating,
        antisynergyRating,
    } = props.deck

    let sasInfo = null
    if (previousSasRating != null && previousSasRating !== sasRating && previousSasRating !== 0) {
        sasInfo = (
            <Tooltip title={`Previous SAS rating: ${previousSasRating}`} enterTouchDelay={100}>
                <div>
                    <HistoryIcon style={{marginTop: spacing(1), marginLeft: spacing(2), color: "#FFFFFF", width: 20, height: 20}}/>
                </div>
            </Tooltip>
        )
    }

    return (
        <div style={props.style}>
            <RatingRow value={cardsRating} name={"CARD RATING"}/>
            <RatingRow value={synergyRating} name={"SYNERGY"} operator={"+"}/>
            <RatingRow value={antisynergyRating} name={"ANTISYNERGY"} operator={"-"}/>
            <div style={{borderBottom: "1px solid rgba(255,255,255)"}}/>
            <div style={{display: "flex"}}>
                <Tooltip title={"Synergy and Antisynergy Rating. Read more on the about page."}>
                    <div>
                        <RatingRow value={sasRating} name={"SAS"} large={true}/>
                    </div>
                </Tooltip>
                {sasInfo}
            </div>
        </div>
    )
}

const RatingRow = (props: { value: number, name: string, operator?: string, large?: boolean }) => {
    const {large} = props
    return (
        <div style={{display: "flex", alignItems: "flex-end"}}>
            <div style={{width: 76, display: "flex", marginRight: spacing(1)}}>
                <div style={{flexGrow: 1}}/>
                <Typography variant={large ? "h3" : "body1"} style={{color: "#FFFFFF"}}>{props.operator} {props.value}</Typography>
            </div>
            <Typography
                variant={large ? "h5" : "body2"}
                style={{fontSize: large ? undefined : 12, marginBottom: large ? undefined : 2, color: "#FFFFFF"}}
            >
                {props.name}
            </Typography>
        </div>
    )
}

export const PercentRatingRow = (props: { value: number, name: string }) => {
    if (props.value === -1) {
        return null
    }
    return (
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
    )
}
