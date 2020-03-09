import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths } from "../config/Routes"
import { forSaleNotificationsStore } from "../decks/salenotifications/ForSaleNotificationsStore"
import { ForSaleQueryTable } from "../decks/salenotifications/ForSaleQueryTable"
import { PatreonIcon } from "../generic/icons/PatreonIcon"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { PatronButton } from "../thirdpartysites/patreon/PatronButton"
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
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography>Become a $5 a month patron to create notifications when decks you want are listed for sale!</Typography>
                    <div style={{marginTop: spacing(2), display: "flex"}}>
                        <PatronButton/>
                        <LinkButton
                            color={"inherit"}
                            to={AboutSubPaths.patreon}
                            style={{marginLeft: spacing(2)}}
                        >
                            <PatreonIcon style={{marginRight: spacing(1)}} primary={true}/>
                            Patron Rewards
                        </LinkButton>
                    </div>
                </div>
            )
        }

        if (forSaleQueries == null || forSaleQueries.length === 0) {
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
