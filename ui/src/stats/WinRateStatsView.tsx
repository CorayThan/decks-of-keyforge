import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { BarData } from "../generated-src/BarData"
import { StatsBar, StatsBarPropsSimplified } from "../graphs/StatsBar"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"
import { statsStore } from "./StatsStore"

@observer
export class WinRateStatsView extends React.Component<{}> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        uiStore.setTopbarValues("Stats of KeyForge", "Stats", "Win rates for decks")
    }

    render() {

        const stats = statsStore.stats
        if (stats == null) {
            return <Loader/>
        }

        let efficiencyStats
        if (stats.efficiencyWinRate && stats.efficiencyWinRate.length > 0) {
            efficiencyStats = stats.efficiencyWinRate
                .map((data: BarData) => ({x: (data.x as number) + 5, y: data.y}))
        }

        return (
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                <WinRateBar name={"SAS Win Rate"} data={stats.sasWinRate} quantities={stats.sas}/>
                <WinRateBar name={"Synergy Win Rate"} data={stats.synergyWinRate} quantities={stats.synergy}/>
                <WinRateBar name={"Antisynergy Win Rate"} data={stats.antisynergyWinRate} quantities={stats.antisynergy}/>

                <WinRateBar name={"Base AERC Win Rate"} data={stats.aercWinRate} quantities={stats.aerc}/>
                <WinRateBar name={"Amber Control Win Rate"} data={stats.amberControlWinRate} secondary={true} quantities={stats.amberControl}/>
                <WinRateBar name={"Expected Amber Win Rate"} data={stats.expectedAmberWinRate} secondary={true} quantities={stats.expectedAmber}/>
                <WinRateBar name={"Artifact Control Win Rate"} data={stats.artifactControlWinRate} secondary={true} quantities={stats.artifactControl}/>
                <WinRateBar name={"Creature Control Win Rate"} data={stats.creatureControlWinRate} secondary={true} quantities={stats.creatureControl}/>
                <WinRateBar
                    name={"Efficiency Win Rate"}
                    data={efficiencyStats}
                    secondary={true}
                    xTickValues={[0, 5, 10, 15, 20, 25]}
                    xTickFormat={(tick: number) => tick - 5}
                    quantities={stats.efficiency}
                />
                <WinRateBar name={"Recursion Win Rate"} data={stats.recursionWinRate} secondary={true} quantities={stats.recursion}/>
                <WinRateBar name={"Disruption Win Rate"} data={stats.disruptionWinRate} secondary={true} quantities={stats.disruption}/>
                <WinRateBar name={"Effective Power Win Rate"} data={stats.effectivePowerWinRate} secondary={true} quantities={stats.effectivePower}/>
                <WinRateBar name={"Creature Protection Win Rate"} data={stats.creatureProtectionWinRate} secondary={true}
                            quantities={stats.creatureProtection}/>
                <WinRateBar name={"Other Win Rate"} data={stats.otherWinRate} secondary={true} quantities={stats.other}/>

                <WinRateBar name={"Creature Count Win Rate"} data={stats.creatureCountWinRate} quantities={stats.creatures}/>
                <WinRateBar name={"Action Count Win Rate"} data={stats.actionCountWinRate} quantities={stats.actions}/>
                <WinRateBar name={"Artifact Count Win Rate"} data={stats.artifactCountWinRate} quantities={stats.artifacts}/>
                <WinRateBar name={"Upgrade Count Win Rate"} data={stats.upgradeCountWinRate} quantities={stats.upgrades}/>
                <WinRateBar name={"Rare Count Win Rate"} data={stats.raresWinRate} yDomain={[40, 60]}/>

                <WinRateBar name={"House Win Rate"} data={stats.houseWinRate} secondary={true} yDomain={[40, 60]}/>
            </div>
        )
    }
}

export const WinRateBar = (props: StatsBarPropsSimplified) => (
    <StatsBar yDomain={[0, 100]} yAxisName={"Win Rate"} filterQuantitiesBelow={100} {...props}/>
)
