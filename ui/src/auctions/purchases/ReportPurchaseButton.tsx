import { Dialog } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { HelperText } from "../../generic/CustomTypographies"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { purchaseStore } from "./PurchaseStore"
import { SaleType } from "./SaleType"

interface ReportPurchaseButtonProps {
    deckId: number
    deckName: string
    onClick: () => void
}

@observer
export class ReportPurchaseButton extends React.Component<ReportPurchaseButtonProps> {

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

    handleOpen = () => this.open = true

    handleClose = () => this.open = false

    render() {
        const {deckId, deckName} = this.props
        return (
            <>
                <MenuItem
                    onClick={this.handleOpen}
                >
                    Report Purchase
                </MenuItem>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        Complete Deck Sale
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label={"Purchase Amount"}
                            type={"number"}
                            value={this.saleAmount}
                            onChange={(event) => this.saleAmount = event.target.value}
                        />
                        <HelperText style={{marginTop: spacing(1)}}>
                            Purchase amount should not include shipping and handling. It should be the amount you paid in the seller's currency.
                        </HelperText>
                        <HelperText style={{marginTop: spacing(1)}}>
                            If this deck was purchased via Auction or offer it should already have a purchase recorded.
                        </HelperText>
                    </DialogContent>
                    <DialogActions>
                        <KeyButton onClick={this.handleClose}>Cancel</KeyButton>
                        <div style={{flexGrow: 1}}/>
                        <KeyButton
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => {
                                const amount = this.saleAmountAsNumber()
                                const buyerId = userStore.userId
                                if (amount == null || amount < 0) {
                                    messageStore.setWarningMessage("Please include a positive number to report a purchase.")
                                } else if (buyerId == null) {
                                    messageStore.setWarningMessage("Please ensure you're logged in to report a purchase.")
                                } else {
                                    purchaseStore.reportPurchase(deckName, {
                                        deckId,
                                        amount,
                                        saleType: SaleType.STANDARD,
                                        buyerId
                                    })
                                    this.handleClose()
                                }
                            }}
                            disabled={this.saleAmountAsNumber() == null}
                        >
                            Purchased
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}
