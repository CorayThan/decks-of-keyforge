import { FormGroup, IconButton, MenuItem, Tooltip } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { Add, Close, Delete, ViewList, ViewModule } from "@material-ui/icons"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import * as History from "history"
import { computed } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { CardSearchSuggest } from "../../cards/CardSearchSuggest"
import { KeyDrawer, keyDrawerStore } from "../../components/KeyDrawer"
import { SortDirectionView } from "../../components/SortDirectionView"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { log } from "../../config/Utils"
import { ExpansionSelector, SelectedExpansion } from "../../expansions/ExpansionSelector"
import { AuctionDeckIcon } from "../../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { UnregisteredDeckIcon } from "../../generic/icons/UnregisteredDeckIcon"
import { House, houseValuesArray } from "../../houses/House"
import { HouseSelect, SelectedHouses } from "../../houses/HouseSelect"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { messageStore } from "../../ui/MessageStore"
import { screenStore } from "../../ui/ScreenStore"
import { userStore } from "../../user/UserStore"
import { deckTableViewStore } from "../DeckListView"
import { deckStore } from "../DeckStore"
import { CreateForSaleQuery } from "../salenotifications/CreateForSaleQuery"
import { DeckSorts, DeckSortSelect, DeckSortSelectStore } from "../selects/DeckSortSelect"
import { ConstraintDropdowns, FiltersConstraintsStore } from "./ConstraintDropdowns"
import { DeckFilters } from "./DeckFilters"

interface DecksSearchDrawerProps {
    history: History.History
    filters: DeckFilters
}

@observer
export class DecksSearchDrawer extends React.Component<DecksSearchDrawerProps> {

    selectedExpansion = new SelectedExpansion()
    selectedHouses = new SelectedHouses(this.props.filters.houses)
    selectedSortStore = new DeckSortSelectStore(
        this.props.filters.forTrade || this.props.filters.forSale,
        this.props.filters.forAuction && !(this.props.filters.forTrade || this.props.filters.forSale),
        this.props.filters.completedAuctions,
        this.props.filters.sort
    )
    constraintsStore = new FiltersConstraintsStore(this.props.filters.constraints)

    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        const filters = this.props.filters
        filters.expansions = this.selectedExpansion.expansionsAsArray()
        filters.houses = this.selectedHouses.toArray()
        filters.sort = this.selectedSortStore.toEnumValue()
        filters.constraints = this.constraintsStore.cleanConstraints()

        if (!filters.forSale && !filters.forTrade && !filters.forAuction && !filters.myFavorites && !filters.owner) {
            // search is broad, so disable bad searches
            if (filters.sort === "NAME") {
                messageStore.setWarningMessage("To use the name sort please check for sale, for trade, my decks, or my favorites.")
                return
            }
        }

