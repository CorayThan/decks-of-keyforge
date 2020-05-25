import { Checkbox, FormControlLabel, IconButton, Switch, Tooltip, Typography } from "@material-ui/core"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import { Close, Image, ViewList, ViewModule } from "@material-ui/icons"
import { Autocomplete, ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import * as History from "history"
import { range, startCase } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { ChangeEvent } from "react"
import { KeyDrawer, keyDrawerStore } from "../components/KeyDrawer"
import { SortDirectionView } from "../components/SortDirectionView"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { ConstraintDropdowns, FiltersConstraintsStore } from "../decks/search/ConstraintDropdowns"
import { ExpansionSelector, SelectedExpansion } from "../expansions/ExpansionSelector"
import { SynergyTrait, validSynergies, validTraits } from "../extracardinfo/SynergyTrait"
import { CsvDownloadButton } from "../generic/CsvDownloadButton"
import { HouseSelect, SelectedHouses } from "../houses/HouseSelect"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyMultiSelect, SelectedValues } from "../mui-restyled/KeyMultiSelect"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { CardFilters, CardSort } from "./CardFilters"
import { cardStore } from "./CardStore"
import { CardType } from "./CardType"
import { CardUtils } from "./KCard"
import { Rarity } from "./rarity/Rarity"
import { CardSortSelect, CardSortSelectStore } from "./selects/CardSortSelect"
import { PublishDateSelect, SelectedPublishDate } from "./selects/PublishDateSelect"

interface CardsSearchDrawerProps {
    filters: CardFilters
    history: History.History
}

@observer
export class CardsSearchDrawer extends React.Component<CardsSearchDrawerProps> {

    selectedHouses = new SelectedHouses(this.props.filters.houses)
    selectedCardTypes = new SelectedValues<CardType>(this.props.filters.types)
    selectedRarities = new SelectedValues<Rarity>(this.props.filters.rarities)
    selectedPowers = new SelectedValues<number>(this.props.filters.powers)
    selectedAmbers = new SelectedValues<number>(this.props.filters.ambers)
    selectedSortStore = new CardSortSelectStore(this.props.filters.sort)
    selectedExpansion = new SelectedExpansion(this.props.filters.expansion == null ? undefined : [this.props.filters.expansion])
    selectedPublishDate = new SelectedPublishDate(this.props.filters.aercHistoryDate)

    constraintsStore = new FiltersConstraintsStore(this.props.filters.constraints)

    search = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault()
        }
        const {filters} = this.props
        filters.houses = this.selectedHouses.toArray()
        filters.types = this.selectedCardTypes.selectedValues
        filters.rarities = this.selectedRarities.selectedValues
        filters.powers = this.selectedPowers.selectedValues
        filters.ambers = this.selectedAmbers.selectedValues
        filters.sort = this.selectedSortStore.toEnumValue() as CardSort
        filters.expansion = this.selectedExpansion.currentExpansion()
        filters.thisExpansionOnly = this.selectedExpansion.onlyThisExpansion
        filters.aercHistoryDate = this.selectedPublishDate.date
        filters.constraints = this.constraintsStore.cleanConstraints()
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
        this.selectedExpansion.reset()
        this.constraintsStore.reset()
    }

    render() {
        const {filters} = this.props
        const {title, description, handleTitleUpdate, handleDescriptionUpdate} = filters

        const constraintOptions = [
            "amberControl",
            "expectedAmber",
            "artifactControl",
            "creatureControl",
            "efficiency",
            "disruption",
            "creatureProtection",
            "effectivePower",
        ].flatMap(value => [value, `${value}Max`])

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
                            <ConstraintDropdowns
                                store={this.constraintsStore}
                                properties={constraintOptions}
                            />
                        </ListItem>
                        <ListItem>
                            <Autocomplete
                                options={Utils.arrPlus(validTraits, "") as (SynergyTrait | "")[]}
                                value={filters.trait ?? ""}
                                renderInput={(params) => <TextField {...params} label={"Trait"}/>}
                                renderOption={(option) => <Typography noWrap>{startCase(option).replace(" R ", " ??? ")}</Typography>}
                                onChange={(event: ChangeEvent<{}>, newValue: SynergyTrait | "" | null) => {
                                    filters.trait = newValue == "" || newValue == null ? undefined : newValue
                                }}
                                fullWidth={true}
                                size={"small"}
                            />
                        </ListItem>
                        <ListItem>
                            <Autocomplete
                                options={Utils.arrPlus(validSynergies, "") as (SynergyTrait | "")[]}
                                value={filters.synergy ?? ""}
                                renderInput={(params) => <TextField {...params} label={"Synergy"}/>}
                                renderOption={(option) => <Typography noWrap>{startCase(option).replace(" R ", " ??? ")}</Typography>}
                                onChange={(event: ChangeEvent<{}>, newValue: SynergyTrait | "" | null) => {
                                    filters.synergy = newValue == "" || newValue == null ? undefined : newValue
                                }}
                                fullWidth={true}
                                size={"small"}
                            />
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
                                data={cardStore.cards == null ? undefined : CardUtils.arrayToCSV(cardStore.cards)}
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
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={keyLocalStorage.showAllCards}
                                        onChange={keyLocalStorage.toggleShowAllCards}
                                    />
                                }
                                label={"All cards"}
                                style={{marginLeft: spacing(1)}}
                            />
                        </ListItem>
                        {userStore.isAdmin && (
                            <ListItem>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={cardStore.showFutureCardInfo}
                                            onChange={() => cardStore.showFutureCardInfo = !cardStore.showFutureCardInfo}
                                        />
                                    }
                                    label={"Future Card Info"}
                                />
                            </ListItem>
                        )}
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}
