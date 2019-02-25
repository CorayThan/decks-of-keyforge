import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Loader } from "../mui-restyled/Loader"
import { UiStore } from "../ui/UiStore"
import { StatsBar, StatsBarProps } from "./StatsBar"
import { StatsStore } from "./StatsStore"

@observer
export class GlobalDeckStatsView extends React.Component<{}> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        UiStore.instance.setTopbarValues("Stats of Keyforge", "Stats", "Global deck stats")
    }

    render() {

        const stats = StatsStore.instance.stats
        if (stats == null) {
            return <Loader/>
        }

        return (
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                <DeckStatsBar name={"Creatures"} data={stats.creatures}/>
                <DeckStatsBar name={"Actions"} data={stats.actions}/>
                <DeckStatsBar name={"Artifacts"} data={stats.artifacts}/>
                <DeckStatsBar name={"Upgrades"} data={stats.upgrades}/>
            </div>
        )
    }
}

const DeckStatsBar = (props: StatsBarProps) => <StatsBar name={props.name} data={props.data} style={{margin: spacing(2)}} hideY={true}/>
