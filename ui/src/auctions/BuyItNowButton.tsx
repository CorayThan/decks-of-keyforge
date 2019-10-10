import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { deckStore } from "../decks/DeckStore"
import { BuyingDisclaimer } from "../decks/sales/SaleInfoView"
import { SendEmailVerification } from "../emails/SendEmailVerification"
import { userStore } from "../user/UserStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { auctionStore } from "./AuctionStore"

interface BuyItNowButtonProps {
    currencySymbol: string
    auctionId: string
    sellerUsername: string
    buyItNow: number
}

@observer
export class BuyItNowButton extends React.Component<BuyItNowButtonProps> {

    @observable
    open = false

    buyItNow = () => {
        const {auctionId} = this.props
        this.open = false
        auctionStore.buyItNow(auctionId)
            .then(() => {
                userDeckStore.refreshDeckInfo()
                deckStore.refreshDeckSearch()
            })
    }

    render() {
        const {currencySymbol, sellerUsername, buyItNow} = this.props
        const disabled = !userStore.loggedIn() || sellerUsername === userStore.username
        return (
            <div>
                <Button color={"primary"} onClick={() => this.open = true} disabled={disabled}>
                    Buy It Now
                </Button>
                <Dialog
                    open={this.open}
                    onClose={() => this.open = false}
                >
                    <DialogTitle>Buy It Now</DialogTitle>
                    <DialogContent>
                        <SendEmailVerification message={"Please verify your email to buy decks for auction."}/>
                        <Typography variant={"subtitle1"} style={{marginBottom: spacing(2)}}>
                            Are you sure you want to buy this deck for {currencySymbol}{buyItNow}?
                        </Typography>
                        <Typography color={"textSecondary"} style={{marginBottom: spacing(2), fontStyle: "italic"}}>
                            By buying this deck you agree to pay the seller the buy it now price as well as any shipping listed in the description. You and
                            the seller will be sent an email from Decks of KeyForge. You can also contact the seller separately with their listed contact
                            information.
                        </Typography>
                        <BuyingDisclaimer/>
                    </DialogContent>
                    <DialogActions>
                        <div style={{flexGrow: 1}}/>
                        <Button onClick={() => this.open = false} style={{marginRight: spacing(2)}}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.buyItNow}
                            color="primary"
                            disabled={!userStore.emailVerified}
                        >
                            Buy
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
