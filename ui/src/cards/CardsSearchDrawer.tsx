import { FormControlLabel, IconButton, Switch, Typography } from "@material-ui/core"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import { Close } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyDrawer, keyDrawerStore } from "../components/KeyDrawer"
import { SortDirectionView } from "../components/SortDirectionView"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { ExpansionSelector, SelectedExpansion } from "../expansions/ExpansionSelector"
import { HouseSelect, SelectedHouses } from "../houses/HouseSelect"
import { KeyButton } from "../mui-restyled/KeyButton"
import { screenStore } from "../ui/ScreenStore"
import { CardFilters } from "./CardFilters"
import { cardStore } from "./CardStore"
import { AmberSelect, SelectedAmbers } from "./selects/AmberSelect"
import { ArmorSelect, SelectedArmors } from "./selects/ArmorSelect"
import { CardRatingSelect, SelectedCardRatings } from "./selects/CardRatingSelect"
import { CardSortSelect, CardSortSelectStore } from "./selects/CardSortSelect"
import { CardTypeSelect, SelectedCardTypes } from "./selects/CardTypeSelect"
import { PowerSelect, SelectedPowers } from "./selects/PowerSelect"
import { RaritySelect, SelectedRarities } from "./selects/RaritySelect"

@observer
export class CardsSearchDrawer extends React.Component {

    cardStore = cardStore
    filters = new CardFilters()
    selectedHouses = new SelectedHouses()
    selectedCardTypes = new SelectedCardTypes()
    selectedRarities = new SelectedRarities()
    selectedPowers = new SelectedPowers()
    selectedAmbers = new SelectedAmbers()
    selectedRatings = new SelectedCardRatings()
    selectedArmors = new SelectedArmors()
    selectedSortStore = new CardSortSelectStore()
    selectedExpansion = new SelectedExpansion()

    componentDidMount() {
        this.cardStore.reset()
        this.search()
    }

    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        this.filters.houses = this.selectedHouses.toArray()
        this.filters.types = this.selectedCardTypes.selectedValues
        this.filters.rarities = this.selectedRarities.toArray()
        this.filters.ratings = this.selectedRatings.toArray()
        this.filters.powers = this.selectedPowers.toArray()
        this.filters.ambers = this.selectedAmbers.toArray()
        this.filters.armors = this.selectedArmors.toArray()
        this.filters.sort = this.selectedSortStore.toEnumValue()
        this.filters.expansion = this.selectedExpansion.expansionNumber()
        this.cardStore.searchCards(this.filters)
        keyDrawerStore.closeIfSmall()
    }

    clearSearch = () => {
        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        this.filters.reset()
        this.selectedCardTypes.reset()
        this.selectedRarities.reset()
        this.selectedRatings.reset()
        this.selectedPowers.reset()
        this.selectedAmbers.reset()
        this.selectedArmors.reset()
        this.selectedExpansion.reset()
    }

    render() {
        const {title, description, handleTitleUpdate, handleDescriptionUpdate} = this.filters
        return (
            <KeyDrawer>
                <form onSubmit={this.search}>
                    <List dense={true}>
                        <ListItem>
                            <TextField
                                label={"Card Name"}
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
                            <TextField
                                label={"Card Description"}
                                onChange={handleDescriptionUpdate}
                                value={description}
                                fullWidth={true}
                            />
                        </ListItem>
                        <ListItem>
                            <HouseSelect selectedHouses={this.selectedHouses}/>
                        </ListItem>
                        <ListItem style={{display: "flex", flexWrap: "wrap", marginTop: 0, paddingTop: 0}}>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><CardTypeSelect selectedCardTypes={this.selectedCardTypes}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><RaritySelect selectedRarities={this.selectedRarities}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><CardRatingSelect selectedRatings={this.selectedRatings}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><AmberSelect selectedAmbers={this.selectedAmbers}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><PowerSelect selectedPowers={this.selectedPowers}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><ArmorSelect selectedArmors={this.selectedArmors}/></div>
                        </ListItem>
                        <ListItem>
                            <ExpansionSelector store={this.selectedExpansion} small={false} displayNoneOption={true} style={{marginRight: spacing(2)}}/>
                            <CardSortSelect store={this.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView hasSort={this.filters}/>
                            </div>
                        </ListItem>
                        <ListItem>
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
                                loading={this.cardStore.searchingForCards}
                                disabled={this.cardStore.searchingForCards}
                            >
                                Search
                            </KeyButton>
                        </ListItem>
                        {this.cardStore.cards && !this.cardStore.searchingForCards ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>You found {this.cardStore.cards.length} cards</Typography>
                            </ListItem>
                        ) : null}
                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={keyLocalStorage.showFullCardView}
                                        onChange={keyLocalStorage.toggleFullCardView}
                                    />
                                }
                                label={"Full card view"}
                            />
                        </ListItem>
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}