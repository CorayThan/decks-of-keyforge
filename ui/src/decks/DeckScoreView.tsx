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
            <Tooltip title={"Synergy and Antisynergy Rating. Read more on the about page."}>
                <RatingRow value={sasRating} name={"SAS"} large={true}/>
            </Tooltip>
        </div>
    )
}

interface AercScoreViewProps {
    deck: {
        amberControl: number,
        expectedAmber: number,
        artifactControl: number,
        creatureControl: number,
        aercScore: number,
    }
    style?: React.CSSProperties
}

const aercBorderStyle: React.CSSProperties = {borderStyle: "solid", borderWidth: 1, borderColor: "#FFFFFF"}

const AercBottomBorder = () => <div style={{borderBottom: "1px solid rgba(255,255,255)", width: 56}}/>

export const AercScoreView = (props: AercScoreViewProps) => {

    const {
        amberControl,
        expectedAmber,
        artifactControl,
        creatureControl,
        aercScore,
    } = props.deck

    const aercColumnStyle: React.CSSProperties = {display: "flex", flexDirection: "column", width: 56}

    return (
        <div style={{display: "flex", ...aercBorderStyle, ...props.style}}>
            <div style={aercColumnStyle}>
                <AercValue value={amberControl} name={"A"} tooltip={"Aember control"}/>
                <AercBottomBorder/>
                <AercValue value={artifactControl} name={"R"} tooltip={"Artifact control"}/>
            </div>
            <div style={{borderRight: "1px solid rgba(255,255,255)"}}/>
            <div style={aercColumnStyle}>
                <AercValue value={expectedAmber} name={"E"} tooltip={"Expected aember"}/>
                <AercBottomBorder/>
                <AercValue value={creatureControl} name={"C"} tooltip={"Creature control"}/>
            </div>
            <div style={{borderRight: "1px solid rgba(255,255,255)"}}/>
            <Tooltip title={"AERC score. Read more on the about page!"}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "flex-end", margin: spacing(1)}}>
                <Typography
                    variant={"h4"}
                    style={{marginRight: spacing(1), ...textStyle}}>{aercScore}
                </Typography>
                <Typography
                    variant={"h5"}
                    style={{...textStyle}}
                >
                    {"AERC"}
                </Typography>
            </div>
            </Tooltip>
        </div>
    )
}
const textStyle = {color: "#FFFFFF"}

const AercValue = (props: { value: number, name: string, tooltip: string }) => {
    return (
        <Tooltip title={props.tooltip}>
            <div style={{display: "flex", margin: 4}}>
                <div style={{flexGrow: 1}}/>
                <Typography style={{marginRight: spacing(1), ...textStyle}}>{props.value}</Typography>
                <div style={{width: 12}}>
                    <Typography style={{...textStyle}}>{props.name}</Typography>
                </div>
            </div>
        </Tooltip>
    )
}

const RatingRow = (props: { value: number, name: string, operator?: string, large?: boolean }) => {
    const {large} = props
    return (
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
