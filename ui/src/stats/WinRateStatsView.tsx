import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Loader } from "../mui-restyled/Loader"
import { UiStore } from "../ui/UiStore"
import { StatsBar, StatsBarProps } from "./StatsBar"
import { StatsStore } from "./StatsStore"

@observer
export class WinRateStatsView extends React.Component<{}> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        UiStore.instance.setTopbarValues("Stats of Keyforge", "Stats", "Win rates for decks")
    }

    render() {

        const stats = StatsStore.instance.stats
        if (stats == null) {
            return <Loader/>
        }

        return (
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                <WinRateBar name={"SAS Win Rate"} data={stats.sasWinRate}/>
                <WinRateBar name={"Card Rating Win Rate"} data={stats.cardRatingsWinRate}/>
                <WinRateBar name={"Synergy Win Rate"} data={stats.synergyWinRate}/>
                <WinRateBar name={"Antisynergy Win Rate"} data={stats.antisynergyWinRate}/>

                <WinRateBar name={"AERC Win Rate"} data={stats.aercWinRate} secondary={true}/>
                <WinRateBar name={"Amber Control Win Rate"} data={stats.amberControlWinRate} secondary={true}/>
                <WinRateBar name={"Expected Amber Win Rate"} data={stats.expectedAmberWinRate} secondary={true}/>
                <WinRateBar name={"Artifact Control Win Rate"} data={stats.artifactControlWinRate} secondary={true}/>
                <WinRateBar name={"Creature Control Win Rate"} data={stats.creatureControlWinRate} secondary={true}/>

                <WinRateBar name={"Creature Count Win Rate"} data={stats.creatureCountWinRate}/>
                <WinRateBar name={"Action Count Win Rate"} data={stats.actionCountWinRate}/>
                <WinRateBar name={"Artifact Count Win Rate"} data={stats.artifactCountWinRate}/>
                <WinRateBar name={"Upgrade Count Win Rate"} data={stats.upgradeCountWinRate}/>
                <WinRateBar name={"Rare Count Win Rate"} data={stats.raresWinRate}/>

                <WinRateBar name={"House Win Rate"} data={stats.houseWinRate} secondary={true}/>
            </div>
        )
    }
}

const WinRateBar = (props: StatsBarProps) => <StatsBar style={{margin: spacing(2)}} yDomain={[0, 100]} {...props}/>
