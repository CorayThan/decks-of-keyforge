import { Dialog, Link } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { deckListingStore } from "../../auctions/DeckListingStore"
import { purchaseStore } from "../../auctions/purchases/PurchaseStore"
import { SaleType } from "../../auctions/purchases/SaleType"
import { spacing } from "../../config/MuiConfig"
import { MyDokSubPaths } from "../../config/Routes"
import { HelperText } from "../../generic/CustomTypographies"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { DeckActionClickable } from "../buttons/DeckActionClickable"
import { Deck } from "../Deck"

interface SoldButtonProps {
    deck: Deck
    menuItem?: boolean
}

@observer
export class SoldButton extends React.Component<SoldButtonProps> {

    @observable
    open = false
    @observable
    saleAmount = ""

    saleAmountAsNumber = () => {
        let saleAmountNumber = 0
        if (this.saleAmount.trim().length > 0) {
            saleAmountNumber = Number(this.saleAmount.trim())
            if (!isNaN(saleAmountNumber)) {
                return saleAmountNumber
            }
        }
        return undefined
    }

    handleOpen = async () => {
        const saleInfo = deckListingStore.listingInfoForDeck(this.props.deck.id)
        if (saleInfo != null) {
            await deckListingStore.findDeckListingInfo(saleInfo.id)
            const {buyItNow} = deckListingStore.listingInfo!
            this.saleAmount = buyItNow?.toString() ?? ""
            this.open = true
        }
    }

    handleClose = () => this.open = false

    render() {
        const {deck, menuItem} = this.props
        return (
            <>
                <DeckActionClickable
                    menuItem={menuItem}
                    onClick={this.handleOpen}
                >
                    Unlist
                </DeckActionClickable>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        Complete Deck Sale
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label={"Sale Amount"}
                            type={"number"}
                            value={this.saleAmount}
                            onChange={(event) => this.saleAmount = event.target.value}
                        />
                        <HelperText style={{marginTop: spacing(1)}}>
                            If you are accepting an offer please accept it from <Link href={MyDokSubPaths.offers}>your offers page</Link>!
                        </HelperText>
                        <HelperText style={{marginTop: spacing(1)}}>
                            Sale amount should not include shipping and handling. It should be the amount paid by the buyer in the seller's currency.
                        </HelperText>
                    </DialogContent>
                    <DialogActions>
                        <KeyButton onClick={this.handleClose}>Cancel</KeyButton>
                        <div style={{flexGrow: 1}}/>
                        <KeyButton
                            variant={"contained"}
                            color={"secondary"}
                            style={{marginRight: spacing(1)}}
                            onClick={() => {
                                deckListingStore.cancel(deck.name, deck.id)
                                this.handleClose()
                            }}
                        >
                            Did not sell
                        </KeyButton>
                        <KeyButton
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => {
                                const amount = this.saleAmountAsNumber()
                                const sellerId = userStore.userId
                                if (amount == null || amount < 0) {
                                    messageStore.setWarningMessage("Please include a positive number to report a sale.")
                                } else if (sellerId == null) {
                                    messageStore.setWarningMessage("Please ensure you're logged in to report a sale.")
                                } else {
                                    purchaseStore.reportPurchase(deck.name, {
                                        deckId: deck.id,
                                        amount,
                                        saleType: SaleType.STANDARD,
                                        sellerId
                                    })
                                    this.handleClose()
                                }
                            }}
                            disabled={this.saleAmountAsNumber() == null}
                        >
                            Sold
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}
