import { Checkbox, FormControlLabel, IconButton, Switch, Tooltip, Typography } from "@material-ui/core"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import { Close, Image, ViewList, ViewModule } from "@material-ui/icons"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import * as History from "history"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyDrawer, keyDrawerStore } from "../components/KeyDrawer"
import { SortDirectionView } from "../components/SortDirectionView"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { ExpansionSelector, SelectedExpansion } from "../expansions/ExpansionSelector"
import { CsvDownloadButton } from "../generic/CsvDownloadButton"
import { HouseSelect, SelectedHouses } from "../houses/HouseSelect"
import { KeyButton } from "../mui-restyled/KeyButton"
import { screenStore } from "../ui/ScreenStore"
import { CardFilters, CardSort } from "./CardFilters"
import { cardStore } from "./CardStore"
import { CardUtils } from "./KCard"
import { AmberSelect, SelectedAmbers } from "./selects/AmberSelect"
import { ArmorSelect, SelectedArmors } from "./selects/ArmorSelect"
import { CardSortSelect, CardSortSelectStore } from "./selects/CardSortSelect"
import { CardTypeSelect, SelectedCardTypes } from "./selects/CardTypeSelect"
import { PowerSelect, SelectedPowers } from "./selects/PowerSelect"
import { PublishDateSelect, SelectedPublishDate } from "./selects/PublishDateSelect"
import { RaritySelect, SelectedRarities } from "./selects/RaritySelect"

interface CardsSearchDrawerProps {
    filters: CardFilters
    history: History.History
}

@observer
export class CardsSearchDrawer extends React.Component<CardsSearchDrawerProps> {

    selectedHouses = new SelectedHouses(this.props.filters.houses)
    selectedCardTypes = new SelectedCardTypes(this.props.filters.types)
    selectedRarities = new SelectedRarities(this.props.filters.rarities)
    selectedPowers = new SelectedPowers(this.props.filters.powers)
    selectedAmbers = new SelectedAmbers(this.props.filters.ambers)
    selectedArmors = new SelectedArmors(this.props.filters.armors)
    selectedSortStore = new CardSortSelectStore(this.props.filters.sort)
    selectedExpansion = new SelectedExpansion(this.props.filters.expansion == null ? undefined : [this.props.filters.expansion])
    selectedPublishDate = new SelectedPublishDate(this.props.filters.aercHistoryDate)

    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        const {filters} = this.props
        filters.houses = this.selectedHouses.toArray()
        filters.types = this.selectedCardTypes.selectedValues
        filters.rarities = this.selectedRarities.toArray()
        filters.powers = this.selectedPowers.toArray()
        filters.ambers = this.selectedAmbers.toArray()
        filters.armors = this.selectedArmors.toArray()
        filters.sort = this.selectedSortStore.toEnumValue() as CardSort
        filters.expansion = this.selectedExpansion.expansionNumber()
        filters.thisExpansionOnly = this.selectedExpansion.onlyThisExpansion
        filters.aercHistoryDate = this.selectedPublishDate.date
        cardStore.searchCards(filters)
        keyDrawerStore.closeIfSmall()
        this.props.history.push(Routes.cardSearch(filters))
    }

    clearSearch = () => {
        const {filters} = this.props
        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        filters.reset()
        this.selectedCardTypes.reset()
        this.selectedRarities.reset()
        this.selectedPowers.reset()
        this.selectedAmbers.reset()
        this.selectedArmors.reset()
        this.selectedExpansion.reset()
    }

    render() {
        const {filters} = this.props
        const {title, description, handleTitleUpdate, handleDescriptionUpdate} = filters
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
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><AmberSelect selectedAmbers={this.selectedAmbers}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><PowerSelect selectedPowers={this.selectedPowers}/></div>
                            <div style={{marginRight: spacing(2), marginTop: spacing(1)}}><ArmorSelect selectedArmors={this.selectedArmors}/></div>
                        </ListItem>
                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.aercHistory}
                                        onChange={() => {
                                            filters.aercHistory = !filters.aercHistory
                                            if (!filters.aercHistory) {
                                                this.selectedPublishDate.reset()
                                            }
                                        }}
                                    />
                                }
                                label={"Past AERC"}
                            />
                            {filters.aercHistory && (
                                <PublishDateSelect selected={this.selectedPublishDate}/>
                            )}
                        </ListItem>
                        <ListItem>
                            <ExpansionSelector
                                store={this.selectedExpansion}
                                small={false}
                                displayNoneOption={true}
                                displayAnomaly={true}
                                includeOnlys={true}
                                style={{marginRight: spacing(2)}}
                            />
                            <CardSortSelect store={this.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView hasSort={filters}/>
                            </div>
                        </ListItem>
                        <ListItem>
                            <CsvDownloadButton
                                data={CardUtils.arrayToCSV(cardStore.cards ?? [])}
                                name={"cards"}
                            />
                            <KeyButton
                                variant={"outlined"}
                                onClick={this.clearSearch}
                                style={{marginRight: spacing(2), marginLeft: spacing(2)}}
                            >
                                Clear
                            </KeyButton>
                            <KeyButton
                                variant={"contained"}
                                color={"secondary"}
                                type={"submit"}
                                loading={cardStore.searchingForCards}
                                disabled={cardStore.searchingForCards}
                            >
                                Search
                            </KeyButton>
                        </ListItem>
                        {cardStore.cards && !cardStore.searchingForCards ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>You found {cardStore.cards.length} cards</Typography>
                            </ListItem>
                        ) : null}
                        <ListItem>
                            <Tooltip title={"View type"}>
                                <ToggleButtonGroup
                                    value={keyLocalStorage.cardListViewType}
                                    exclusive={true}
                                    onChange={(event, viewType) => {
                                        keyLocalStorage.setCardListViewType(viewType)
                                    }}
                                    style={{marginRight: spacing(2)}}
                                    size={"small"}
                                >
                                    <ToggleButton value={"full"}>
                                        <ViewModule/>
                                    </ToggleButton>
                                    <ToggleButton value={"image"}>
                                        <Image/>
                                    </ToggleButton>
                                    <ToggleButton value={"table"}>
                                        <ViewList/>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Tooltip>
                        </ListItem>
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