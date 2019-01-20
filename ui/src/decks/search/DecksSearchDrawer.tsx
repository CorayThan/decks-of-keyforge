import { FormGroup, IconButton } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { Close } from "@material-ui/icons"
import Delete from "@material-ui/icons/Delete"
import * as History from "history"
import { observer } from "mobx-react"
import * as React from "react"
import { CardSearchSuggest } from "../../cards/CardSearchSuggest"
import { KeyDrawer, KeyDrawerStore } from "../../components/KeyDrawer"
import { SortDirectionView } from "../../components/SortDirectionView"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { HouseSelect, SelectedHouses } from "../../houses/HouseSelect"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { ScreenStore } from "../../ui/ScreenStore"
import { UserStore } from "../../user/UserStore"
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
    filters = this.props.filters
    selectedHouses = new SelectedHouses(this.props.filters.houses)
    selectedSortStore = new DeckSortSelectStore(this.props.filters.sort)
    constraintsStore = new FiltersConstraintsStore(this.props.filters.constraints)

    componentDidMount() {
        this.deckStore.reset()
    }

    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        this.filters.houses = this.selectedHouses.toArray()
        this.filters.sort = this.selectedSortStore.toEnumValue()
        this.filters.constraints = this.constraintsStore.cleanConstraints()
        const cleaned = this.filters.prepareForQueryString()
        this.props.history.push(
            Routes.deckSearch(cleaned)
        )
        KeyDrawerStore.closeIfSmall()
    }

    clearSearch = () => {
        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        this.filters.reset()
        this.constraintsStore.reset()
    }

    render() {
        const {
            title, myDecks, handleTitleUpdate, handleMyDecksUpdate, cards, owner
        } = this.filters

        const showMyDecks = UserStore.instance.loggedIn()
        const showDecksOwner = !!owner
        const optionals = !showMyDecks && !showDecksOwner ? null : (
            <ListItem>
                <FormGroup row={true}>
                    {showMyDecks ? (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={myDecks}
                                    onChange={handleMyDecksUpdate}
                                />
                            }
                            label={"My Decks"}
                        />
                    ) : null}
                    {showDecksOwner ? (
                        <ListItem>
                            <Typography>Owner: {owner}</Typography>
                            <IconButton onClick={() => this.filters.owner = ""}><Delete fontSize={"small"}/></IconButton>
                        </ListItem>
                    ) : null}
                </FormGroup>
            </ListItem>
        )

        return (
            <KeyDrawer>
                <form onSubmit={this.search}>
                    <List dense={true}>
                        <ListItem>
                            <TextField
                                label={"Deck Name"}
                                onChange={handleTitleUpdate}
                                value={title}
                                fullWidth={!ScreenStore.instance.screenSizeXs()}
                            />
                            <div style={{flexGrow: 1}}/>
                            {ScreenStore.instance.screenSizeXs() ? (
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
                                            checked={this.filters.forSale}
                                            onChange={(event) => this.filters.forSale = event.target.checked}
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
                                            checked={this.filters.forTrade}
                                            onChange={(event) => this.filters.forTrade = event.target.checked}
                                        />
                                    }
                                    label={(
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <TradeDeckIcon/>
                                            <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For trade</Typography>
                                        </div>
                                    )}
                                />
                            </FormGroup>
                        </ListItem>
                        {optionals}
                        <ListItem>
                            <ConstraintDropdowns
                                store={this.constraintsStore}
                                properties={[
                                    "synergyRating",
                                    "antisynergyRating",
                                    "expectedAmber",
                                    "amberControl",
                                    "creatureControl",
                                    "artifactControl"
                                ]}
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
                                            style={{width: 56, marginLeft: spacing(2)}}
                                            label={"Copies"}
                                            type={"number"}
                                            value={card.quantity}
                                            onChange={event => card.quantity = Number(event.target.value)}
                                        />
                                    </div>
                                ))}
                                {/*<IconButton onClick={() => cards.push({cardName: "", quantity: 1})}>*/}
                                    {/*<AddIcon fontSize={"small"}/>*/}
                                {/*</IconButton>*/}
                            </div>
                        </ListItem>
                        <ListItem>
                            <DeckSortSelect store={this.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView hasSort={this.filters}/>
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
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}
