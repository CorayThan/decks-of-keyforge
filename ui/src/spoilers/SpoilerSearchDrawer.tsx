import { Checkbox, FormControlLabel, IconButton, Switch, Typography } from "@material-ui/core"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import { Close } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { AmberSelect, SelectedAmbers } from "../cards/selects/AmberSelect"
import { ArmorSelect, SelectedArmors } from "../cards/selects/ArmorSelect"
import { CardTypeSelect, SelectedCardTypes } from "../cards/selects/CardTypeSelect"
import { PowerSelect, SelectedPowers } from "../cards/selects/PowerSelect"
import { RaritySelect, SelectedRarities } from "../cards/selects/RaritySelect"
import { KeyDrawer, keyDrawerStore } from "../components/KeyDrawer"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { CsvDownloadButton } from "../generic/CsvDownloadButton"
import { mmHouses } from "../houses/House"
import { HouseSelect, SelectedHouses } from "../houses/HouseSelect"
import { KeyButton } from "../mui-restyled/KeyButton"
import { screenStore } from "../ui/ScreenStore"
import { SpoilerUtils } from "./Spoiler"
import { SpoilerFilters } from "./SpoilerFilters"
import { spoilerStore } from "./SpoilerStore"

@observer
export class SpoilerSearchDrawer extends React.Component {

    filters = new SpoilerFilters()
    selectedHouses = new SelectedHouses()
    selectedCardTypes = new SelectedCardTypes()
    selectedRarities = new SelectedRarities()
    selectedPowers = new SelectedPowers()
    selectedAmbers = new SelectedAmbers()
    selectedArmors = new SelectedArmors()

    componentDidMount() {
        spoilerStore.reset()
        this.search()
    }

    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        this.filters.houses = this.selectedHouses.toArray()
        this.filters.types = this.selectedCardTypes.selectedValues
        this.filters.rarities = this.selectedRarities.toArray()
        this.filters.powers = this.selectedPowers.toArray()
        this.filters.ambers = this.selectedAmbers.toArray()
        this.filters.armors = this.selectedArmors.toArray()
        spoilerStore.searchSpoilers(this.filters)
        keyDrawerStore.closeIfSmall()
    }

    clearSearch = () => {
        this.selectedHouses.reset()
        this.filters.reset()
        this.selectedCardTypes.reset()
        this.selectedRarities.reset()
        this.selectedPowers.reset()
        this.selectedAmbers.reset()
        this.selectedArmors.reset()
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
                            <HouseSelect selectedHouses={this.selectedHouses} options={mmHouses}/>
                        </ListItem>
                        <ListItem style={{display: "flex", flexWrap: "wrap", marginTop: 0, paddingTop: 0}}>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><CardTypeSelect selectedCardTypes={this.selectedCardTypes}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><RaritySelect selectedRarities={this.selectedRarities}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><AmberSelect selectedAmbers={this.selectedAmbers}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><PowerSelect selectedPowers={this.selectedPowers}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><ArmorSelect selectedArmors={this.selectedArmors}/></div>
                        </ListItem>
                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.filters.anomaly}
                                        onChange={() => this.filters.anomaly = !this.filters.anomaly}
                                        color="primary"
                                    />
                                }
                                label="Anomalies Only"
                            />
                        </ListItem>
                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.filters.newCards}
                                        onChange={() => {
                                            this.filters.newCards = !this.filters.newCards
                                            if (!this.filters.newCards) {
                                                this.filters.reprints = true
                                            }
                                        }}
                                        color="primary"
                                    />
                                }
                                label="New Cards"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.filters.reprints}
                                        onChange={() => {
                                            this.filters.reprints = !this.filters.reprints
                                            if (!this.filters.reprints) {
                                                this.filters.newCards = true
                                            }
                                        }}
                                        color="primary"
                                    />
                                }
                                label="Reprints"
                            />
                        </ListItem>
                        <ListItem>
                            <CsvDownloadButton
                                data={SpoilerUtils.arrayToCSV(spoilerStore.spoilers)}
                                name={"spoilers"}
                            />
                            <KeyButton
                                variant={"outlined"}
                                onClick={this.clearSearch}
                                style={{marginLeft: spacing(2), marginRight: spacing(2)}}
                            >
                                Clear
                            </KeyButton>
                            <KeyButton
                                variant={"contained"}
                                color={"secondary"}
                                type={"submit"}
                                loading={spoilerStore.searchingForSpoilers}
                                disabled={spoilerStore.searchingForSpoilers}
                            >
                                Search
                            </KeyButton>
                        </ListItem>
                        {spoilerStore.spoilers && !spoilerStore.searchingForSpoilers ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>You found {spoilerStore.spoilers.length} cards</Typography>
                            </ListItem>
                        ) : null}
                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={keyLocalStorage.showAllCards}
                                        onChange={keyLocalStorage.toggleShowAllCards}
                                    />
                                }
                                label={"All cards"}
                            />
                        </ListItem>
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}
