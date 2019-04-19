import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { deckStore } from "../decks/DeckStore"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { auctionStore } from "./AuctionStore"

interface BidButtonProps {
    nextValidBid: number
    currencySymbol: string
    auctionId: string
    sellerUsername: string
    youAreHighestBidder: boolean
}

@observer
export class BidButton extends React.Component<BidButtonProps> {

    @observable
    open = false

    @observable
    currentBid = ""

    constructor(props: BidButtonProps) {
        super(props)
        this.currentBid = props.nextValidBid.toString()
    }

    bid = () => {
        const {nextValidBid, currencySymbol, auctionId} = this.props
        this.open = false

        let currentBidNumber
        if (this.currentBid.trim().length > 0) {
            currentBidNumber = Number(this.currentBid.trim())
            if (isNaN(currentBidNumber)) {
                messageStore.setWarningMessage("The current bid must be a number.")
                return
            }
            if (currentBidNumber < nextValidBid) {
                messageStore.setWarningMessage(`Your bid must be equal to or greater than ${currencySymbol}${nextValidBid}.`)
                return
            }
        }

        auctionStore.bid(auctionId, currentBidNumber as number)
            .then(() => {
                userDeckStore.refreshDeckInfo()
                deckStore.refreshDeckSearch()
            })
    }

    render() {
        const {nextValidBid, currencySymbol, sellerUsername, youAreHighestBidder} = this.props
        let disabled = !userStore.loggedIn() || sellerUsername === userStore.username
        return (
            <div>
                <Button variant={"outlined"} color={"primary"} onClick={() => this.open = true} disabled={disabled}>
                    {youAreHighestBidder ? "Change Bid" : "Bid"}
                </Button>
                <Dialog
                    open={this.open}
                    onClose={() => this.open = false}
                >
                    <DialogTitle>Place Bid</DialogTitle>
                    <DialogContent>
                        <Typography style={{marginBottom: spacing(2)}}>
                            To place a bid you must bid {currencySymbol}{nextValidBid} or more.
                        </Typography>
                        <Typography style={{marginBottom: spacing(2)}}>
                            If your bid is higher than the maximum bid of the current high bidder, then you will be the highest bidder.
                        </Typography>
                        <TextField
                            label={"Bid"}
                            value={this.currentBid}
                            type={"number"}
                            onChange={event => this.currentBid = event.target.value}
                        />
                    </DialogContent>
                    <DialogActions>
                        <div style={{flexGrow: 1}}/>
                        <Button onClick={() => this.open = false} style={{marginRight: spacing(2)}}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.bid}
                            color="primary"
                        >
                            Bid
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
