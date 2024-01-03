import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { BuyingDisclaimer } from "../../decks/sales/ForSaleView"
import { SendEmailVerification } from "../../emails/SendEmailVerification"
import { MakeOffer } from "../../generated-src/MakeOffer"
import { HelperText } from "../../generic/CustomTypographies"
import { Loader } from "../../mui-restyled/Loader"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { offerStore } from "./OfferStore"
import { ViewOffersForDeck } from "./ViewOffersForDeck"

interface OfferButtonProps {
    deckName: string
    currencySymbol: string
    deckListingId: string
    sellerUsername: string
    style?: React.CSSProperties
}

@observer
export class OfferButton extends React.Component<OfferButtonProps> {
    @observable
    isOpen = false

    @observable
    amount = ""

    @observable
    message = ""

    @observable
    expireInDays = "3"

    open = () => {
        this.amount = ""
        this.message = ""
        offerStore.loadOffersForDeckListing(this.props.deckListingId)
        if (offerStore.myOffers == null) {
            offerStore.loadMyOffers(false, false)
        }
        this.isOpen = true
    }

    close = () => {
        offerStore.offersForDeck = undefined
        this.isOpen = false
    }

    offer = () => {
        const {deckListingId, deckName} = this.props
        this.close()

        if (this.amount === "") {
            messageStore.setErrorMessage("Please include an offer amount.")
            return
        }

        const amount = Number(this.amount)
        const expireInDays = Number(this.expireInDays)

        if (amount < 1) {
            messageStore.setErrorMessage("Offer must be a positive number.")
            return
        }

        if (expireInDays < 1) {
            messageStore.setErrorMessage("Expire in days must be a positive number.")
            return
        }

        const offer: MakeOffer = {
            amount,
            expireInDays,
            message: this.message.trim(),
            deckListingId: deckListingId
        }

        offerStore.makeOffer(deckName, offer)
    }

    constructor(props: OfferButtonProps) {
        super(props)
        makeObservable(this)
    }

    render() {
        const {currencySymbol, sellerUsername, deckName, style} = this.props
        const soldByMe = sellerUsername === userStore.username
        const loggedIn = userStore.loggedIn()
        const disabled = !userStore.loggedIn() || soldByMe
        const title = (soldByMe ? "View Offers" : "Make Offer")
        return (
            <div style={style}>
                <Button variant={"outlined"} color={"primary"} onClick={this.open} disabled={!loggedIn}>
                    {title}
                </Button>
                <Dialog
                    open={this.isOpen}
                    onClose={this.close}
                    maxWidth={"md"}
                >
                    <DialogTitle>{title + ` on ${deckName}`}</DialogTitle>
                    <DialogContent>
                        <div style={{marginBottom: spacing(2)}}>
                            {offerStore.offersForDeck == null ? (
                                <Loader/>
                            ) : (
                                <ViewOffersForDeck offers={offerStore.offersForDeck} currency={currencySymbol}/>
                            )}
                        </div>
                        {!soldByMe && (
                            <>
                                <SendEmailVerification message={"Please verify your email to make offers on decks."}/>
                                <TextField
                                    label={"Offer"}
                                    value={this.amount}
                                    type={"number"}
                                    variant={"outlined"}
                                    onChange={event => this.amount = event.target.value}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                                    }}
                                    style={{maxWidth: 120, marginRight: spacing(2), marginBottom: spacing(2)}}
                                />
                                <TextField
                                    label={"Expire in Days"}
                                    value={this.expireInDays}
                                    type={"number"}
                                    variant={"outlined"}
                                    onChange={event => this.expireInDays = event.target.value}
                                    style={{maxWidth: 120, marginRight: spacing(2), marginBottom: spacing(2)}}
                                />
                                <TextField
                                    label={"Message"}
                                    value={this.message}
                                    multiline={true}
                                    rows={4}
                                    fullWidth={true}
                                    variant={"outlined"}
                                    onChange={event => this.message = event.target.value}
                                    style={{marginBottom: spacing(2)}}
                                />
                                <HelperText style={{marginBottom: spacing(1)}}>
                                    By making an offer on this deck you agree to pay the seller the that amount + the listed shipping amount if they accept your
                                    offer. Your username and offer will be publicly visible on DoK.
                                    You can cancel your offer at any time. We will provide the seller with your email.
                                </HelperText>
                                <BuyingDisclaimer/>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <div style={{flexGrow: 1}}/>
                        <Button onClick={this.close}>
                            Close
                        </Button>
                        {!soldByMe && (
                            <Button
                                onClick={this.offer}
                                color="primary"
                                disabled={!userStore.emailIsVerified || disabled}
                                style={{marginLeft: spacing(2)}}
                            >
                                Send
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
