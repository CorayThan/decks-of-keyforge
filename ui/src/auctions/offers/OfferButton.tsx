import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { BuyingDisclaimer } from "../../decks/sales/SaleInfoView"
import { SendEmailVerification } from "../../emails/SendEmailVerification"
import { Loader } from "../../mui-restyled/Loader"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { MakeOffer } from "./Offer"
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
        offerStore.loadOffersForDeckListing(this.props.deckListingId)
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

    render() {
        const {currencySymbol, sellerUsername, style} = this.props
        const disabled = !userStore.loggedIn() || sellerUsername === userStore.username
        return (
            <div style={style}>
                <Button variant={"outlined"} color={"primary"} onClick={this.open}>
                    Make Offer
                </Button>
                <Dialog
                    open={this.isOpen}
                    onClose={this.close}
                >
                    <DialogTitle>Make Offer</DialogTitle>
                    <DialogContent>
                        <div style={{marginBottom: spacing(2)}}>
                            {offerStore.offersForDeck == null ? (
                                <Loader/>
                            ) : (
                                <ViewOffersForDeck offers={offerStore.offersForDeck} currency={currencySymbol}/>
                            )}
                        </div>
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
                        <Typography color={"textSecondary"} style={{marginBottom: spacing(1), fontStyle: "italic"}}>
                            By making an offer on this deck you agree to pay the seller the that amount + the listed shipping amount if they accept your offer.
                            You can cancel your offer at any time. We will provide the seller with your email.
                        </Typography>
                        <BuyingDisclaimer/>
                    </DialogContent>
                    <DialogActions>
                        <div style={{flexGrow: 1}}/>
                        <Button onClick={this.close} style={{marginRight: spacing(2)}}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.offer}
                            color="primary"
                            disabled={!userStore.emailVerified || disabled}
                        >
                            Send
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
