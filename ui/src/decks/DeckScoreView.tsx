import { Typography } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import { ThemeStyle } from "@material-ui/core/styles/createTypography"
import Tooltip from "@material-ui/core/Tooltip"
import HistoryIcon from "@material-ui/icons/History"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export enum DeckScoreSize {
    SMALL,
    MEDIUM,
    MEDIUM_LARGE,
    LARGE
}

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
    small?: boolean
}

export const DeckScorePill = (props: DeckScoreViewProps) => {
    const {small} = props
    return (
        <div
            style={{
                backgroundColor: blue["500"],
                padding: spacing(small ? 1 : 2),
                paddingBottom: spacing(small ? 0 : 2),
                width: small ? 152 : 200,
                borderRadius: 10
            }}
        >
            <DeckScoreView {...props}/>
        </div>
    )
}

export const DeckScoreView = (props: DeckScoreViewProps) => {

    const {small, deck} = props
    const {
        cardsRating,
        previousSasRating,
        sasRating,
        synergyRating,
        antisynergyRating,
    } = deck

    let sasInfo = null
    if (previousSasRating != null && previousSasRating !== sasRating && previousSasRating !== 0) {
        sasInfo = (
            <Tooltip title={`Previous SAS rating: ${previousSasRating}`} enterTouchDelay={100}>
                <div>
                    <HistoryIcon style={{marginTop: spacing(1), marginLeft: spacing(2), color: "#FFFFFF", width: 20, height: 20}}/>
                </div>
            </Tooltip>
        )
    } else if (!small) {
        sasInfo = <div style={{width: 36}} />
    }

    return (
        <div style={props.style}>
            <RatingRow value={cardsRating} name={"CARD RATING"} size={small ? DeckScoreSize.SMALL : DeckScoreSize.MEDIUM}/>
            <RatingRow value={synergyRating} name={"SYNERGY"} operator={"+"} size={small ? DeckScoreSize.SMALL : DeckScoreSize.MEDIUM}/>
            <RatingRow value={antisynergyRating} name={"ANTISYNERGY"} operator={"-"} size={small ? DeckScoreSize.SMALL : DeckScoreSize.MEDIUM}/>
            <div style={{borderBottom: "1px solid rgba(255,255,255)"}}/>
            <div style={{display: "flex"}}>
                <div style={{flexGrow: 1}}/>
                <Tooltip title={"Synergy and Antisynergy Rating. Read more on the about page."}>
                    <div>
                        <RatingRow value={sasRating} name={"SAS"} size={small ? DeckScoreSize.MEDIUM_LARGE : DeckScoreSize.LARGE}/>
                    </div>
                </Tooltip>
                {sasInfo}
            </div>
        </div>
    )
}

const RatingRow = (props: { value: number, name: string, operator?: string, size?: DeckScoreSize }) => {
    const {size} = props
    let largeText: ThemeStyle = "body1"
    let smallText: ThemeStyle = "body2"
    let smallFontSize: number | undefined = 12
    let smallTextMarginBottom: number | undefined = 2
    let width = 88
    if (size === DeckScoreSize.LARGE) {
        largeText = "h3"
        smallText = "h5"
        smallFontSize = undefined
        smallTextMarginBottom = undefined
        width = 52
    } else if (size === DeckScoreSize.SMALL) {
        largeText = "body2"
        smallText = "body2"
        smallFontSize = 10
        width = 72
    } else if (size === DeckScoreSize.MEDIUM_LARGE) {
        largeText = "h4"
        smallText = "h5"
        smallFontSize = undefined
        smallTextMarginBottom = undefined
        width = 72
    }
    return (
        <div style={{display: "flex", alignItems: "flex-end"}}>
            <div style={{flexGrow: 1}}/>
            <Typography variant={largeText} style={{color: "#FFFFFF", marginRight: spacing(1)}}>{props.operator} {props.value}</Typography>
            <Typography
                variant={smallText}
                style={{fontSize: smallFontSize, marginBottom: smallTextMarginBottom, color: "#FFFFFF", width}}
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
