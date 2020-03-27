import { AppBar, Tabs } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import { spacing, themeStore } from "../config/MuiConfig"
import { MyDokSubPaths } from "../config/Routes"
import { LinkTab } from "../generic/LinkTab"
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
                        <LinkTab label="Notifications" to={MyDokSubPaths.notifications} value={MyDokSubPaths.notifications}/>
                    </Tabs>
                </AppBar>
                <div style={{padding: spacing(4)}}>
                    <Switch>
                        <Route path={MyDokSubPaths.profile} component={MyProfile}/>
                        <Route path={MyDokSubPaths.offers} component={MyOffersView}/>
                        <Route path={MyDokSubPaths.notifications} component={MyNotifications}/>
                    </Switch>
                </div>
            </div>
        )
    }
}