        this.props.history.push(Routes.deckSearch(filters))
        keyDrawerStore.closeIfSmall()
        deckTableViewStore.reset()
    }

    clearSearch = () => {
        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        this.props.filters.reset()
        this.constraintsStore.reset()
    }

    updateForSaleOrTrade = (forSale?: boolean, forTrade?: boolean, forAuction?: boolean) => {
        const filters = this.props.filters
        if (forSale != null) {
            filters.forSale = forSale
        }
        if (forTrade != null) {
            filters.forTrade = forTrade
        }
        if (forAuction != null) {
            filters.forAuction = forAuction
        }
        if (!(filters.forSale || filters.forTrade || filters.forAuction)) {
            filters.forSaleInCountry = undefined
        }
        this.selectedSortStore.forSaleOrTrade = filters.forSale || filters.forTrade
        this.selectedSortStore.forAuction = filters.forAuction
        this.selectedSortStore.completedAuctions = false
        filters.completedAuctions = false
        filters.notForSale = false

        if (!this.selectedSortStore.sortIsValid()) {
            log.debug("Sort not defined")
            filters.sort = DeckSorts.sas
        }
    }

    @computed
    get myDecks(): boolean {
        return this.props.filters.owner === userStore.username
    }

    render() {
        const {
            title, myFavorites, handleTitleUpdate, handleMyDecksUpdate, handleMyFavoritesUpdate, cards, owner, forSale, forTrade, forAuction,
            forSaleInCountry
        } = this.props.filters

        let myCountry: string | undefined
        if (!!(userStore.country
            && (forSale || forTrade || forAuction))) {
            myCountry = userStore.country
        }
        const showLoginForCountry = !myCountry && (forSale || forTrade || forAuction)
        const showMyDecks = userStore.loggedIn()
        const showDecksOwner = !!owner && owner !== userStore.username
        const optionals = !showMyDecks && !showDecksOwner ? null : (
            <>
                {showMyDecks ? (
                    <div style={{display: "flex"}}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.myDecks}
                                    onChange={handleMyDecksUpdate}
                                />
                            }
                            label={"My Decks"}
                            style={{width: 144}}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={myFavorites}
                                    onChange={handleMyFavoritesUpdate}
                                />
                            }
                            label={"My Favorites"}
                        />
                    </div>
                ) : null}
                {showDecksOwner ? (
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Typography>Owner: {owner}</Typography>
                        <IconButton onClick={() => this.props.filters.owner = ""}><Delete fontSize={"small"}/></IconButton>
                    </div>
                ) : null}
            </>
        )

        const constraintOptions = [
            "amberControl",
            "expectedAmber",
            "artifactControl",
            "creatureControl",
            "deckManipulation",
            "effectivePower",
            "aercScore",
            "synergyRating",
            "antisynergyRating",
            "sasRating",
            "cardsRating",
            "creatureCount",
            "actionCount",
            "artifactCount",
            "upgradeCount",
            "powerLevel",
            "chains",
            "maverickCount",
        ]
        const hideMinMaxConstraintOptions = [
            "listedWithinDays"
        ]

        if (forSale) {
            constraintOptions.unshift("askingPrice")
        }
        if (forSale || forTrade) {
            constraintOptions.unshift("listedWithinDays")
        }

        return (
            <KeyDrawer>
                <form onSubmit={this.search}>
                    <List dense={true}>
                        <ListItem>
                            <TextField
                                label={"Deck Name"}
                                onChange={handleTitleUpdate}
                                value={title}
                                fullWidth={!screenStore.screenSizeXs()}
                            />
                            <div style={{flexGrow: 1}}/>
                            {screenStore.screenSizeXs() ? (
                                <IconButton onClick={() => keyDrawerStore.open = false}>
                                    <Close/>
                                </IconButton>
                            ) : null}
                        </ListItem>
                        <ListItem>
                            <ExpansionSelector
                                store={this.selectedExpansion}
                                small={false}
                                displayNoneOption={true}
                            />
                        </ListItem>
                        <ListItem>
                            <HouseSelect selectedHouses={this.selectedHouses}/>
                        </ListItem>
                        <ListItem>
                            <FormGroup row={true}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.props.filters.forSale}
                                            onChange={(event) => this.updateForSaleOrTrade(event.target.checked)}
                                        />
                                    }
                                    label={(
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <SellDeckIcon/>
                                            <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For Sale</Typography>
                                        </div>
                                    )}
                                    style={{width: 144}}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.props.filters.forTrade}
                                            onChange={(event) => this.updateForSaleOrTrade(undefined, event.target.checked)}
                                        />
                                    }
                                    label={(
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <TradeDeckIcon style={{minWidth: 18}}/>
                                            <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For Trade</Typography>
                                        </div>
                                    )}
                                />
                                <div style={{display: "flex"}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.props.filters.forAuction}
                                                onChange={(event) => this.updateForSaleOrTrade(undefined, undefined, event.target.checked)}
                                            />
                                        }
                                        label={(
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <AuctionDeckIcon style={{minWidth: 18}}/>
                                                <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>Auctions</Typography>
                                            </div>
                                        )}
                                        style={{width: 144}}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.props.filters.includeUnregistered}
                                                onChange={(event) => this.props.filters.includeUnregistered = event.target.checked}
                                            />
                                        }
                                        label={(
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <UnregisteredDeckIcon/>
                                                <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>Unregistered</Typography>
                                            </div>
                                        )}
                                    />
                                </div>
                                <div style={{display: "flex"}}>
                                    {this.props.filters.forAuction ? (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.completedAuctions}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        this.props.filters.handleCompletedAuctionsUpdate(event)
                                                        this.selectedSortStore.completedAuctions = this.props.filters.completedAuctions
                                                    }}
                                                />
                                            }
                                            label={"Completed auctions"}
                                            style={{width: 144}}
                                        />
                                    ) : null}
                                    {myCountry ? (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={forSaleInCountry === myCountry}
                                                    onChange={(event) => this.props.filters.forSaleInCountry = event.target.checked ? myCountry : undefined}
                                                />
                                            }
                                            label={"In my country"}
                                            style={{width: 144}}
                                        />
                                    ) : null}
                                </div>
                                {optionals}
                                {userStore.username === "Coraythan" ? (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.props.filters.withOwners}
                                                onChange={(event) => this.props.filters.withOwners = event.target.checked}
                                            />
                                        }
                                        label={"With Owners"}
                                        style={{width: 144}}
                                    />
                                ) : null}
                                {showLoginForCountry ? (
                                    <div style={{display: "flex"}}>
                                        <KeyLink to={userStore.loggedIn() ? Routes.myProfile : Routes.registration}>
                                            <Typography variant={"body2"}>
                                                Select your country
                                            </Typography>
                                        </KeyLink>
                                        <Typography variant={"body2"} style={{marginLeft: spacing(1)}}>
                                            to filter decks by country
                                        </Typography>
                                    </div>
                                ) : null}
                                {this.props.filters.notForSale ? (
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <Typography>Not for sale</Typography>
                                        <IconButton onClick={() => this.props.filters.notForSale = false}><Delete fontSize={"small"}/></IconButton>
                                    </div>
                                ) : null}
                            </FormGroup>
                        </ListItem>
                        <ListItem>
                            <ConstraintDropdowns
                                store={this.constraintsStore}
                                properties={constraintOptions}
                                hideMinMax={hideMinMaxConstraintOptions}
                            />
                        </ListItem>
                        <ListItem>
                            <div>
                                {cards.map((card, idx) => {
                                    const value = card.house ? card.house : card.quantity.toString()
                                    return (
                                        <div style={{display: "flex", marginBottom: spacing(1)}} key={idx}>
                                            <CardSearchSuggest
                                                card={card}
                                                style={{marginTop: 12}}
                                            />
                                            <TextField
                                                style={{width: 56, marginLeft: spacing(2)}}
                                                label={"Copies"}
                                                select={true}
                                                value={value}
                                                onChange={event => {
                                                    const valueAsNumber = Number(event.target.value)
                                                    if (isNaN(valueAsNumber)) {
                                                        card.house = event.target.value as House
                                                        card.quantity = 1
                                                    } else {
                                                        card.quantity = valueAsNumber
                                                        card.house = undefined
                                                    }
                                                }}
                                            >
                                                <MenuItem value={"0"}>None</MenuItem>
                                                <MenuItem value={"1"}>1+</MenuItem>
                                                <MenuItem value={"2"}>2+</MenuItem>
                                                <MenuItem value={"3"}>3+</MenuItem>
                                                <MenuItem value={"4"}>4+</MenuItem>
                                                <MenuItem value={"5"}>5+</MenuItem>
                                                <MenuItem value={"6"}>6+</MenuItem>
                                                {houseValuesArray.map(houseValue => {
                                                    return (
                                                        <MenuItem value={houseValue.house} key={houseValue.house}>
                                                            {houseValue.house}
                                                        </MenuItem>
                                                    )
                                                })}
                                            </TextField>
                                            {idx === 0 && cards.length < 10 ? (
                                                <IconButton onClick={() => cards.push({cardName: "", quantity: 1})}>
                                                    <Add fontSize={"small"}/>
                                                </IconButton>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </div>
                        </ListItem>
                        <ListItem>
                            <DeckSortSelect store={this.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView hasSort={this.props.filters}/>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div style={{display: "flex"}}>
                                <KeyButton
                                    variant={"outlined"}
                                    onClick={this.clearSearch}
                                    style={{marginRight: spacing(2)}}
                                >
                                    Clear
                                </KeyButton>
                                <CreateForSaleQuery
                                    filters={this.props.filters}
                                    houses={this.selectedHouses}
                                    constraints={this.constraintsStore}
                                />
                                <KeyButton
                                    variant={"contained"}
                                    color={"secondary"}
                                    type={"submit"}
                                    loading={deckStore.searchingForDecks}
                                    disabled={deckStore.searchingForDecks}
                                >
                                    Search
                                </KeyButton>
                            </div>
                        </ListItem>
                        {deckStore.decksCount ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>
                                    You found {deckStore.decksCount.count}{deckStore.decksCount.count === 1000 ? "+ " : ""} decks
                                </Typography>
                            </ListItem>
                        ) : null}
                        {deckStore.countingDecks ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>Counting ...</Typography>
                            </ListItem>
                        ) : null}
                        <ListItem>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Tooltip title={"View type"}>
                                    <ToggleButtonGroup
                                        value={keyLocalStorage.showTableView}
                                        exclusive={true}
                                        onChange={keyLocalStorage.toggleDeckTableView}
                                        style={{marginRight: spacing(2)}}
                                    >
                                        <ToggleButton value={false}>
                                            <ViewModule/>
                                        </ToggleButton>
                                        <ToggleButton value={true}>
                                            <ViewList/>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Tooltip>
                                <Tooltip title={"Page size"}>
                                    <ToggleButtonGroup
                                        value={keyLocalStorage.deckPageSize}
                                        exclusive={true}
                                        onChange={(event, size) => {
                                            keyLocalStorage.setDeckPageSize(size)
                                            this.search()
                                        }}
                                    >
                                        <ToggleButton value={20}>
                                            20
                                        </ToggleButton>
                                        <ToggleButton value={100}>
                                            100
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Tooltip>
                            </div>
                        </ListItem>
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}
