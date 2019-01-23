import { Tooltip, Typography } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import { Info } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryPie, VictoryStyleInterface, VictoryTheme } from "victory"
import { spacing } from "../config/MuiConfig"
import { log } from "../config/Utils"
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

@observer
export class ExtraDeckStatsView extends React.Component<DeckStatsViewProps> {
    render() {
        const {
            sasRating, cardsRating, synergyRating, antisynergyRating, totalPower
        } = this.props.deck
        const stats = StatsStore.instance.stats
        if (!stats) {
            return <Loader/>
        }
        const creaturePowerCompareValue = Math.floor(totalPower / 5) * 5
        log.info(`Creature power compare value: ${creaturePowerCompareValue} total: ${totalPower}`)
        return (
            <>
                <ComparisonBar name={"SAS"} data={stats.sas} comparison={sasRating}/>
                <ComparisonBar name={"Cards Rating"} data={stats.cardsRating} comparison={cardsRating}/>
                <ComparisonBar name={"Synergy"} data={stats.synergy} comparison={synergyRating}/>
                <ComparisonBar name={"Antisynergy"} data={stats.antisynergy} comparison={antisynergyRating}/>
                <ComparisonBar name={"Total Creature Power"} data={stats.totalCreaturePower} comparison={creaturePowerCompareValue}/>
            </>
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

export const ComparisonBar = (props: { name: string, data: BarData[], comparison: number }) => (
    <div style={{maxWidth: 400, padding: spacing(2), display: "flex", flexDirection: "column", alignItems: "center"}}>
        <Typography variant={"h5"} color={"primary"}>{props.name}</Typography>
        <VictoryChart
            theme={VictoryTheme.material}
            padding={32}
            width={300}
            height={150}
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
