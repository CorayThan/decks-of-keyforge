import { Dialog, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { SelectedHouses } from "../../houses/HouseSelect"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { FiltersConstraintsStore } from "../search/ConstraintDropdowns"
import { DeckFilters } from "../search/DeckFilters"
import { forSaleNotificationsStore } from "./ForSaleNotificationsStore"
import { ForSaleQuery } from "./ForSaleQuery"

interface CreateForSaleQueryProps {
    filters: DeckFilters
    houses: SelectedHouses
    constraints: FiltersConstraintsStore
}

@observer
export class CreateForSaleQuery extends React.Component<CreateForSaleQueryProps> {

    @observable
    open = false

    @observable
    name = ""

    handleClose = () => this.open = false
    handleOpen = () => {
        this.open = true
        this.name = ""
    }

    addQuery = () => {
        const name = this.name.trim()
        if (name.length > 200) {
            messageStore.setWarningMessage("For sale notification names must be less than 200 characters.")
            return
        }
        const forSaleQuery: ForSaleQuery = Utils.jsonCopy(this.props.filters)
        forSaleQuery.houses = this.props.houses.toArray()
        forSaleQuery.constraints = this.props.constraints.cleanConstraints()
        forSaleQuery.queryName = name
        forSaleNotificationsStore.addQuery(forSaleQuery)
        this.handleClose()
    }

    render() {
        const user = userStore.user
        if (
            user == null
            || !userStore.deckNotificationsAllowed
            || (!this.props.filters.forSale && !this.props.filters.forTrade && !this.props.filters.forAuction)
            || this.props.filters.owner === user.username
        ) {
            // Not allowed to create queries
            return null
        }

        const forSaleInCountry = userStore.country

        return (
            <div>
                <KeyButton
                    variant={"outlined"}
                    onClick={this.handleOpen}
                    style={{marginRight: spacing(2)}}
                >
                    Notify
                </KeyButton>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        Notify me
                    </DialogTitle>
                    <DialogContent>
                        <Typography style={{marginBottom: spacing(2)}}>
                            Whenever a new deck is listed that matches your search selection on the left we will send you an email.
                            Favorites and notes will not be used currently.
                            You can view and delete your notifications from your
                        </Typography>
                        <LinkButton
                            to={Routes.myProfile}
                            style={{marginBottom: spacing(2)}}
                        >
                            Profile
                        </LinkButton>
                        <Typography variant={"subtitle2"} color={"error"} style={{marginBottom: spacing(2)}}>
                            Please ensure the search parameters are not too broad! You will be sent an email for all newly listed decks that match this search.
                        </Typography>
                        <TextField
                            label={"Notification Name"}
                            value={this.name}
                            onChange={(event) => this.name = event.target.value}
                            fullWidth={true}
                            helperText={"Distinguish between your notifications"}
                        />
                    </DialogContent>
                    <DialogActions>
                        <KeyButton color={"primary"} onClick={this.handleClose}>Cancel</KeyButton>
                        <KeyButton color={"primary"} onClick={this.addQuery} disabled={!forSaleInCountry}>
                            Create
                        </KeyButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
