import { Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { countryToLabel } from "../../generic/Country"
import { SortableTable } from "../../generic/SortableTable"
import { OfferDto } from "./Offer"

export const ViewOffersForDeck = observer((props: { offers: OfferDto[], currency: string }) => {
    const {offers, currency} = props
    if (offers.length === 0) {
        return <Typography variant={"subtitle1"}>No offers have been made yet on this deck.</Typography>
    }
    return (
        <Paper style={{backgroundColor: themeStore.tableBackgroundColor, marginBottom: spacing(4)}}>
            <Typography variant={"h6"} style={{marginLeft: spacing(2), paddingTop: spacing(2)}}>
                Existing Offers
            </Typography>
            <SortableTable
                defaultSort={"sentTime"}
                data={props.offers}
                headers={[
                    {property: "amount", title: "Amount", sortable: true, transform: (data) => `${currency}${data.amount}`},
                    {property: "status", title: "Status", sortable: true},
                    {property: "country", title: "Country", sortable: true, transform: (data) => countryToLabel(data.country)},
                    {property: "sentTime", title: "Sent", sortable: true},
                    {property: "expiresOn", title: "Expires", sortable: true},
                ]}
            />
        </Paper>
    )
})
