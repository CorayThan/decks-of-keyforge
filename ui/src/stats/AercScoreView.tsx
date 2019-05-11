import { Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export interface HasAerc {
    amberControl: number
    expectedAmber: number
    artifactControl: number
    creatureControl: number
    aercScore: number
    deckManipulation: number
    effectivePower: number
}

interface AercScoreViewProps {
    hasAerc: HasAerc
    dark?: boolean
    narrow?: boolean
    includeTotal?: boolean
    style?: React.CSSProperties
}

export const AercScoreView = (props: AercScoreViewProps) => {

    const {
        amberControl,
        expectedAmber,
        artifactControl,
        creatureControl,
        deckManipulation,
        effectivePower,
        aercScore,
    } = props.hasAerc

    const textStyle: React.CSSProperties = props.dark ? {color: "#333333"} : {color: "#FFFFFF"}
    const lineStyle = props.dark ? "1px solid rgba(0, 0, 0, 0.12)" : "1px solid rgba(255,255,255)"
    const aercBorderStyle: React.CSSProperties = {borderStyle: "solid", borderWidth: 1, borderColor: props.dark ? "rgba(0, 0, 0, 0.12)" : "#FFFFFF"}

    const cellWidth = props.narrow ? 44 : 56
    const horizontalLine = <div style={{width: cellWidth, borderBottom: lineStyle}}/>
    const verticalLine = <div style={{borderRight: lineStyle}}/>

    const aercColumnStyle: React.CSSProperties = {display: "flex", flexDirection: "column", width: cellWidth}

    return (
        <div style={{display: "flex", ...aercBorderStyle, ...props.style}}>
            <div style={aercColumnStyle}>
                <AercValue value={amberControl} name={"A"} tooltip={"Aember control"} textStyle={textStyle}/>
                {horizontalLine}
                <AercValue value={artifactControl} name={"R"} tooltip={"Artifact control"} textStyle={textStyle}/>
            </div>
            {verticalLine}
            <div style={aercColumnStyle}>
                <AercValue value={expectedAmber} name={"E"} tooltip={"Expected aember"} textStyle={textStyle}/>
                {horizontalLine}
                <AercValue value={creatureControl} name={"C"} tooltip={"Creature control"} textStyle={textStyle}/>
            </div>
            {verticalLine}
            <div style={aercColumnStyle}>
                <AercValue value={deckManipulation} name={"D"} tooltip={"Deck Manipulation"} textStyle={textStyle}/>
                {horizontalLine}
                <AercValue value={effectivePower} name={"P"} tooltip={"Effective Creature Power"} textStyle={textStyle}/>
            </div>
            {verticalLine}
            <AercScore aercScore={aercScore} textStyle={textStyle}/>
        </div>
    )
}

export const AercScore = (props: {aercScore: number, textStyle: React.CSSProperties}) => (
    <Tooltip title={"AERC score. Read more on the about page!"}>
        <div style={{display: "flex", justifyContent: "center", alignItems: "flex-end", margin: spacing(1)}}>
            <Typography
                variant={"h4"}
                style={{marginRight: spacing(1), ...props.textStyle}}>{props.aercScore}
            </Typography>
            <Typography
                variant={"h5"}
                style={{...props.textStyle}}
            >
                {"AERC"}
            </Typography>
        </div>
    </Tooltip>
)

const AercValue = (props: { value: number, name: string, tooltip: string, textStyle: React.CSSProperties }) => {
    return (
        <Tooltip title={props.tooltip}>
            <div style={{display: "flex", margin: 4}}>
                <div style={{flexGrow: 1}}/>
                <Typography style={{marginRight: 8, ...props.textStyle}}>{props.value}</Typography>
                <div style={{width: 12}}>
                    <Typography style={{...props.textStyle}}>{props.name}</Typography>
                </div>
            </div>
        </Tooltip>
    )
}