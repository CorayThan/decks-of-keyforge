import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyDrawer } from "../components/KeyDrawer"
import { SortDirectionController, SortDirectionView } from "../components/SortDirectionView"
import { spacing } from "../config/MuiConfig"
import { HouseSelect, SelectedHouses } from "../houses/HouseSelect"
import { KeyButton } from "../mui-restyled/KeyButton"
import { CardFilters } from "./CardFilters"
import { CardStore } from "./CardStore"
import { AmberSelect, SelectedAmbers } from "./selects/AmberSelect"
import { ArmorSelect, SelectedArmors } from "./selects/ArmorSelect"
import { CardSortSelect, CardSortSelectStore } from "./selects/CardSortSelect"
import { CardTypeSelect, SelectedCardTypes } from "./selects/CardTypeSelect"
import { PowerSelect, SelectedPowers } from "./selects/PowerSelect"
import { RaritySelect, SelectedRarities } from "./selects/RaritySelect"

@observer
export class CardsSearchDrawer extends React.Component {

    cardStore = CardStore.instance
    filters = new CardFilters()
    selectedHouses = new SelectedHouses()
    selectedCardTypes = new SelectedCardTypes()
    selectedRarities = new SelectedRarities()
    selectedPowers = new SelectedPowers()
    selectedAmbers = new SelectedAmbers()
    selectedArmors = new SelectedArmors()
    selectedSortStore = new CardSortSelectStore()
    sortDirectionController = new SortDirectionController()

    componentDidMount() {
        this.cardStore.reset()
    }

    search = () => {
        this.filters.houses = this.selectedHouses.toArray()
        this.filters.types = this.selectedCardTypes.selectedValues
        this.filters.rarities = this.selectedRarities.toArray()
        this.filters.powers = this.selectedPowers.toArray()
        this.filters.ambers = this.selectedAmbers.toArray()
        this.filters.armors = this.selectedArmors.toArray()
        this.filters.sort = this.selectedSortStore.toEnumValue()
        this.filters.sortDirection = this.sortDirectionController.direction
        this.cardStore.searchCards(this.filters)
    }

    render() {
        const {title, description, handleTitleUpdate, handleDescriptionUpdate} = this.filters
        return (
            <KeyDrawer>
                <List style={{marginTop: spacing(1)}}>
                    <ListItem>
                        <TextField
                            label={"Card Name"}
                            onChange={handleTitleUpdate}
                            value={title}
                            fullWidth={true}
                        />
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
                        <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><AmberSelect selectedAmbers={this.selectedAmbers}/></div>
                        <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><PowerSelect selectedPowers={this.selectedPowers}/></div>
                        <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><ArmorSelect selectedArmors={this.selectedArmors}/></div>
                    </ListItem>
                    <ListItem>
                        <CardSortSelect store={this.selectedSortStore}/>
                        <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                            <SortDirectionView sortDirectionController={this.sortDirectionController}/>
                        </div>
                    </ListItem>
                    <ListItem>
                        <KeyButton
                            variant={"contained"}
                            color={"secondary"}
                            onClick={this.search}
                            loading={this.cardStore.searchingForCards}
                        >
                            Search
                        </KeyButton>
                    </ListItem>
                </List>
            </KeyDrawer>
        )
    }
}