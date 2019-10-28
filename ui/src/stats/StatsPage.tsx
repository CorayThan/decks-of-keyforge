import { AppBar, Tabs } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import { spacing, theme } from "../config/MuiConfig"
import { StatsSubPaths } from "../config/Routes"
import { LinkTab } from "../generic/LinkTab"
import { screenStore } from "../ui/ScreenStore"
import { CardStatsView } from "./CardStatsView"
import { GlobalDeckStatsView } from "./GlobalDeckStatsView"
import { ToggleStats } from "./ToggleStats"
import { WinRateStatsView } from "./WinRateStatsView"

@observer
export class StatsPage extends React.Component<RouteComponentProps<{}>> {

    render() {
        return (
            <div style={{margin: spacing(4), backgroundColor: "#FFF"}}>
                <AppBar position={"static"} color={"default"}>
                    <Tabs
                        value={this.props.location.pathname}
                        centered={screenStore.screenSizeMdPlus()}
                        variant={screenStore.screenSizeSm() ? "fullWidth" : undefined}
                    >
                        <LinkTab label="Win Rates" to={StatsSubPaths.winRates} value={StatsSubPaths.winRates}/>
                        <LinkTab label="Deck Stats" to={StatsSubPaths.deckStats} value={StatsSubPaths.deckStats}/>
                        <LinkTab label="AERC Stats" to={StatsSubPaths.aercStats} value={StatsSubPaths.aercStats}/>
                    </Tabs>
                </AppBar>
                <ToggleStats style={{position: "fixed", right: theme.spacing(2), bottom: theme.spacing(2), zIndex: screenStore.zindexes.menuPops}}/>
                <Switch>
                    <Route path={StatsSubPaths.winRates} component={WinRateStatsView}/>
                    <Route path={StatsSubPaths.deckStats} component={GlobalDeckStatsView}/>
                    <Route path={StatsSubPaths.aercStats} component={CardStatsView}/>
                </Switch>
            </div>
        )
    }
}
