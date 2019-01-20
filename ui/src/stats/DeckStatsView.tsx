import { Tooltip, Typography } from "@material-ui/core"
import { Info } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryPie, VictoryStyleInterface, VictoryTheme } from "victory"
import { spacing } from "../config/MuiConfig"
import { Deck } from "../decks/Deck"
import { Loader } from "../mui-restyled/Loader"
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
            name, totalCreatures, totalActions, totalArtifacts, totalUpgrades, expectedAmber, amberControl, creatureControl, artifactControl
        } = this.props.deck
        const stats = StatsStore.instance.stats
        if (!stats) {
            return <Loader/>
        }
        const {averageExpectedAmber, averageAmberControl, averageCreatureControl, averageArtifactControl} = stats
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

const keyBarStyle: VictoryStyleInterface = {
    labels: {fill: "white"},
    data: {
        fill: (d: { x: string }) => {
            return d.x.startsWith("Avg") ? "SandyBrown" : "DodgerBlue"
        }
    }
} as unknown as VictoryStyleInterface

export const KeyBar = (props: { data: Array<{ x: string, y: number }>, domainPadding?: number, style?: React.CSSProperties }) => (
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
