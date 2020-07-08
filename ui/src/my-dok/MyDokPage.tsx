import { AppBar, Tabs } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import { BoughtAndSoldView } from "../auctions/purchases/BoughtAndSoldView"
import { spacing, themeStore } from "../config/MuiConfig"
import { MyDokSubPaths } from "../config/Routes"
import { LinkTab } from "../generic/LinkTab"
import { TeamPage } from "../teams/TeamPage"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { MyNotifications } from "./MyNotifications"
import { MyOffersView } from "./MyOffersView"
import { MyProfile } from "./MyProfile"

@observer
export class MyDokPage extends React.Component<RouteComponentProps<{}>> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        uiStore.setTopbarValues("My DoK", "My DoK", "Profile, notifications, offers, etc.")
    }

    render() {
        return (
            <div style={{margin: spacing(4), backgroundColor: themeStore.lightBackgroundColor}}>
                <AppBar position={"static"} color={"default"}>
                    <Tabs
                        value={this.props.location.pathname}
                        centered={screenStore.screenSizeMdPlus()}
                        variant={screenStore.screenSizeSm() ? "fullWidth" : undefined}
                    >
                        <LinkTab label="Profile" to={MyDokSubPaths.profile} value={MyDokSubPaths.profile}/>
                        <LinkTab label="Offers" to={MyDokSubPaths.offers} value={MyDokSubPaths.offers}/>
                        <LinkTab label="Bought / Sold" to={MyDokSubPaths.purchases} value={MyDokSubPaths.purchases}/>
                        <LinkTab label="Notifications" to={MyDokSubPaths.notifications} value={MyDokSubPaths.notifications}/>
                        <LinkTab label="My Team" to={MyDokSubPaths.team} value={MyDokSubPaths.team}/>
                    </Tabs>
                </AppBar>
                <div style={{padding: spacing(4)}}>
                    <Switch>
                        <Route path={MyDokSubPaths.profile} component={MyProfile}/>
                        <Route path={MyDokSubPaths.offers} component={MyOffersView}/>
                        <Route path={MyDokSubPaths.purchases} component={BoughtAndSoldView}/>
                        <Route path={MyDokSubPaths.notifications} component={MyNotifications}/>
                        <Route path={MyDokSubPaths.team} component={TeamPage}/>
                    </Switch>
                </div>
            </div>
        )
    }
}
