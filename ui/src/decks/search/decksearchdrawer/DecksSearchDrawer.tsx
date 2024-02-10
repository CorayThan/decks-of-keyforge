import { Box, Divider, FormGroup, IconButton, MenuItem, Switch, Tooltip } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { BarChart, Close, ViewList, ViewModule } from "@material-ui/icons"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import * as History from "history"
import { computed, makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyDrawer, keyDrawerStore, KeyDrawerVersion } from "../../../components/KeyDrawer"
import { SearchDrawerExpansionPanel } from "../../../components/SearchDrawerExpansionPanel"
import { SortDirectionView } from "../../../components/SortDirectionView"
import { keyLocalStorage } from "../../../config/KeyLocalStorage"
import { spacing } from "../../../config/MuiConfig"
import { MyDokSubPaths, Routes } from "../../../config/Routes"
import { Utils } from "../../../config/Utils"
import { ExpansionSelectOrExclude } from "../../../expansions/ExpansionSelectOrExclude"
import { PatreonRewardsTier } from "../../../generated-src/PatreonRewardsTier"
import { SellDeckIcon } from "../../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../../generic/icons/TradeDeckIcon"
import { HouseSelectOrExclude } from "../../../houses/HouseSelectOrExclude"
import { KeyButton } from "../../../mui-restyled/KeyButton"
import { KeyLink } from "../../../mui-restyled/KeyLink"
import { LinkButton } from "../../../mui-restyled/LinkButton"
import { messageStore } from "../../../ui/MessageStore"
import { screenStore } from "../../../ui/ScreenStore"
import { UserSearchSuggest } from "../../../user/search/UserSearchSuggest"
import { UserLink } from "../../../user/UserLink"
import { userStore } from "../../../user/UserStore"
import { deckStore } from "../../DeckStore"
import { CreateForSaleQuery } from "../../salenotifications/CreateForSaleQuery"
import { DeckSortSelect } from "../../selects/DeckSortSelect"
import { DeckFilters } from "../DeckFilters"
import { DownloadDeckResults } from "../DownloadDeckResults"
import { DeckSearchDrawerCards } from "./DeckSearchDrawerCards"
import { DeckSearchDrawerConstraints } from "./DeckSearchDrawerConstraints"
import { DeckSearchDrawerTagsAndNotes } from "./DeckSearchDrawerTagsAndNotes"
import { ArrayUtils } from "../../../config/ArrayUtils"
import { deckSearchDrawerStore } from "./DeckSearchDrawerStore"

interface DecksSearchDrawerProps {
    location: History.Location
    history: History.History
    filters: DeckFilters
}

@observer
export class DecksSearchDrawer extends React.Component<DecksSearchDrawerProps> {
    @observable
    displayHouses = false
    @observable
    displayConstraints = false
    @observable
    displayCards = false

    search = (event?: React.FormEvent, analyze?: boolean) => {
        if (event) {
            event.preventDefault()
        }

        if (!deckSearchDrawerStore.selectedHouses.validHouseSelection()) {
            messageStore.setWarningMessage("You may select up to 3 houses with houses excluded, and exclude all but 3.")
            return
        }

        const filters = this.makeFilters()

        if (analyze) {
            this.props.history.push(Routes.analyzeDeckSearch(filters))
        } else {
            this.props.history.push(Routes.deckSearch(filters))
        }
        keyDrawerStore.closeIfSmall()
    }

    makeFilters = () => {
        const filters = this.props.filters
        filters.expansions = deckSearchDrawerStore.selectedExpansions.expansionsAsNumberArray()
        filters.houses = deckSearchDrawerStore.selectedHouses.getHousesSelectedTrue()
        filters.excludeHouses = deckSearchDrawerStore.selectedHouses.getHousesExcludedTrue()
        filters.sort = deckSearchDrawerStore.selectedSortStore.toEnumValue()
        filters.constraints = deckSearchDrawerStore.constraintsStore.cleanConstraints()
        return filters
    }

    clearSearch = () => {
        deckSearchDrawerStore.clear()
        this.props.filters.reset()
    }

