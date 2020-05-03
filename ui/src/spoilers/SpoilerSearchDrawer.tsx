import { Checkbox, FormControlLabel, IconButton, Switch, Typography } from "@material-ui/core"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import { Close } from "@material-ui/icons"
import { range } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { KeyDrawer, keyDrawerStore } from "../components/KeyDrawer"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { Utils } from "../config/Utils"
import { CsvDownloadButton } from "../generic/CsvDownloadButton"
import { mmHouses } from "../houses/House"
import { HouseSelect, SelectedHouses } from "../houses/HouseSelect"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyMultiSelect, SelectedValues } from "../mui-restyled/KeyMultiSelect"
import { screenStore } from "../ui/ScreenStore"
import { SpoilerUtils } from "./Spoiler"
import { SpoilerFilters } from "./SpoilerFilters"
import { spoilerStore } from "./SpoilerStore"

@observer
export class SpoilerSearchDrawer extends React.Component {

    filters = new SpoilerFilters()
    selectedHouses = new SelectedHouses()
    selectedCardTypes = new SelectedValues<CardType>()
    selectedRarities = new SelectedValues<Rarity>()
    selectedPowers = new SelectedValues<number>()
    selectedAmbers = new SelectedValues<number>()

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
        this.filters.rarities = this.selectedRarities.selectedValues
        this.filters.powers = this.selectedPowers.selectedValues
        this.filters.ambers = this.selectedAmbers.selectedValues
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
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}>
                                <KeyMultiSelect
                                    name={"Card Type"}
                                    selected={this.selectedCardTypes}
                                    options={Utils.enumValues(CardType) as CardType[]}
                                />
                            </div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}>
                                <KeyMultiSelect
                                    name={"Rarity"}
                                    selected={this.selectedRarities}
                                    options={[
                                        Rarity.Common,
                                        Rarity.Uncommon,
                                        Rarity.Rare,
                                        "Special",
                                    ]}
                                />
                            </div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}>
                                <KeyMultiSelect
                                    name={"Aember"}
                                    selected={this.selectedAmbers}
                                    options={range(0, 5)
                                        .map(amber => amber.toString())}
                                />
                            </div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}>
                                <KeyMultiSelect
                                    name={"Power"}
                                    selected={this.selectedPowers}
                                    options={range(1, 17)
                                        .map(power => power.toString())}
                                />
                            </div>
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
