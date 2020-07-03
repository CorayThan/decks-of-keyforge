import { Button, Checkbox, FormControlLabel, Paper } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { OffersForDeck, OfferStatus } from "../auctions/offers/Offer"
import { offerStore } from "../auctions/offers/OfferStore"
import { OffersForDeckTableFull } from "../auctions/offers/ViewOffersForDeck"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { UnstyledLink } from "../generic/UnstyledLink"
import { Loader } from "../mui-restyled/Loader"
import { userStore } from "../user/UserStore"

@observer
export class MyOffersView extends React.Component {

    componentDidMount(): void {
        offerStore.loadMyOffers(false, false)
    }

    render() {

        const myOffers = offerStore.myOffers

        if (!userStore.loggedInOrLoading && myOffers == null) {
            return <Typography>Please login to see your offers.</Typography>
        }

        if (myOffers == null) {
            return <Loader/>
        }

        const {offersSent, offersRejected, offersCanceled, includeExpiredOffers} = keyLocalStorage.genericStorage

        return (
            <div>
                <div style={{marginBottom: spacing(2)}}>
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
                                checked={offersRejected ?? false}
                                onChange={(event) => keyLocalStorage.updateGenericStorage({offersRejected: event.target.checked})}
                            />
                        }
                        label={"Rejected"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={offersCanceled ?? false}
                                onChange={(event) => keyLocalStorage.updateGenericStorage({offersCanceled: event.target.checked})}
                            />
                        }
                        label={"Canceled"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeExpiredOffers ?? false}
                                onChange={(event) => keyLocalStorage.updateGenericStorage({includeExpiredOffers: event.target.checked})}
                            />
                        }
                        label={"Include Expired"}
                    />
                    <Button
                        onClick={() => {
                            offerStore.loadMyOffers(true, true)
                        }}
                    >
                        Load Archived Offers
                    </Button>
                </div>
                <OffersList
                    name={"Offers from me"}
                    noneMessage={"To see offers you've made, make an offer to an Archon with discriminating tastes"}
                    offers={myOffers.offersIMade}
                />
                <OffersList
                    name={"Offers to me"}
                    noneMessage={"To see some offers with numbers in accordance with psychological impulse, list some decks with 'Accepting Offers' checked"}
                    offers={myOffers.offersToMe}
                />
                <div style={{marginTop: spacing(2)}}>
                    <Typography color={"textSecondary"} variant={"body2"} style={{fontStyle: "italic"}}>
                        We will send you an email when you receive an offer, or when an offer you've made has been accepted or rejected.
                        You will not receive an email when your offers expire, or an offer made to you is cancelled.
                    </Typography>
                    <Typography color={"textSecondary"} variant={"body2"} style={{fontStyle: "italic", marginTop: spacing(1)}}>
                        When a deck is no longer listed for sale its
                        offers will be removed from this view, for example when you unlist a deck, or accept an offer on it.
                    </Typography>
                </div>
            </div>
        )
    }
}

const OffersList = (props: { name: string, noneMessage: string, offers: OffersForDeck[] }) => {
    const {name, noneMessage, offers} = props
    const {offersSent, offersRejected, offersCanceled, includeExpiredOffers} = keyLocalStorage.genericStorage
    return (
        <div style={{maxWidth: 1200, overflowX: "auto"}}>
            <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>
                {name}
            </Typography>
            {offers.length === 0 ? (
                <Typography>{noneMessage}</Typography>
            ) : (
                offers
                    .filter(offersForDeck => (
                        (offersSent && offersForDeck.offers.map(offer => offer.status).includes(OfferStatus.SENT))
                        || (offersRejected && offersForDeck.offers.map(offer => offer.status).includes(OfferStatus.REJECTED))
                        || (offersCanceled && offersForDeck.offers.map(offer => offer.status).includes(OfferStatus.CANCELED))
                        || (includeExpiredOffers || offersForDeck.offers.find(offer => !offer.expired) != null)
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
                                <UnstyledLink to={Routes.deckPage(offersForDeck.deck.id)} target={"_blank"} rel={"noopener noreferrer"}>
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
                            <OffersForDeckTableFull offers={offersForDeck.offers} currency={offersForDeck.deck.currency}/>
                        </Paper>
                    ))
            )}
        </div>
    )
}