    updateNotForSale = (notForSale: boolean) => {
        const filters = this.props.filters
        filters.notForSale = notForSale
    }

    updateForSale = (forSale?: boolean) => {
        const filters = this.props.filters
        filters.forSale = forSale
        if (forSale === false) {
            filters.forTrade = false
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

    handleTagsUpdate = (tagIds: number[]) => {
        this.props.filters.tags = tagIds
    }

    handleNotTagsUpdate = (tagIds: number[]) => {
        this.props.filters.notTags = tagIds
    }

    handleNotesUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.filters.notes = event.target.value
        this.props.filters.notesUser = userStore.username == null ? "" : userStore.username
    }
    removeNotes = () => {
        this.props.filters.notesUser = ""
        this.props.filters.notes = ""
    }

    private handleOtherValuesForSaleOrTrade = () => {
        const filters = this.props.filters
        if (!(filters.forSale || filters.forTrade)) {
            filters.forSaleInCountry = undefined
        }
        filters.notForSale = false
    }

    constructor(props: DecksSearchDrawerProps) {
        super(props)
        makeObservable(this)
        deckSearchDrawerStore.updateValues(props.filters)
    }

    componentDidMount() {
        deckSearchDrawerStore.updateValues(this.props.filters)
    }

    componentDidUpdate(prevProps: Readonly<DecksSearchDrawerProps>, prevState: Readonly<{}>, snapshot?: any) {
        if (!Utils.equals(prevProps.filters, this.props.filters)) {
            deckSearchDrawerStore.updateValues(this.props.filters)
        }
    }

    @computed
    get myDecks(): boolean {
        return this.props.filters.owner === userStore.username
    }

    render() {
        const {
            title,
            titleQl,
            myFavorites,
            handleTitleUpdate,
            handleMyDecksUpdate,
            handleMyFavoritesUpdate,
            owner,
            forSale,
            forTrade,
            forSaleInCountry,
            notes,
            notesUser,
            teamDecks,
            withOwners,
            handleMyPreviouslyOwnedDecksUpdate,
            tags,
            notTags,
            owners,
            tournamentIds
        } = this.props.filters

        const analyze = this.props.location.pathname.includes(Routes.collectionStats)

        let myCountry: string | undefined
        if (!!(userStore.country
            && (forSale || forTrade))) {
            myCountry = userStore.country
        }
        const inMyCountryChecked = myCountry != null && forSaleInCountry === myCountry
        const showLoginForCountry = !myCountry && (forSale || forTrade)
        const showMyDecks = userStore.loggedIn()
        const showDecksOwner = !!owner && owner !== userStore.username

        const count = deckStore.decksCount?.count
        const analyzedCount = deckStore.collectionStats?.deckCount

        return (
            <KeyDrawer version={analyze ? KeyDrawerVersion.ANALYSIS : KeyDrawerVersion.DECK}>
                <form onSubmit={this.search}>
                    <List dense={true}>
                        <ListItem>
                            <TextField
                                label={titleQl ? "Exact Match Deck Name" : "Deck Name"}
                                onChange={handleTitleUpdate}
                                value={title}
                                fullWidth={!screenStore.screenSizeXs()}
                            />
                            {userStore.patron && (
                                <FormControlLabel
                                    style={{marginLeft: spacing(1)}}
                                    control={
                                        <Checkbox
                                            checked={titleQl}
                                            onChange={(event) => {
                                                this.props.filters.titleQl = event.target.checked
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label="EM"
                                />
                            )}
                            <div style={{flexGrow: 1}}/>
                            {screenStore.screenSizeXs() ? (
                                <IconButton onClick={keyDrawerStore.close}>
                                    <Close/>
                                </IconButton>
                            ) : null}
                        </ListItem>
                        <ListItem style={{marginTop: spacing(2)}}>
                            <ExpansionSelectOrExclude selectedExpansions={deckSearchDrawerStore.selectedExpansions}/>
                        </ListItem>
                        <ListItem style={{marginTop: spacing(1)}}>
                            <div>
                                <Typography variant={"subtitle1"} color={"textSecondary"}>Options</Typography>
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
                                        style={{width: 136}}
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
                                                <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>
                                                    For Sale
                                                </Typography>
                                            </div>
                                        )}
                                        style={{width: 136}}
                                    />
                                    {showDecksOwner && (
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <UserLink username={owner}/>
                                            <IconButton
                                                style={{marginLeft: spacing(1)}}
                                                size={"small"}
                                                onClick={() => this.props.filters.owner = ""}
                                            >
                                                <Close fontSize={"small"}/>
                                            </IconButton>
                                        </div>
                                    )}
                                    {tournamentIds.length > 0 && (
                                        <>
                                            {tournamentIds.map(id => (
                                                <Box display={"flex"} key={id} mt={2}>
                                                    <LinkButton href={Routes.tournamentPage(id)}>Tournament</LinkButton>
                                                    <IconButton
                                                        style={{marginLeft: spacing(1)}}
                                                        size={"small"}
                                                        onClick={() => {
                                                            ArrayUtils.removeFromArray(tournamentIds, id)
                                                        }}
                                                    >
                                                        <Close fontSize={"small"}/>
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </>
                                    )}
                                </FormGroup>
                            </div>
                        </ListItem>
                        <ListItem style={{marginTop: spacing(1)}}>
                            <div>
                                <SearchDrawerExpansionPanel
                                    initiallyOpen={
                                        inMyCountryChecked
                                        || forTrade || myFavorites || teamDecks
                                        || withOwners || owners.length > 0
                                    }
                                    title={"Extra Options"}
                                >
                                    <div style={{display: "flex", flexWrap: "wrap", flexGrow: 1}}>
                                        <div style={{display: "flex"}}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={inMyCountryChecked}
                                                        onChange={(event) => this.props.filters.forSaleInCountry = event.target.checked ? myCountry : undefined}
                                                        disabled={!myCountry}
                                                    />
                                                }
                                                label={<Typography variant={"body2"}>In My Country</Typography>}
                                                style={{width: 136}}
                                            />
                                        </div>
                                        {showLoginForCountry ? (
                                            <div style={{display: "flex"}}>
                                                <KeyLink
                                                    to={userStore.loggedIn() ? MyDokSubPaths.profile : Routes.registration}>
                                                    <Typography variant={"body2"}>
                                                        Select your country
                                                    </Typography>
                                                </KeyLink>
                                                <Typography variant={"body2"} style={{marginLeft: spacing(1)}}>
                                                    to filter decks by country
                                                </Typography>
                                            </div>
                                        ) : null}
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
                                                    <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For
                                                        Trade</Typography>
                                                </div>
                                            )}
                                            style={{width: 136}}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={myFavorites}
                                                    onChange={handleMyFavoritesUpdate}
                                                    disabled={!showMyDecks}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>My Favorites</Typography>}
                                            style={{width: 136}}
                                        />
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
                                                style={{width: 136}}
                                            />
                                        )}
                                        {userStore.patronLevelEqualToOrHigher(PatreonRewardsTier.SUPPORT_SOPHISTICATION) && (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.props.filters.withOwners}
                                                        onChange={(event) => this.props.filters.withOwners = event.target.checked}
                                                    />
                                                }
                                                label={<Typography variant={"body2"}>With Owners</Typography>}
                                                style={{width: 136}}
                                            />
                                        )}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.previousOwner === userStore.username}
                                                    onChange={handleMyPreviouslyOwnedDecksUpdate}
                                                    disabled={!showMyDecks}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>Previously Owned</Typography>}
                                            style={{width: 136}}
                                        />
                                        <FormControlLabel
                                            disabled={this.props.filters.forSale || this.props.filters.forTrade
                                                || (this.props.filters.owner !== userStore.username && !this.props.filters.teamDecks)}
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.notForSale}
                                                    onChange={(event) => this.updateNotForSale(event.target.checked)}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>Not For Sale</Typography>}
                                            style={{width: 136}}
                                        />
                                        <Box width={136}>
                                            <TextField
                                                disabled={!this.props.filters.forSale}
                                                size={"small"}
                                                id="listed-within"
                                                select={true}
                                                fullWidth={true}
                                                label="Listed Within"
                                                value={this.props.filters.listedWithinDays ?? ""}
                                                onChange={this.props.filters.handleListedWithinDaysUpdate}
                                            >
                                                <MenuItem value={""}>
                                                    Any
                                                </MenuItem>
                                                <MenuItem value={1}>
                                                    Today
                                                </MenuItem>
                                                <MenuItem value={2}>
                                                    Two Days
                                                </MenuItem>
                                                <MenuItem value={3}>
                                                    Three Days
                                                </MenuItem>
                                                <MenuItem value={7}>
                                                    One Week
                                                </MenuItem>
                                                <MenuItem value={30}>
                                                    Thirty Days
                                                </MenuItem>
                                            </TextField>
                                        </Box>
                                    </div>
                                    {owners.length > 0 && (
                                        <div>
                                            <Typography variant={"subtitle2"} style={{marginTop: spacing(1)}}>
                                                Decks owned by
                                            </Typography>
                                            <Box display={"flex"} flexWrap={"wrap"}>
                                                {owners.map(ownedBy => (
                                                    <Box
                                                        key={ownedBy}
                                                        display={"flex"}
                                                        alignItems={"center"}
                                                        style={{margin: spacing(1, 1, 0, 0)}}
                                                    >
                                                        <UserLink username={ownedBy}/>
                                                        <IconButton
                                                            style={{marginLeft: spacing(1)}}
                                                            size={"small"}
                                                            onClick={() => this.props.filters.owners = this.props.filters.owners.filter(toFilter => toFilter !== ownedBy)}
                                                        >
                                                            <Close fontSize={"small"}/>
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </div>
                                    )}
                                    <UserSearchSuggest
                                        usernames={owners}
                                        placeholderText={"Search decks owned by..."}
                                    />
                                </SearchDrawerExpansionPanel>
                                <DeckSearchDrawerTagsAndNotes
                                    initiallyOpen={notesUser.length > 0 || notes.length > 0 || !!keyLocalStorage.genericStorage.viewNotes}
                                    viewNotes={!!keyLocalStorage.genericStorage.viewNotes}
                                    viewTags={!!keyLocalStorage.genericStorage.viewTags}
                                    loggedIn={userStore.loggedIn()}
                                    updateViewNotes={keyLocalStorage.toggleViewNotes}
                                    updateViewTags={keyLocalStorage.toggleViewTags}
                                    selectedTagIds={tags}
                                    updateTagIds={this.handleTagsUpdate}
                                    selectedNotTagIds={notTags}
                                    updateNotTagIds={this.handleNotTagsUpdate}
                                    notes={notes}
                                    notesUser={notesUser}
                                    handleNotesUpdate={this.handleNotesUpdate}
                                    removeNotes={this.removeNotes}
                                />
                                <SearchDrawerExpansionPanel
                                    initiallyOpen={deckSearchDrawerStore.selectedHouses.anySelected()}
                                    title={"Houses"}>
                                    <HouseSelectOrExclude selectedHouses={deckSearchDrawerStore.selectedHouses}
                                                          excludeTitle={true}/>
                                </SearchDrawerExpansionPanel>
                                <DeckSearchDrawerConstraints
                                    store={deckSearchDrawerStore.constraintsStore}
                                />
                                <DeckSearchDrawerCards
                                    filters={this.props.filters}
                                />
                                <Divider style={{marginBottom: spacing(1)}}/>
                            </div>
                        </ListItem>
                        <ListItem>
                            <DeckSortSelect store={deckSearchDrawerStore.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView hasSort={this.props.filters}/>
                            </div>
                            {!screenStore.smallDeckView() && !analyze && (
                                <DownloadDeckResults filters={this.props.filters}/>
                            )}
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
                                    noDisplay={
                                        !userStore.deckNotificationsAllowed
                                        || (!this.props.filters.forSale && !this.props.filters.forTrade)
                                        || this.props.filters.owner === userStore.username
                                    }
                                    filters={this.makeFilters}
                                    houses={deckSearchDrawerStore.selectedHouses}
                                    constraints={deckSearchDrawerStore.constraintsStore}
                                />
                                {analyze ? (
                                    <KeyButton
                                        onClick={() => this.search(undefined, true)}
                                        variant={"contained"}
                                        color={"primary"}
                                        loading={deckStore.calculatingStats}
                                        disabled={deckStore.searchingForDecks || deckStore.calculatingStats}
                                        style={{marginRight: spacing(2)}}
                                    >
                                        Analyze
                                    </KeyButton>
                                ) : (
                                    <KeyButton
                                        variant={"contained"}
                                        color={"secondary"}
                                        type={"submit"}
                                        loading={deckStore.searchingForDecks}
                                        disabled={deckStore.searchingForDecks || deckStore.calculatingStats}
                                    >
                                        Search
                                    </KeyButton>
                                )}
                            </div>
                        </ListItem>
                        {count != null && !analyze && (
                            <ListItem>
                                <Typography variant={"subtitle2"} style={{marginBottom: spacing(1)}}>
                                    {`You found ${count}${count === 1000 || count === 10000 ? "+ " : ""} decks`}
                                </Typography>
                            </ListItem>
                        )}
                        {analyzedCount && analyze && (
                            <ListItem>
                                <Typography variant={"subtitle2"} style={{marginBottom: spacing(1)}}>
                                    {analyzedCount == keyLocalStorage.findAnalyzeCount()
                                        ? `You analyzed the first ${analyzedCount} decks found` : `You analyzed ${analyzedCount} decks`}
                                </Typography>
                            </ListItem>
                        )}
                        {deckStore.countingDecks ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>Counting ...</Typography>
                            </ListItem>
                        ) : null}
                        <ListItem>
                            <Box display={"flex"} alignItems={"center"}>
                                {userStore.loggedIn() && (
                                    <Tooltip title={userStore.patron ? "" : "Become a patron to analyze decks!"}>
                                        <div>
                                            <LinkButton
                                                size={"small"}
                                                variant={"outlined"}
                                                href={analyze ? Routes.deckSearch(this.props.filters) : Routes.analyzeDeckSearch(this.props.filters)}
                                                disabled={!userStore.patron}
                                                style={{marginRight: spacing(2)}}
                                            >
                                                {analyze ? "Search" : "Analyze"}
                                            </LinkButton>
                                        </div>
                                    </Tooltip>
                                )}
                                {analyze ? (
                                    <Tooltip title={"Max decks to analyze"}>
                                        <ToggleButtonGroup
                                            value={keyLocalStorage.findAnalyzeCount()}
                                            exclusive={true}
                                            onChange={(event, size) => {
                                                keyLocalStorage.updateGenericStorage({analyzeCount: size})
                                                this.search(undefined, true)
                                            }}
                                            size={"small"}
                                        >
                                            <ToggleButton value={100}>
                                                100
                                            </ToggleButton>
                                            <ToggleButton value={500}>
                                                500
                                            </ToggleButton>
                                            <ToggleButton value={1000}>
                                                1000
                                            </ToggleButton>
                                            {userStore.patronLevelEqualToOrHigher(PatreonRewardsTier.SUPPORT_SOPHISTICATION) && (
                                                <ToggleButton value={2500}>
                                                    2500
                                                </ToggleButton>
                                            )}
                                        </ToggleButtonGroup>
                                    </Tooltip>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </Box>
                        </ListItem>
                        {userStore.patron && (
                            <ListItem>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={keyLocalStorage.genericStorage.buildAllianceDeck}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                keyLocalStorage.updateGenericStorage({
                                                    buildAllianceDeck: event.target.checked
                                                })
                                            }}
                                        />
                                    }
                                    label={"Build Alliance Deck"}
                                />
                            </ListItem>
                        )}
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}
