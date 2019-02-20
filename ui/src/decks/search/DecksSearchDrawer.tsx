import { FormGroup, IconButton, Switch } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { Add, Close, Delete } from "@material-ui/icons"
import * as History from "history"
import { computed } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { CardSearchSuggest } from "../../cards/CardSearchSuggest"
import { KeyDrawer, KeyDrawerStore } from "../../components/KeyDrawer"
import { SortDirectionView } from "../../components/SortDirectionView"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { UnregisteredDeckIcon } from "../../generic/icons/UnregisteredDeckIcon"
import { HouseSelect, SelectedHouses } from "../../houses/HouseSelect"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { MessageStore } from "../../ui/MessageStore"
import { screenStore } from "../../ui/ScreenStore"
import { UserStore } from "../../user/UserStore"
import { deckTableViewStore } from "../DeckListView"
import { DeckStore } from "../DeckStore"
import { DeckSortSelect, DeckSortSelectStore } from "../selects/DeckSortSelect"
import { ConstraintDropdowns, FiltersConstraintsStore } from "./ConstraintDropdowns"
import { DeckFilters } from "./DeckFilters"

interface DecksSearchDrawerProps {
    history: History.History
    filters: DeckFilters
}

@observer
export class DecksSearchDrawer extends React.Component<DecksSearchDrawerProps> {

    deckStore = DeckStore.instance
    selectedHouses = new SelectedHouses(this.props.filters.houses)
    selectedSortStore = new DeckSortSelectStore(this.props.filters.sort)
    constraintsStore = new FiltersConstraintsStore(this.props.filters.constraints)

    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        this.props.filters.houses = this.selectedHouses.toArray()
        this.props.filters.sort = this.selectedSortStore.toEnumValue()
        this.props.filters.constraints = this.constraintsStore.cleanConstraints()
        const cleaned = this.props.filters.prepareForQueryString()

        if (!cleaned.forSale && !cleaned.forTrade && !cleaned.myFavorites && !cleaned.owner) {
            // search is broad, so disable bad searches
            if (cleaned.sort === "NAME") {
                MessageStore.instance.setWarningMessage("To use the name sort please check for sale, for trade, my decks, or my favorites.")
                return
            }
        }

        this.props.history.push(
            Routes.deckSearch(cleaned)
        )
        KeyDrawerStore.closeIfSmall()
        deckTableViewStore.reset()
    }

    clearSearch = () => {
        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        this.props.filters.reset()
        this.constraintsStore.reset()
    }

    @computed
    get myDecks(): boolean {
        return this.props.filters.owner === UserStore.instance.username
    }

    render() {
        const {
            title, myFavorites, handleTitleUpdate, handleMyDecksUpdate, handleMyFavoritesUpdate, cards, owner, forSale, forTrade
        } = this.props.filters

        let myCountry: string | undefined
        if (!!(UserStore.instance.country
            && (forSale || forTrade))) {
            myCountry = UserStore.instance.country
        }
        const showLoginForCountry = !myCountry && (forSale || forTrade)
        const showMyDecks = UserStore.instance.loggedIn()
        const showDecksOwner = !!owner && owner !== UserStore.instance.username
        const optionals = !showMyDecks && !showDecksOwner ? null : (
            <>
                {!showDecksOwner && showMyDecks ? (
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.myDecks}
                                    onChange={handleMyDecksUpdate}
                                />
                            }
                            label={"My Decks"}
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
                    </>
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
            "synergyRating",
            "antisynergyRating",
            "sasRating",
            "cardsRating",
            "maverickCount"
        ]

        if (forSale) {
            constraintOptions.unshift("askingPrice")
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
                                <IconButton onClick={() => KeyDrawerStore.open = false}>
                                    <Close/>
                                </IconButton>
                            ) : null}
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
                                            onChange={(event) => this.props.filters.forSale = event.target.checked}
                                        />
                                    }
                                    label={(
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <SellDeckIcon/>
                                            <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For sale</Typography>
                                        </div>
                                    )}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.props.filters.forTrade}
                                            onChange={(event) => this.props.filters.forTrade = event.target.checked}
                                        />
                                    }
                                    label={(
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <TradeDeckIcon style={{minWidth: 18}}/>
                                            <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For trade</Typography>
                                        </div>
                                    )}
                                />
                                {optionals}
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
                                            <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>Include unregistered</Typography>
                                        </div>
                                    )}
                                />
                                {myCountry ? (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.props.filters.forSaleInCountry}
                                                onChange={(event) => this.props.filters.forSaleInCountry = event.target.checked ? myCountry : undefined}
                                            />
                                        }
                                        label={(
                                            <Typography variant={"body2"}>In my country</Typography>
                                        )}
                                    />
                                ) : null}
                                {showLoginForCountry ? (
                                    <div style={{display: "flex"}}>
                                        <KeyLink to={Routes.userProfilePage(UserStore.instance.username)}>
                                            <Typography variant={"body2"}>
                                                Select your country
                                            </Typography>
                                        </KeyLink>
                                        <Typography variant={"body2"} style={{marginLeft: spacing(1)}}>
                                            to filter decks by country
                                        </Typography>
                                    </div>
                                ) : null}
                            </FormGroup>
                        </ListItem>
                        <ListItem>
                            <ConstraintDropdowns
                                store={this.constraintsStore}
                                properties={constraintOptions}
                            />
                        </ListItem>
                        <ListItem>
                            <div>
                                {cards.map((card, idx) => (
                                    <div style={{display: "flex", marginBottom: spacing(1)}} key={idx}>
                                        <CardSearchSuggest
                                            card={card}
                                            style={{marginTop: 12}}
                                        />
                                        <TextField
                                            style={{width: 48, marginLeft: spacing(2)}}
                                            label={"Copies"}
                                            type={"number"}
                                            value={card.quantity}
                                            onChange={event => card.quantity = Number(event.target.value)}
                                        />
                                        {idx === 0 && cards.length < 5 ? (
                                            <IconButton onClick={() => cards.push({cardName: "", quantity: 1})}>
                                                <Add fontSize={"small"}/>
                                            </IconButton>
                                        ) : null}
                                    </div>
                                ))}
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
                                <KeyButton
                                    variant={"contained"}
                                    color={"secondary"}
                                    type={"submit"}
                                    loading={this.deckStore.searchingForDecks}
                                    disabled={this.deckStore.searchingForDecks}
                                >
                                    Search
                                </KeyButton>
                            </div>
                        </ListItem>
                        {this.deckStore.decksCount ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>
                                    You found {this.deckStore.decksCount.count}{this.deckStore.decksCount.count === 1000 ? "+ " : ""} decks
                                </Typography>
                            </ListItem>
                        ) : null}
                        {this.deckStore.countingDecks ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>Counting ...</Typography>
                            </ListItem>
                        ) : null}

                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={keyLocalStorage.showTableView}
                                        onChange={keyLocalStorage.toggleDeckTableView}
                                    />
                                }
                                label={"Table view"}
                            />
                        </ListItem>
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}
