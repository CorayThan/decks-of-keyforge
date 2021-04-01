import { Box } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import { theme } from "../config/MuiConfig"
import { StatsSubPaths } from "../config/Routes"
import { screenStore } from "../ui/ScreenStore"
import { CardStatsView } from "./CardStatsView"
import { GlobalDeckStatsView } from "./GlobalDeckStatsView"
import { PurchaseStatsView } from "./PurchaseStatsView"
import { ToggleStats } from "./ToggleStats"
import { WinRateStatsView } from "./WinRateStatsView"

@observer
export class StatsPage extends React.Component<RouteComponentProps<{}>> {

    render() {
        return (
            <Box m={2} mt={8}>
                <ToggleStats style={{position: "fixed", right: theme.spacing(2), bottom: theme.spacing(2), zIndex: screenStore.zindexes.menuPops}}/>
                <Switch>
                    <Route path={StatsSubPaths.winRates} component={WinRateStatsView}/>
                    <Route path={StatsSubPaths.deckStats} component={GlobalDeckStatsView}/>
                    <Route path={StatsSubPaths.aercStats} component={CardStatsView}/>
                    <Route path={StatsSubPaths.purchaseStats} component={PurchaseStatsView}/>
                </Switch>
            </Box>
        )
    }
}
