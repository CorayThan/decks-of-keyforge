import { Checkbox, FormControlLabel, Grid, Paper } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { OffersForDeck, OfferStatus } from "../auctions/offers/Offer"
import { offerStore } from "../auctions/offers/OfferStore"
import { OffersForDeckTable } from "../auctions/offers/ViewOffersForDeck"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { UnstyledLink } from "../generic/UnstyledLink"
import { Loader } from "../mui-restyled/Loader"

@observer
export class MyOffersView extends React.Component {

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

        const {offersSent, offersAccepted, offersRejected, offersCanceled, offersExpired} = keyLocalStorage.genericStorage

        return (
            <Grid container={true} spacing={2}>
                <Grid item={true} xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={offersSent ?? true}
                                onChange={(event) => keyLocalStorage.updateGenericStorage({offersSent: event.target.checked})}
                            />
                        }
                        label={"Sent"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={offersAccepted ?? true}
                                onChange={(event) => keyLocalStorage.updateGenericStorage({offersAccepted: event.target.checked})}
                            />
                        }
                        label={"Accepted"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={offersRejected ?? true}
                                onChange={(event) => keyLocalStorage.updateGenericStorage({offersRejected: event.target.checked})}
                            />
                        }
                        label={"Rejected"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={offersCanceled ?? true}
                                onChange={(event) => keyLocalStorage.updateGenericStorage({offersCanceled: event.target.checked})}
                            />
                        }
                        label={"Canceled"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={offersExpired ?? true}
                                onChange={(event) => keyLocalStorage.updateGenericStorage({offersExpired: event.target.checked})}
                            />
                        }
                        label={"Include Expired"}
                    />
                </Grid>
                <Grid item={true} md={12} lg={6}>
                    <OffersList
                        name={"Offers from me"}
                        noneMessage={"To see offers you've made, make an offer to an Archon with discriminating tastes"}
                        offers={myOffers.offersIMade}
                    />
                </Grid>
                <Grid item={true} md={12} lg={6}>
                    <OffersList
                        name={"Offers to me"}
                        noneMessage={"To see some offers with numbers in accordance with psychological impulse, list some decks with 'Accepting Offers' checked"}
                        offers={myOffers.offersToMe}
                    />
                </Grid>
            </Grid>
        )
    }
}

const OffersList = (props: { name: string, noneMessage: string, offers: OffersForDeck[] }) => {
    const {name, noneMessage, offers} = props
    const {offersSent, offersAccepted, offersRejected, offersCanceled, offersExpired} = keyLocalStorage.genericStorage
    return (
        <div style={{maxWidth: 1200}}>
            <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>
                {name}
            </Typography>
            {offers.length === 0 ? (
                <Typography>{noneMessage}</Typography>
            ) : (
                offers
                    .filter(offersForDeck => (
                        (
                            (offersSent && offersForDeck.offers.map(offer => offer.status).includes(OfferStatus.SENT))
                            || (offersAccepted && offersForDeck.offers.map(offer => offer.status).includes(OfferStatus.ACCEPTED))
                            || (offersRejected && offersForDeck.offers.map(offer => offer.status).includes(OfferStatus.REJECTED))
                            || (offersCanceled && offersForDeck.offers.map(offer => offer.status).includes(OfferStatus.CANCELED))
                        )
                        && (!offersExpired && offersForDeck.offers.find(offer => !offer.expired) != null)
                    ))
                    .map(offersForDeck => (
                        <Paper key={offersForDeck.deck.id} style={{backgroundColor: themeStore.tableBackgroundColor, marginBottom: spacing(4)}}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flexEnd",
                                    marginLeft: spacing(2),
                                    marginRight: spacing(2),
                                    paddingTop: spacing(2)
                                }}
                            >
                                <UnstyledLink to={Routes.deckPage(offersForDeck.deck.id)} target={"_blank"}>
                                    <Typography variant={"h6"}>
                                        {offersForDeck.deck.name}
                                    </Typography>
                                </UnstyledLink>
                                <div style={{flexGrow: 1}}/>
                                <Typography color={"primary"} variant={"h5"} style={{marginRight: 4}}>
                                    {offersForDeck.deck.sas}
                                </Typography>
                                <Typography color={"primary"} variant={"h5"} style={{fontSize: "1.25rem", paddingTop: 5}}>
                                    SAS
                                </Typography>
                            </div>
                            <OffersForDeckTable offers={offersForDeck.offers} currency={offersForDeck.deck.currency}/>
                        </Paper>
                    ))
            )}
        </div>
    )
}
