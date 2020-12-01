import { Box, Checkbox, FormControlLabel, Paper, TextField, Tooltip, Typography } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import { ResponsivePie } from "@nivo/pie"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { VictoryBar, VictoryChart, VictoryTooltip } from "victory"
import { cardStore } from "../../cards/CardStore"
import { CardAsLine } from "../../cards/views/CardAsLine"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { ExpansionIcon } from "../../expansions/ExpansionIcon"
import { expansionInfoMap } from "../../expansions/Expansions"
import { BarData } from "../../generated-src/BarData"
import { CardCounts } from "../../generated-src/CardCounts"
import { CollectionStats } from "../../generated-src/CollectionStats"
import { Expansion } from "../../generated-src/Expansion"
import { HouseCount } from "../../generated-src/HouseCount"
import { ThreeHousesCount } from "../../generated-src/ThreeHousesCount"
import { SortableTable, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { HouseBanner } from "../../houses/HouseBanner"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { Loader } from "../../mui-restyled/Loader"
import { PatronButton } from "../../thirdpartysites/patreon/PatronButton"
import { screenStore } from "../../ui/ScreenStore"
import { LoginPop } from "../../user/LoginPop"
import { userStore } from "../../user/UserStore"

export interface CollectionStatsViewProps {
    stats: CollectionStats
}

@observer
export class CollectionStatsView extends React.Component<CollectionStatsViewProps> {

    render() {

        if (!cardStore.cardsLoaded) {
            return null
        }

        if (userStore.loginInProgress) {
            return <Loader/>
        }

        if (!userStore.patron) {
            return (
                <Box maxWidth={600} mt={2}>
                    <Paper style={{padding: spacing(2)}}>
                        <Typography style={{marginBottom: spacing(2)}}>
                            You must be logged in and a patron to analyze collections. Please consider becoming a patron to support the
                            the site!
                        </Typography>
                        <Box display={"flex"}>
                            {!userStore.loggedIn() && <LoginPop style={{marginRight: spacing(2)}}/>}
                            <PatronButton/>
                        </Box>
                    </Paper>
                </Box>
            )
        }

        const {stats} = this.props
        const {houseCounts, houseDeckCounts, cardCounts, sasValues, expansionCounts} = stats

        if (stats.deckCount === 0) {
            return <Typography variant={"subtitle1"}>Sorry, no decks matched your search!</Typography>
        }

        if (screenStore.screenWidth > 1820) {
            return (
                <Box m={4} display={"flex"}>
                    <Box display={"flex"} width={480} mr={4} flexDirection={"column"}>
                        <HousesGraph houseCounts={houseCounts}/>
                        <Box mt={4}>
                            <ExpansionsGraph expansionCounts={expansionCounts}/>
                        </Box>
                        <Box mt={4}>
                            <SasGraph sasValues={sasValues}/>
                        </Box>
                    </Box>
                    <Box>
                        <HouseCombosGraph houseDeckCounts={houseDeckCounts}/>
                        <CardsGraph cards={cardCounts}/>
                    </Box>
                </Box>
            )
        } else if (screenStore.screenWidth > 1336) {
            return (
                <Box m={4}>
                    <Box display={"flex"} mb={4}>
                        <HousesGraph houseCounts={houseCounts}/>
                        <Box width={440} ml={4}>
                            <SasGraph sasValues={sasValues} height={320}/>
                        </Box>
                    </Box>
                    <HouseCombosGraph houseDeckCounts={houseDeckCounts}/>
                    <CardsGraph cards={cardCounts}/>
                </Box>
            )
        }

        return (
            <Box m={4} style={{width: screenStore.screenWidth - spacing(11)}}>
                <Box width={400} mb={4}>
                    <HousesGraph houseCounts={houseCounts}/>
                    <Box mt={4}>
                        <SasGraph sasValues={sasValues}/>
                    </Box>
                </Box>
                <HouseCombosGraph houseDeckCounts={houseDeckCounts}/>
                <CardsGraph cards={cardCounts}/>
            </Box>
        )
    }
}

const HousesGraph = (props: { houseCounts: HouseCount[] }) => {
    return (
        <Paper style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography style={{marginTop: spacing(1)}} variant={"h5"} color={"primary"}>Houses</Typography>
            <Box width={440} height={280}>
                <ResponsivePie
                    innerRadius={0.4}
                    padAngle={4}
                    cornerRadius={4}
                    margin={{top: 32, right: 72, bottom: 32, left: 72}}
                    colors={[
                        "#ee242a",
                        "#d71d62",
                        "#20acda",
                        "#79b33d",
                        "#2666d4",
                        "#1bafab",
                        "#6c67c9",
                        "#f6a221",
                        "#d64623",
                    ]}
                    data={props.houseCounts.map(house => {
                        const label = house.house == "StarAlliance" ? "Star" : house.house
                        return {
                            id: label,
                            label,
                            value: house.count
                        }
                    })}
                    theme={themeStore.nivoTheme}
                />
            </Box>
        </Paper>
    )
}

const ExpansionsGraph = (props: { expansionCounts: BarData[] }) => {
    return (
        <Paper style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography style={{marginTop: spacing(1)}} variant={"h5"} color={"primary"}>Expansions</Typography>
            <Box width={440} height={280}>
                <ResponsivePie
                    innerRadius={0.4}
                    padAngle={4}
                    cornerRadius={4}
                    margin={{top: 32, right: 72, bottom: 32, left: 72}}
                    data={props.expansionCounts.map(expansion => {
                        return {
                            id: expansionInfoMap.get(expansion.x as Expansion)!.abbreviation,
                            label: expansionInfoMap.get(expansion.x as Expansion)!.name,
                            value: expansion.y
                        }
                    })}
                    theme={themeStore.nivoTheme}
                />
            </Box>
        </Paper>
    )
}

const SasGraph = (props: { sasValues: BarData[], height?: number }) => {
    if (props.sasValues.length < 2) {
        return null
    }
    return (
        <Paper style={{display: "flex", flexDirection: "column", alignItems: "center", height: props.height}}>
            <Typography style={{marginTop: spacing(1)}} variant={"h5"} color={"primary"}>SAS Values</Typography>
            <VictoryChart
                theme={themeStore.victoryTheme}
                domainPadding={spacing(1)}
                width={480}
                height={296}
            >
                <VictoryBar
                    labelComponent={<VictoryTooltip/>}
                    data={props.sasValues.map(data => ({
                        x: data.x,
                        y: data.y,
                        label: `${data.y} decks at ${data.x} SAS`
                    }))}
                    style={{
                        data: {
                            fill: themeStore.darkMode ? blue.A100 : blue["500"]
                        },
                    }}
                />
            </VictoryChart>
        </Paper>
    )
}

const HouseCombosGraph = (props: { houseDeckCounts: ThreeHousesCount[] }) => {
    return (
        <Paper
            style={{maxHeight: 800, overflowY: "auto", overflowX: "auto", marginBottom: spacing(4)}}
        >
            <Box p={2}>
                <Typography variant={"h5"} color={"primary"}>House Combinations</Typography>
            </Box>
            <SortableTable
                headers={housesInDecksheaders}
                data={props.houseDeckCounts}
                defaultSort={"count"}
                noOverflow={true}
            />
        </Paper>
    )
}

@observer
class CardsGraph extends React.Component<{ cards: CardCounts[] }> {

    @observable
    cardFilter = ""

    @observable
    unownedCardsOnly = false

    @observable
    displayAllCards = false

    render() {

        let filteredCardCounts = this.props.cards
        if (this.unownedCardsOnly) {
            const cardsByName: Map<string, CardCounts> = new Map()
            filteredCardCounts.forEach(card => cardsByName.set(card.name, card))
            filteredCardCounts = cardStore.cardNames
                .filter(cardName => cardsByName.get(cardName) == null)
                .map(cardName => {
                    return {
                        name: cardName,
                        count: 0,
                        anomaly: 0,
                        legacy: 0,
                        mav: 0,
                        mostInDeck: 0,
                        setCounts: []
                    }
                })
        }
        if (this.cardFilter.trim().length > 2) {
            filteredCardCounts = filteredCardCounts.filter(card => Utils.cardNameIncludes(card.name, this.cardFilter))
        }

        return (
            <Paper
                style={{maxHeight: 800, overflowY: "auto", overflowX: "auto"}}
            >
                <Box p={2} display={"flex"} alignItems={"center"}>
                    <Typography variant={"h5"} color={"primary"}>Card Counts</Typography>
                    <Box flexGrow={1} mr={2}/>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.displayAllCards}
                                onChange={() => this.displayAllCards = !this.displayAllCards}
                            />
                        }
                        label="Display All"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.unownedCardsOnly}
                                onChange={() => this.unownedCardsOnly = !this.unownedCardsOnly}
                            />
                        }
                        label="Unowned"
                    />
                    {!screenStore.screenSizeXs() && (
                        <TextField
                            size={"small"}
                            variant={"outlined"}
                            label={"Filter"}
                            value={this.cardFilter}
                            onChange={event => this.cardFilter = event.target.value}
                        />
                    )}
                </Box>
                <SortableTable
                    headers={cardCountHeaders}
                    data={filteredCardCounts}
                    defaultSort={"count"}
                    noOverflow={true}
                    limit={this.displayAllCards ? undefined : 16}
                />
            </Paper>
        )
    }
}

