import { Collapse, IconButton, Tooltip, Typography } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import { ExpandLess, ExpandMore, Info } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryLabel, VictoryPie, VictoryStyleInterface, VictoryTheme } from "victory"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
import { Deck } from "../decks/Deck"
import { Loader } from "../mui-restyled/Loader"
import { screenStore } from "../ui/ScreenStore"
import { GlobalStats } from "./GlobalStats"
import { StatsStore } from "./StatsStore"

interface DeckStatsViewProps {
    deck: Deck
}

const pieColors = ["DodgerBlue", "SandyBrown", "SlateBlue", "MediumTurquoise"]

@observer
export class DeckStatsView extends React.Component<DeckStatsViewProps> {
    render() {
        const {
            name, totalCreatures, totalActions, totalArtifacts, totalUpgrades, expectedAmber, amberControl, creatureControl, artifactControl,
            sasRating
        } = this.props.deck
        const stats = StatsStore.instance.stats
        if (!stats) {
            return <Loader/>
        }
        const {averageExpectedAmber, averageAmberControl, averageCreatureControl, averageArtifactControl, sas} = stats
        return (
            <div>
                <div style={{display: "flex", maxWidth: 616, maxHeight: 232, margin: spacing(2), pointerEvents: "none"}}>
                    <KeyPie name={name} creatures={totalCreatures} actions={totalActions} artifacts={totalArtifacts} upgrades={totalUpgrades}/>
                    <KeyPieGlobalAverages stats={stats}/>
                </div>

                <div style={{maxWidth: 616, maxHeight: 400, display: "flex", alignItems: "flex-end", margin: spacing(2)}}>
                    <KeyBar
                        data={[
                            {x: "A", y: amberControl},
                            {x: "Avg A", y: averageAmberControl},
                            {x: "E", y: expectedAmber},
                            {x: "Avg E", y: averageExpectedAmber},
                            {x: "R", y: artifactControl},
                            {x: "Avg R", y: averageArtifactControl},
                            {x: "C", y: creatureControl},
                            {x: "Avg C", y: averageCreatureControl},
                        ]}
                        style={{pointerEvents: "none"}}
                    />
                    <Tooltip
                        title={"A = Aember Control, E = Expected Aember, R = Artifact Control, C = Creature Control"}
                        style={{marginBottom: spacing(1)}}
                    >
                        <Info color={"primary"}/>
                    </Tooltip>
                </div>
            </div>
        )
    }
}

class ExtraDeckStatsStore {
    @observable
    displayRest = false
}

const extraDeckStatsStore = new ExtraDeckStatsStore()

@observer
export class ExtraDeckStatsView extends React.Component<DeckStatsViewProps> {
    render() {
        const {
            sasRating, cardsRating, synergyRating, antisynergyRating, totalPower,
            amberControl, expectedAmber, artifactControl, creatureControl
        } = this.props.deck
        const stats = StatsStore.instance.stats
        if (!stats) {
            return <Loader/>
        }
        const creaturePowerCompareValue = Math.floor(totalPower / 5) * 5
        log.info(`Creature power compare value: ${creaturePowerCompareValue} total: ${totalPower}`)

        const rowSize = screenStore.screenWidth / 332

        const barProps: ComparisonBarProps[] = [
            {name: "SAS", data: stats.sas, comparison: sasRating},
            {name: "Cards Rating", data: stats.cardsRating, comparison: cardsRating},
            {name: "Synergy", data: stats.synergy, comparison: synergyRating},
            {name: "Antisynergy", data: stats.antisynergy, comparison: antisynergyRating},
            {name: "Aember Control", data: stats.amberControl, comparison: Math.round(amberControl)},
            {name: "Expected Aember", data: stats.expectedAmber, comparison: Math.round(expectedAmber)},
            {name: "Artifact Control", data: stats.artifactControl, comparison: Math.round(artifactControl)},
            {name: "Creature Control", data: stats.creatureControl, comparison: Math.round(creatureControl)},
            {name: "Creature Power", data: stats.totalCreaturePower, comparison: creaturePowerCompareValue},
        ]

        const firstRowProps = barProps.slice(0, rowSize)
        const restProps = barProps.slice(rowSize, barProps.length)

        return (
            <div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    {firstRowProps.map(props => <ComparisonBar key={props.name} {...props} style={{paddingBottom: 0}}/>)}
                </div>
                <Collapse in={extraDeckStatsStore.displayRest}>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        {restProps.map(props => <ComparisonBar key={props.name} {...props} style={{paddingBottom: 0}}/>)}
                    </div>
                </Collapse>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <IconButton onClick={() => extraDeckStatsStore.displayRest = !extraDeckStatsStore.displayRest}>
                        {extraDeckStatsStore.displayRest ? <ExpandLess/> : <ExpandMore/>}
                    </IconButton>
                </div>
            </div>
        )
    }
}

