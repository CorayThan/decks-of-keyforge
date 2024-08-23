import { Dialog, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { MyDokSubPaths } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { SaleNotificationQueryDto } from "../../generated-src/SaleNotificationQueryDto"
import { HelperText } from "../../generic/CustomTypographies"
import { SelectedOrExcludedHouses } from "../../houses/HouseSelectOrExclude"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { Loader } from "../../mui-restyled/Loader"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { FiltersConstraintsStore } from "../search/ConstraintDropdowns"
import { DeckFilters } from "../search/DeckFilters"
import { forSaleNotificationsStore } from "./ForSaleNotificationsStore"

interface CreateForSaleQueryProps {
    noDisplay: boolean
    filters: () => DeckFilters
    houses: SelectedOrExcludedHouses
    constraints: FiltersConstraintsStore
}

@observer
export class CreateForSaleQuery extends React.Component<CreateForSaleQueryProps> {
    @observable
    open = false

    @observable
    name = ""

    handleClose = () => {
        this.open = false
        forSaleNotificationsStore.queriesCount = undefined
    }
    handleOpen = () => {
        this.open = true
        this.name = ""
        forSaleNotificationsStore.findCountForUser()
    }

    addQuery = () => {
        const name = this.name.trim()
        if (name.length > 200) {
            messageStore.setWarningMessage("For sale notification names must be less than 200 characters.")
            return
        }
        const forSaleQuery: SaleNotificationQueryDto = Utils.jsonCopy(this.props.filters())
        forSaleQuery.userId = userStore.userId!
        forSaleQuery.houses = this.props.houses.getHousesSelectedTrue()
        forSaleQuery.constraints = this.props.constraints.cleanConstraints()
        forSaleQuery.name = name
        forSaleNotificationsStore.addQuery(forSaleQuery)
        this.handleClose()
    }

    constructor(props: CreateForSaleQueryProps) {
        super(props)
        makeObservable(this)
    }

    render() {

        if (this.props.noDisplay) {
            return null
        }

        const forSaleInCountry = userStore.country

        const currentNotifsCount = forSaleNotificationsStore.queriesCount

        const maxNotifsExceeded = (currentNotifsCount ?? 0) >= userStore.maxNotifications

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
                    {currentNotifsCount == null ? (
                        <DialogContent>
                            <Loader/>
                        </DialogContent>
                    ) : (
                        <>
                            <DialogContent>
                                <div style={{display: "grid", gridTemplateColumns: "178px 1fr", marginBottom: spacing(2)}}>
                                    <Typography color={maxNotifsExceeded ? "error" : undefined}>
                                        Current notifications:
                                    </Typography>
                                    <Typography color={maxNotifsExceeded ? "error" : undefined}>
                                        {currentNotifsCount}
                                    </Typography>
                                    <Typography>
                                        Max notifications:
                                    </Typography>
                                    <Typography>
                                        {userStore.maxNotifications}
                                    </Typography>
                                </div>
                                <HelperText style={{marginBottom: spacing(2)}}>
                                    Whenever a new deck is listed that matches your search selection on the left we will send you an email.
                                    Favorites, notes and tags will not be used.
                                    You can view and delete your notifications from your
                                </HelperText>
                                <LinkButton
                                    href={MyDokSubPaths.notifications}
                                    style={{marginBottom: spacing(2)}}
                                >
                                    Notifications Page
                                </LinkButton>
                                <Typography variant={"subtitle2"} color={"error"} style={{marginBottom: spacing(2)}}>
                                    Please ensure the search parameters are not too broad! You will be sent an email for all newly listed decks that match this
                                    search.
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
                                <KeyButton color={themeStore.darkMode ? "secondary" : "primary"} onClick={this.handleClose}>Cancel</KeyButton>
                                <KeyButton color={themeStore.darkMode ? "secondary" : "primary"} onClick={this.addQuery} disabled={!forSaleInCountry || maxNotifsExceeded}>
                                    Create
                                </KeyButton>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </div>
        )
    }
}
