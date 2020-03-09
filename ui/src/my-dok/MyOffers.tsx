import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { offerStore } from "../auctions/offers/OfferStore"
import { ForSaleQueryTable } from "../decks/salenotifications/ForSaleQueryTable"
import { Loader } from "../mui-restyled/Loader"

@observer
export class MyOffers extends React.Component {

    componentDidMount(): void {
        offerStore.loadMyOffers()
    }

    render() {

        if (offerStore.loadingMyOffers) {
            return <Loader/>
        }

        const myOffers = offerStore.myOffers

        if (myOffers == null) {
            return <Typography>Please login to see your offers.</Typography>
        }

        if (myOffers.) {
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
