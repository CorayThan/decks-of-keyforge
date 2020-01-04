import { Typography } from "@material-ui/core"
import React, { useEffect } from "react"
import { Loader } from "../../mui-restyled/Loader"
import { OfferStatus } from "./Offer"
import { offerStore } from "./OfferStore"

export const OffersPage = () => {

    useEffect(() => {
        offerStore.loadMyOffers([OfferStatus.SENT])
    }, [])

    const myOffers = offerStore.myOffers
    if (offerStore.loadingMyOffers || myOffers == null) {
        return <Loader/>
    }

    return (
        <div>
            <Typography>Offers Received</Typography>
            {myOffers.offersToMe.map(offer => (
                <div>
                    {offer.amount}
                </div>
            ))}
            <Typography>Offers Sent</Typography>
            {myOffers?.offersIMade.map(offer => (
                <div>
                    {offer.amount}
                </div>
            ))}
        </div>
    )
}
