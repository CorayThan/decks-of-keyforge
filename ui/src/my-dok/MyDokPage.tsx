import { Box } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import { BoughtAndSoldView } from "../auctions/purchases/BoughtAndSoldView"
import { MyDokSubPaths } from "../config/Routes"
import { MyMessages } from "../messages/MyMessages"
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
            <Box mx={screenStore.screenSizeXs() ? 1 : 4} mt={screenStore.screenSizeXs() ? 8 : 10}>
                <Switch>
                    <Route path={MyDokSubPaths.messages} component={MyMessages}/>
                    <Route path={MyDokSubPaths.profile} component={MyProfile}/>
                    <Route path={MyDokSubPaths.offers} component={MyOffersView}/>
                    <Route path={MyDokSubPaths.purchases} component={BoughtAndSoldView}/>
                    <Route path={MyDokSubPaths.notifications} component={MyNotifications}/>
                    <Route path={MyDokSubPaths.team} component={TeamPage}/>
                </Switch>
            </Box>
        )
    }
}
