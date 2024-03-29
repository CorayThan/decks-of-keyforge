import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { StatsBar, StatsBarPropsSimplified } from "../graphs/StatsBar"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"
import { statsStore } from "./StatsStore"

@observer
export class GlobalDeckStatsView extends React.Component<{}> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        uiStore.setTopbarValues("Stats of KeyForge", "Stats", "Global deck stats")
    }

    render() {

        const stats = statsStore.stats
        if (stats == null) {
            return <Loader/>
        }

        return (
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                <DeckStatsBar name={"Creatures"} data={stats.creatures}/>
                <DeckStatsBar name={"Actions"} data={stats.actions}/>
                <DeckStatsBar name={"Artifacts"} data={stats.artifacts}/>
                <DeckStatsBar name={"Upgrades"} data={stats.upgrades}/>
                <DeckStatsBar name={"Total Power"} data={stats.totalCreaturePower}/>
                <DeckStatsBar name={"Total Armor"} data={stats.totalArmor}/>
            </div>
        )
    }
}

const DeckStatsBar = (props: StatsBarPropsSimplified) =>
    <StatsBar name={props.name} data={props.data} hideY={true} yAxisName={"Count"} filterQuantitiesBelow={100} includePercent={true}/>