const keyBarStyle: VictoryStyleInterface = {
    labels: {fill: "white"},
    data: {
        fill: (d: { x: string }) => {
            return d.x.startsWith("Avg") ? amber["500"] : blue["500"]
        }
    }
} as unknown as VictoryStyleInterface

export interface BarData {
    x: string | number
    y: number
}

export const KeyBar = (props: { data: BarData[], domainPadding?: number, style?: React.CSSProperties }) => (
    <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={props.domainPadding ? props.domainPadding : 20}
        padding={32}
        width={600}
        height={400}
        style={props.style}
    >
        <VictoryAxis/>
        <VictoryAxis dependentAxis={true}/>
        <VictoryBar
            data={props.data}
            labels={(d) => d.y}
            style={keyBarStyle}
            labelComponent={<VictoryLabel dy={30}/>}
        />
    </VictoryChart>
)

export interface ComparisonBarProps {
    name: string
    data: BarData[]
    comparison?: number
    style?: React.CSSProperties
}

export const ComparisonBar = (props: ComparisonBarProps) => (
    <div
        style={{
            maxWidth: 400,
            padding: spacing(2),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ...props.style
        }}
    >
        <Typography variant={"h5"} color={"primary"}>{props.name}</Typography>
        <VictoryChart
            theme={VictoryTheme.material}
            padding={{top: 24, bottom: 32, left: 32, right: 32}}
            width={300}
            height={142}
            style={{pointerEvents: "none"}}
            standalone={true}
            containerComponent={<VictoryContainer responsive={false} style={{pointerEvents: "none"}}/>}
        >
            <VictoryAxis/>
            <VictoryBar
                data={props.data}
                style={{
                    data: {
                        fill: (d: { x: number }) => {
                            return d.x === props.comparison ? amber["500"] : blue["500"]
                        }
                    }
                } as unknown as VictoryStyleInterface}
            />
        </VictoryChart>
    </div>
)

export const KeyPieGlobalAverages = (props: { stats: GlobalStats, padding?: number }) =>
    (
        <KeyPie
            name={"Global Average"}
            padding={props.padding}
            creatures={props.stats.averageCreatures}
            actions={props.stats.averageActions}
            artifacts={props.stats.averageArtifacts}
            upgrades={props.stats.averageUpgrades}/>
    )

export const KeyPie = (props: { name?: string, creatures: number, actions: number, artifacts: number, upgrades: number, padding?: number }) => (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        {props.name ? <Typography variant={"h6"} noWrap={true}>{props.name}</Typography> : null}
        <VictoryPie
            padding={props.padding ? props.padding : 30}
            data={[
                {x: `Actions – ${props.actions}`, y: props.actions},
                {x: `Artifacts – ${props.artifacts}`, y: props.artifacts},
                {x: `Creatures – ${props.creatures}`, y: props.creatures},
                {x: `Upgrades – ${props.upgrades}`, y: props.upgrades},
            ]}
            colorScale={pieColors}
            height={184}
        />
    </div>
)
