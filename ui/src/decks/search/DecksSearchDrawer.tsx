import { Button, Collapse, FormGroup, IconButton, MenuItem, Tooltip } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import FormLabel from "@material-ui/core/FormLabel"
import InputLabel from "@material-ui/core/InputLabel"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { Add, BarChart, Close, Delete, ExpandLess, ExpandMore, ViewList, ViewModule } from "@material-ui/icons"
import { Autocomplete, ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import * as History from "history"
import { computed } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { ChangeEvent } from "react"
import { cardStore } from "../../cards/CardStore"
import { KeyDrawer, keyDrawerStore } from "../../components/KeyDrawer"
import { SortDirectionView } from "../../components/SortDirectionView"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing, theme } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { log } from "../../config/Utils"
import { expansionInfoMapNumbers } from "../../expansions/Expansions"
import { ExpansionSelector, SelectedExpansion } from "../../expansions/ExpansionSelector"
import { AuctionDeckIcon } from "../../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { UnregisteredDeckIcon } from "../../generic/icons/UnregisteredDeckIcon"
import { House, houseValuesArray } from "../../houses/House"
import { HouseSelectOrExclude, SelectedOrExcludedHouses } from "../../houses/HouseSelectOrExclude"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { Loader, LoaderSize } from "../../mui-restyled/Loader"
import { SelectedOptions } from "../../mui-restyled/SelectedOptions"
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

    selectedExpansion = new SelectedExpansion(this.props.filters.expansions.map(expNum => expansionInfoMapNumbers.get(expNum)!.backendEnum))
    selectedHouses = new SelectedOrExcludedHouses(this.props.filters.houses, this.props.filters.excludeHouses)
    selectedSortStore = new DeckSortSelectStore(
        this.props.filters.forTrade || (this.props.filters.forSale === true),
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
        filters.expansions = this.selectedExpansion.expansionsAsNumberArray()
        filters.houses = this.selectedHouses.getHousesSelectedTrue()
        filters.excludeHouses = this.selectedHouses.getHousesExcludedTrue()

        if (!this.selectedHouses.validHouseSelection()) {
            messageStore.setWarningMessage("You may select up to 3 houses with houses excluded, and exclude all but 3.")
            return
        }

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
        this.selectedExpansion.reset()
    }

    updateForSale = (forSale?: boolean) => {
        const filters = this.props.filters
        filters.forSale = forSale
        if (forSale === false) {
            filters.forTrade = false
            filters.forAuction = false
        }
        this.handleOtherValuesForSaleOrTrade()
    }

    updateForAuction = (forAuction: boolean) => {
        const filters = this.props.filters
        filters.forAuction = forAuction
        if (forAuction && filters.forSale === false) {
            filters.forSale = undefined
        }
        this.handleOtherValuesForSaleOrTrade()
    }

    updateForTrade = (forTrade: boolean) => {
        const filters = this.props.filters
        filters.forTrade = forTrade
        if (forTrade && filters.forSale === false) {
            filters.forSale = undefined
        }
        this.handleOtherValuesForSaleOrTrade()
    }

    private handleOtherValuesForSaleOrTrade = () => {
        const filters = this.props.filters
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
            forSaleInCountry, handleNotesUpdate, notes, notesUser, removeNotes
        } = this.props.filters

        let myCountry: string | undefined
        if (!!(userStore.country
            && (forSale || forTrade || forAuction))) {
            myCountry = userStore.country
        }
        const showLoginForCountry = !myCountry && (forSale || forTrade || forAuction)
        const showMyDecks = userStore.loggedIn()
        const showDecksOwner = !!owner && owner !== userStore.username

        const constraintOptions = [
            "amberControl",
            "expectedAmber",
            "artifactControl",
            "creatureControl",
            "efficiency",
            "disruption",
            "amberProtection",
            "houseCheating",
            "effectivePower",
            "rawAmber",
            "aercScore",
            "synergyRating",
            "antisynergyRating",
            "sasRating",
            "creatureCount",
            "actionCount",
            "artifactCount",
            "upgradeCount",
            "powerLevel",
            "chains",
            "maverickCount",
            "anomalyCount",
        ]
        const hideMinMaxConstraintOptions = [
            "listedWithinDays"
        ]

        if (forSale) {
            constraintOptions.unshift("buyItNow")
        }
        if (forSale || forTrade) {
            constraintOptions.unshift("listedWithinDays")
        }

        return (
            <KeyDrawer deckVersion={true}>
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
                        {notes.length > 0 || userStore.loggedIn() ? (
                            <ListItem>
                                {notesUser.length === 0 || userStore.username === notesUser ? (
                                    <div style={{display: "flex", alignItems: "flex-end"}}>
                                        <TextField
                                            label={"Search Notes"}
                                            onChange={handleNotesUpdate}
                                            value={notes}
                                            style={{marginRight: spacing(2), width: 128}}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={!!keyLocalStorage.genericStorage.viewNotes}
                                                    onChange={() => {
                                                        keyLocalStorage.updateGenericStorage({viewNotes: !keyLocalStorage.genericStorage.viewNotes})
                                                    }}
                                                    disabled={!showMyDecks}
                                                />
                                            }
                                            label={<Typography variant={"body2"} noWrap={true}>View Notes</Typography>}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{display: "flex", alignItems: "center", marginBottom: theme.spacing(1)}}>
                                            <InputLabel>
                                                {notesUser}'s Notes
                                            </InputLabel>
                                            <IconButton onClick={removeNotes} size={"small"} style={{marginLeft: theme.spacing(1)}}>
                                                <Delete/>
                                            </IconButton>
                                        </div>
                                        <Typography variant={"body2"} color={"textSecondary"}>
                                            "{notes}"
                                        </Typography>
                                    </div>
                                )}
                            </ListItem>
                        ) : null}
                        <ListItem style={{marginTop: spacing(2)}}>
                            <HouseSelectOrExclude selectedHouses={this.selectedHouses}/>
                        </ListItem>
                        <ListItem>
                            <FormGroup row={true}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.myDecks}
                                            onChange={handleMyDecksUpdate}
                                            disabled={!showMyDecks}
                                        />
                                    }
                                    label={<Typography variant={"body2"}>My Decks</Typography>}
                                    style={{width: 144}}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.props.filters.forSale === true}
                                            onChange={(event) => this.updateForSale(event.target.checked ? true : undefined)}
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
                                <div style={{display: "flex"}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={myCountry != null && forSaleInCountry === myCountry}
                                                onChange={(event) => this.props.filters.forSaleInCountry = event.target.checked ? myCountry : undefined}
                                                disabled={!myCountry}
                                            />
                                        }
                                        label={<Typography variant={"body2"}>In My Country</Typography>}
                                        style={{width: 144}}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.props.filters.forSale === false}
                                                onChange={(event) => this.updateForSale(event.target.checked ? false : undefined)}
                                            />
                                        }
                                        label={<Typography variant={"body2"}>Not For Sale</Typography>}
                                        style={{width: 144}}
                                    />
                                </div>
                                <Collapse in={keyLocalStorage.genericStorage.showMoreDeckSearchOptions}>
                                    <div style={{display: "flex"}}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.forAuction}
                                                    onChange={(event) => this.updateForAuction(event.target.checked)}
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
                                                    checked={this.props.filters.forTrade}
                                                    onChange={(event) => this.updateForTrade(event.target.checked)}
                                                />
                                            }
                                            label={(
                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <TradeDeckIcon style={{minWidth: 18}}/>
                                                    <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For Trade</Typography>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div style={{display: "flex"}}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={myFavorites}
                                                    onChange={handleMyFavoritesUpdate}
                                                    disabled={!showMyDecks}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>My Favorites</Typography>}
                                            style={{width: 144}}
                                        />
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
                                            label={<Typography variant={"body2"}>Past Auctions</Typography>}
                                            style={{width: 144}}
                                        />
                                    </div>
                                    <div style={{display: "flex"}}>
                                        {userStore.patron && userStore.hasTeam && (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.props.filters.teamDecks}
                                                        onChange={(event) => {
                                                            this.props.filters.teamDecks = event.target.checked
                                                        }}
                                                    />
                                                }
                                                label={<Typography variant={"body2"}>Team Decks</Typography>}
                                                style={{width: 144}}
                                            />
                                        )}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.registered === false}
                                                    onChange={(event) => this.props.filters.registered = event.target.checked ? false : undefined}
                                                />
                                            }
                                            label={(
                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <UnregisteredDeckIcon/>
                                                    <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>Unregistered</Typography>
                                                </div>
                                            )}
                                            style={{width: 144}}
                                        />
                                    </div>
                                    {userStore.username != null && ["Coraythan", "randomjoe", "dzky", "Zarathustra05"].includes(userStore.username) && (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.withOwners}
                                                    onChange={(event) => this.props.filters.withOwners = event.target.checked}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>With Owners</Typography>}
                                            style={{width: 144}}
                                        />
                                    )}
                                </Collapse>
                                <IconButton
                                    onClick={() => keyLocalStorage.updateGenericStorage({showMoreDeckSearchOptions: !keyLocalStorage.genericStorage.showMoreDeckSearchOptions})}>
                                    {keyLocalStorage.genericStorage.showMoreDeckSearchOptions ? <ExpandLess fontSize={"small"}/> :
                                        <ExpandMore fontSize={"small"}/>}
                                </IconButton>
                                {showDecksOwner && (
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <Typography>Owner: {owner}</Typography>
                                        <IconButton onClick={() => this.props.filters.owner = ""}><Delete fontSize={"small"}/></IconButton>
                                    </div>
                                )}
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
                            <div style={{flexGrow: 1}}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <FormLabel style={{marginRight: spacing(1)}}>Cards</FormLabel>
                                    <IconButton onClick={() => cards.push({cardNames: [], quantity: 1})}>
                                        <Add fontSize={"small"}/>
                                    </IconButton>
                                </div>
                                <div style={{flexGrow: 1}}>
                                    {cardStore.cardNames.length === 0 && cards.length > 0 ? (
                                        <Loader size={LoaderSize.SMALL}/>
                                    ) : (
                                        <>

                                            {cards.map((card, idx) => {
                                                const value = card.house ? card.house : card.quantity.toString()
                                                const selected = new SelectedOptions(card.cardNames, (values: string[]) => card.cardNames = values)
                                                return (
                                                    <div key={idx}>

                                                        <Autocomplete
                                                            multiple={true}
                                                            // @ts-ignore
                                                            options={cardStore.cardNames}
                                                            value={selected.selectedValues}
                                                            renderInput={(params) => <TextField {...params} label={"Any of these cards"}/>}
                                                            onChange={(event: ChangeEvent<{}>, newValue: string[] | null) => {
                                                                selected.update(newValue ?? [])
                                                            }}
                                                            style={{marginTop: spacing(1)}}
                                                        />
                                                        <TextField
                                                            style={{minWidth: 80, marginTop: spacing(1), marginBottom: spacing(1)}}
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
                                                            <MenuItem value={"7"}>7+</MenuItem>
                                                            {houseValuesArray.map(houseValue => {
                                                                return (
                                                                    <MenuItem value={houseValue.house} key={houseValue.house}>
                                                                        {houseValue.house}
                                                                    </MenuItem>
                                                                )
                                                            })}
                                                        </TextField>
                                                        <IconButton
                                                            onClick={() => cards.splice(idx, 1)}
                                                            style={{marginTop: spacing(2), marginLeft: spacing(1)}}
                                                        >
                                                            <Delete fontSize={"small"}/>
                                                        </IconButton>
                                                        <Button
                                                            onClick={() => cards.push({cardNames: [], quantity: 1})}
                                                            style={{marginLeft: spacing(1), marginTop: spacing(2.5)}}
                                                        >
                                                            And Card...
                                                        </Button>
                                                    </div>
                                                )
                                            })}

                                        </>
                                    )}
                                </div>
                            </div>
                        </ListItem>
                        <ListItem>
                            <ExpansionSelector
                                store={this.selectedExpansion}
                                small={true}
                                displayNoneOption={true}
                                style={{marginRight: spacing(2)}}
                            />
                            <DeckSortSelect store={this.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView hasSort={this.props.filters}/>
                            </div>
                        </ListItem>
                        <ListItem>
                            <div style={{display: "flex", marginTop: spacing(1), marginBottom: spacing(1)}}>
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
                                <Typography variant={"subtitle2"} style={{marginBottom: spacing(1)}}>
                                    You
                                    found {deckStore.decksCount.count}{deckStore.decksCount.count === 1000 || deckStore.decksCount.count === 10000 ? "+ " : ""} decks
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
                                        value={keyLocalStorage.deckListViewType}
                                        exclusive={true}
                                        onChange={(event, viewType) => {
                                            keyLocalStorage.setDeckListViewType(viewType)
                                        }}
                                        style={{marginRight: spacing(2)}}
                                        size={"small"}
                                    >
                                        <ToggleButton value={"grid"}>
                                            <ViewModule/>
                                        </ToggleButton>
                                        <ToggleButton value={"graphs"}>
                                            <BarChart/>
                                        </ToggleButton>
                                        <ToggleButton value={"table"}>
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
                                        size={"small"}
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
