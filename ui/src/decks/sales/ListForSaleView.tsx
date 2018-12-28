import { Dialog } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Utils } from "../../config/Utils"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { DeckCondition, deckConditionReadableValue } from "../../userdeck/UserDeck"
import { Deck } from "../Deck"

interface ListForSaleViewProps {
    deck: Deck
}

@observer
export class ListForSaleView extends React.Component<ListForSaleViewProps> {

    @observable
    open = false

    @observable
    forSale = true
    @observable
    forTrade = true
    @observable
    condition = DeckCondition.NEW_IN_PLASTIC
    @observable
        redeemed = true

    handleClose = () => this.open = false
    handleOpen = () => this.open = true

    render() {
        const deck = this.props.deck
        return (
            <div>
                <KeyButton
                    color={"primary"}
                    style={{marginLeft: spacing(2)}}
                    onClick={this.handleOpen}
                >
                    Sell or trade
                </KeyButton>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>List "{deck.name}" for sale or trade</DialogTitle>
                    <DialogContent>
                        <FormGroup row={true}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.forSale}
                                        onChange={(event) => this.forSale = event.target.checked}
                                        color={"primary"}
                                    />
                                }
                                label={"For sale"}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.forTrade}
                                        onChange={(event) => this.forTrade = event.target.checked}
                                        color={"primary"}
                                    />
                                }
                                label={"For trade"}
                            />
                        </FormGroup>
                        <TextField
                            select={true}
                            label={"Condition"}
                            value={this.condition}
                            onChange={(event) => this.condition = event.target.value as DeckCondition}
                        >
                            {Utils.enumValues(DeckCondition).map(condition => {
                                return (
                                    <MenuItem key={condition} value={condition}>
                                        {deckConditionReadableValue(condition as DeckCondition)}
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Cancel</KeyButton>
                        <KeyButton color={"primary"}>List</KeyButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
