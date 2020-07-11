import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { forSaleNotificationsStore } from "../decks/salenotifications/ForSaleNotificationsStore"
import { ForSaleQueryTable } from "../decks/salenotifications/ForSaleQueryTable"
import { Loader } from "../mui-restyled/Loader"
import { BecomeAPatron } from "../thirdpartysites/patreon/BecomeAPatron"
import { userStore } from "../user/UserStore"

@observer
export class MyNotifications extends React.Component {

    componentDidMount(): void {
        forSaleNotificationsStore.findAllForUser()
    }

    render() {
        const forSaleQueries = forSaleNotificationsStore.queries

        const notifsAllowed = userStore.deckNotificationsAllowed

        if (forSaleQueries == null || userStore.loginInProgress) {
            return <Loader/>
        }

        if (!notifsAllowed) {
            return (
                <BecomeAPatron>
                    Become a $6 a month patron to create notifications when decks you want are listed for sale!
                </BecomeAPatron>
            )
        }

        if (forSaleQueries.length === 0) {
            return (
                <div>
                    <Typography>
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
