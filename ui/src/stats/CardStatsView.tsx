import { Card, Typography } from "@material-ui/core"
import { ResponsiveBar } from "@nivo/bar"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { aercProperties, AercUtils, CardAercData } from "../aerc/AercUtils"
import { CardFilters } from "../cards/CardFilters"
import { cardStore } from "../cards/CardStore"
import { spacing } from "../config/MuiConfig"
import { activeExpansions, BackendExpansion, expansionInfoMap } from "../expansions/Expansions"
import { HouseValue, houseValuesArray } from "../houses/House"
import { Loader } from "../mui-restyled/Loader"
import { uiStore } from "../ui/UiStore"

@observer
export class CardStatsView extends React.Component<{}> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        uiStore.setTopbarValues("Stats of KeyForge", "Stats", "AERC stats")
    }

    render() {

        if (cardStore.allCards.length === 0) {
            return <Loader/>
        }

        const bySetData = activeExpansions.map((expansion: BackendExpansion) => {
            const filters = new CardFilters()
            filters.expansion = expansion
            const cardsForSet = cardStore.searchAndReturnCards(filters)
            const setData = AercUtils.cardsAverageAerc(cardsForSet!) as AercData
            setData.expansion = expansionInfoMap.get(expansion)!.abbreviation
            return setData
        })

        return (
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                <AercBySetBar name={"Card AERC by Expansion"} data={bySetData} indexBy={"expansion"} width={400}/>
                {activeExpansions.map((expansion: BackendExpansion) => {
                    const filters = new CardFilters()
                    filters.expansion = expansion
                    const byHouseData = houseValuesArray
                        .map((house: HouseValue) => {
                            filters.houses = [house.house]
                            const cardsForSetAndHouse = cardStore.searchAndReturnCards(filters)
                            if (cardsForSetAndHouse.length === 0) {
                                return undefined
                            }
                            const setData = AercUtils.cardsAverageAerc(cardsForSetAndHouse!) as AercData
                            setData.house = house.house
                            return setData
                        })
                        .filter(data => data != null)

                    return (
                        <AercBySetBar
                            name={expansionInfoMap.get(expansion)!.abbreviation + " Card AERC by House"}
                            data={byHouseData as AercData[]}
                            indexBy={"house"}
                            width={640}
                            key={expansion}
                        />
                    )
                })}
            </div>
        )
    }
}

interface AercData extends CardAercData {
    expansion?: string
    house?: string
}

const AercBySetBar = (props: { name: string, data: AercData[], indexBy: string, width: number }) => {
    return (
        <Card style={{margin: spacing(2), padding: spacing(2), display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography variant={"h4"} color={"primary"}>{props.name}</Typography>
            <div style={{width: props.width, height: 560}}>
                <ResponsiveBar
                    data={props.data}
                    keys={aercProperties}
                    indexBy={props.indexBy}
                    margin={{top: 50, right: 130, bottom: 50, left: 60}}
                    padding={0.3}
                    colors={{scheme: "paired"}}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: props.indexBy,
                        legendPosition: "middle",
                        legendOffset: 32
                    }}
                    maxValue={1.8}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "AERC per Card",
                        legendPosition: "middle",
                        legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{from: "color", modifiers: [["darker", 1.6]]}}
                    legends={[
                        {
                            dataFrom: "keys",
                            anchor: "bottom-right",
                            direction: "column",
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: "left-to-right",
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    animate={true}
                />
            </div>
        </Card>
    )
}