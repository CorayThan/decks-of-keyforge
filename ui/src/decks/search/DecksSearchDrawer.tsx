import { FormGroup, FormLabel, IconButton } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import { observer } from "mobx-react"
import * as React from "react"
import { CardSearchSuggest } from "../../cards/CardSearchSuggest"
import { KeyDrawer } from "../../components/KeyDrawer"
import { SortDirectionController, SortDirectionView } from "../../components/SortDirectionView"
import { spacing } from "../../config/MuiConfig"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { HouseSelect, SelectedHouses } from "../../houses/HouseSelect"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { ScreenStore } from "../../ui/ScreenStore"
import { UserStore } from "../../user/UserStore"
import { DeckStore } from "../DeckStore"
import { DeckSortSelect, DeckSortSelectStore } from "../selects/DeckSortSelect"
import { ConstraintDropdowns, FiltersConstraintsStore } from "./ConstraintDropdowns"
import { DeckFiltersInstance } from "./DeckFilters"

@observer
export class DecksSearchDrawer extends React.Component {

    deckStore = DeckStore.instance
    filters = DeckFiltersInstance
    selectedHouses = new SelectedHouses()
    selectedSortStore = new DeckSortSelectStore()
    sortDirectionController = new SortDirectionController()
    constraintsStore = new FiltersConstraintsStore()

    componentDidMount() {
        this.deckStore.reset()
        this.clearSearch()
        this.search()
    }

    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        this.filters.houses = this.selectedHouses.toArray()
        this.filters.sort = this.selectedSortStore.toEnumValue()
        this.filters.sortDirection = this.sortDirectionController.direction
        this.filters.constraints = this.constraintsStore.cleanConstraints()
        this.deckStore.searchDecks(this.filters.cleaned())
    }

    clearSearch = () => {
        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        this.sortDirectionController.reset()
        this.filters.reset()
        this.constraintsStore.reset()
    }

    render() {
        const {title, containsMaverick, myDecks, handleTitleUpdate, handleContainsMaverickUpdate, handleMyDecksUpdate, cards} = this.filters
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
                        <ListItem>
                            <FormGroup row={true}>
                                {UserStore.instance.loggedIn() ? (
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
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={containsMaverick}
                                            onChange={handleContainsMaverickUpdate}
                                        />
                                    }
                                    label={"Has maverick"}
                                />
                            </FormGroup>
                        </ListItem>
                        <ListItem>
                            <ConstraintDropdowns
                                store={this.constraintsStore}
                                properties={[
                                    "expectedAmber",
                                    "amberControl",
                                    "creatureControl",
                                    "artifactControl"
                                ]}
                            />
                        </ListItem>
                        <ListItem>
                            <div>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <FormLabel style={{marginRight: spacing(1)}}>Cards</FormLabel>
                                    <IconButton onClick={() => cards.push({cardName: "", quantity: 1})}>
                                        <AddIcon fontSize={"small"}/>
                                    </IconButton>
                                </div>
                                {cards.map((card, idx) => (
                                    <div style={{display: "flex", marginBottom: spacing(1)}} key={card.cardName}>
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
                            </div>
                        </ListItem>
                        <ListItem>
                            <DeckSortSelect store={this.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView sortDirectionController={this.sortDirectionController}/>
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
                                >
                                    Search
                                </KeyButton>
                            </div>
                        </ListItem>
                        {this.deckStore.deckPage ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>You found {this.deckStore.deckPage.count} decks</Typography>
                            </ListItem>
                        ) : null}
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}