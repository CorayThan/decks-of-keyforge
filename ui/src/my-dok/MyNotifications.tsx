import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { forSaleNotificationsStore } from "../decks/salenotifications/ForSaleNotificationsStore"
import { ForSaleQueryTable } from "../decks/salenotifications/ForSaleQueryTable"
import { PatreonRewardsTier } from "../generated-src/PatreonRewardsTier"
import { Loader } from "../mui-restyled/Loader"
import { PatreonRequired } from "../thirdpartysites/patreon/PatreonRequired"
import { userStore } from "../user/UserStore"
import { themeStore } from "../config/MuiConfig"

@observer
export class MyNotifications extends React.Component {

    componentDidMount(): void {
        forSaleNotificationsStore.findAllForUser()
    }

    render() {
        const forSaleQueries = forSaleNotificationsStore.queries

        if (forSaleQueries == null || userStore.loginInProgress) {
            return <Loader/>
        }

        if (!userStore.deckNotificationsAllowed) {
            return (
                <PatreonRequired
                    requiredLevel={PatreonRewardsTier.SUPPORT_SOPHISTICATION}
                />
            )
        }

        if (forSaleQueries.length === 0) {
            return (
                <div>
                    <Typography color={themeStore.darkMode ? "textSecondary" : undefined}>
                        To create some for sale notifications search for decks that are for sale that meet the criteria you are interested in.
                        Then click the "Notify" button next to the "Search" button.
                    </Typography>
                </div>
            )
        }

        return (
            <ForSaleQueryTable queries={forSaleQueries}/>
        )
    }
}
