import { Tooltip, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { CardsWithAerc } from "../cards/CardsWithAerc"
import { KCard } from "../cards/KCard"
import { spacing } from "../config/MuiConfig"

export interface HasAerc {
    amberControl: number
    expectedAmber: number
    artifactControl: number
    creatureControl: number
    aercScore: number
    deckManipulation: number
    effectivePower: number
    searchResultCards?: KCard[]
}

interface AercScoreViewProps {
    hasAerc: HasAerc
    dark?: boolean
    narrow?: boolean
    includeTotal?: boolean
    style?: React.CSSProperties
}

@observer
export class AercScoreView extends React.Component<AercScoreViewProps> {
    render() {

        const {
            amberControl,
            expectedAmber,
            artifactControl,
            creatureControl,
            deckManipulation,
            effectivePower,
            aercScore,
            searchResultCards
        } = this.props.hasAerc

        const textStyle: React.CSSProperties = this.props.dark ? {color: "#333333"} : {color: "#FFFFFF"}
        const lineStyle = this.props.dark ? "1px solid rgba(0, 0, 0, 0.12)" : "1px solid rgba(255,255,255)"
        const aercBorderStyle: React.CSSProperties = {borderStyle: "solid", borderWidth: 1, borderColor: this.props.dark ? "rgba(0, 0, 0, 0.12)" : "#FFFFFF"}

        const cellWidth = this.props.narrow ? 44 : 56
        const horizontalLine = <div style={{width: cellWidth, borderBottom: lineStyle}}/>
        const verticalLine = <div style={{borderRight: lineStyle}}/>

        const aercColumnStyle: React.CSSProperties = {display: "flex", flexDirection: "column", width: cellWidth}

        return (
            <div style={{display: "flex", ...aercBorderStyle, ...this.props.style}}>
                <div style={aercColumnStyle}>
                    <AercValue
                        value={amberControl}
                        name={"A"}
                        tooltip={<CardsWithAerc title={"Aember Control"} accessor={card => card!.extraCardInfo!.amberControl} cards={searchResultCards}/>}
                        textStyle={textStyle}
                    />
                    {horizontalLine}
                    <AercValue
                        value={artifactControl}
                        name={"R"}
                        tooltip={<CardsWithAerc title={"Artifact Control"} accessor={card => card!.extraCardInfo!.artifactControl} cards={searchResultCards}/>}
                        textStyle={textStyle}/>
                </div>
                {verticalLine}
                <div style={aercColumnStyle}>
                    <AercValue
                        value={expectedAmber}
                        name={"E"}
                        tooltip={<CardsWithAerc title={"Expected Aember"} accessor={card => card!.extraCardInfo!.expectedAmber} cards={searchResultCards}/>}
                        textStyle={textStyle}
                    />
                    {horizontalLine}
                    <AercValue
                        value={creatureControl}
                        name={"C"}
                        tooltip={<CardsWithAerc title={"Creature Control"} accessor={card => card!.extraCardInfo!.creatureControl} cards={searchResultCards}/>}
                        textStyle={textStyle}
                    />
                </div>
                {verticalLine}
                <div style={aercColumnStyle}>
                    <AercValue
                        value={deckManipulation}
                        name={"D"}
                        tooltip={(
                            <CardsWithAerc
                                title={"Deck Manipulation"}
                                accessor={card => card!.extraCardInfo!.deckManipulation}
                                cards={searchResultCards}
                            />
                        )}
                        textStyle={textStyle}
                    />
                    {horizontalLine}
                    <AercValue
                        value={effectivePower}
                        name={"P"}
                        tooltip={
                            <CardsWithAerc
                                title={"Effective Creature Power"}
                                accessor={card => {
                                    const effPower = card!.effectivePower
                                    if (effPower == null) {
                                        return 0
                                    }
                                    return effPower
                                }}
                                cards={searchResultCards}
                            />
                        }
                        textStyle={textStyle}
                    />
                </div>
                {verticalLine}
                <AercScore aercScore={aercScore} textStyle={textStyle}/>
            </div>
        )
    }
}

export const AercScore = (props: { aercScore: number, textStyle: React.CSSProperties }) => (
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

const AercValue = (props: { value: number, name: string, tooltip: React.ReactNode, textStyle: React.CSSProperties }) => {
    return (
        <Tooltip title={props.tooltip} enterTouchDelay={100}>
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