const cardCountHeaders: SortableTableHeaderInfo<CardCounts>[] = [
    {
        property: "name",
        title: "Card Name",
        sortable: true,

        transform: (data) => <CardAsLine card={{cardTitle: data.name, legacy: data.legacy > 0, maverick: data.mav > 0, anomaly: data.anomaly > 0}}/>
    },
    {property: "count", title: "Count", sortable: true},
    {property: "mostInDeck", title: "In Deck", sortable: true},
    {property: "mav", title: "Mavs", sortable: true},
    {
        property: "setCounts",
        title: "Sets",
        sortable: false,
        transform: (data) => (
            <Box display={"grid"} gridGap={spacing(1)} gridAutoFlow={"column"} justifyContent={"start"}>
                {data.setCounts.map(setCount => (
                    <Tooltip
                        key={setCount.set}
                        title={(
                            <div>
                                <Typography variant={"body2"} style={{marginBottom: spacing(1)}}>
                                    Count in set: {setCount.count}
                                </Typography>
                                <Typography variant={"body2"}>
                                    High SAS deck: {setCount.highSas?.name}
                                </Typography>
                            </div>
                        )}
                    >
                        <div>
                            <ExpansionIcon expansion={setCount.set}/>
                        </div>
                    </Tooltip>
                ))}
            </Box>
        )
    },
    {
        property: "highSas",
        title: "High SAS",
        sortable: true,
        sortFunction: (data) => {
            return data.highSas?.sas
        },
        transform: (data) => {
            const deck = data.highSas
            if (deck == null) {
                return ""
            }
            return (
                <Box display={"flex"}>
                    <Typography variant={"body2"}>{deck.sas} SAS</Typography>
                    <Box width={240} ml={2}>
                        <KeyLink
                            to={Routes.deckPage(deck.keyforgeId)}
                            newWindow={true}
                        >
                            {deck.name}
                        </KeyLink>
                    </Box>
                </Box>
            )
        }
    },
]


const housesInDecksheaders: SortableTableHeaderInfo<ThreeHousesCount>[] = [
    {
        property: "houses",
        title: "Houses",
        sortable: true,

        transform: (data) => <HouseBanner houses={data.houses} size={36} style={{width: 140}}/>
    },
    {property: "count", title: "Count", sortable: true},
    {property: "averageSas", title: "Average SAS", sortable: true},
    {
        property: "highSas",
        title: "High SAS",
        sortable: true,
        sortFunction: (data) => {
            return data.highSas?.sas
        },
        transform: (data) => {
            const deck = data.highSas
            if (deck == null) {
                return ""
            }
            return (
                <Box display={"flex"}>
                    <Typography variant={"body2"}>{deck.sas} SAS</Typography>
                    <Box width={240} ml={2}>
                        <KeyLink
                            to={Routes.deckPage(deck.keyforgeId)}
                            newWindow={true}
                        >
                            {deck.name}
                        </KeyLink>
                    </Box>
                </Box>
            )
        }
    },
]
