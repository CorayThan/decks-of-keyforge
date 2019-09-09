import { Typography } from "@material-ui/core"
import { amber, blue, grey } from "@material-ui/core/colors"
import { sortBy } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { Area, Bar, CartesianGrid, ComposedChart, Tooltip, XAxis, YAxis } from "recharts"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryStyleInterface, VictoryTheme } from "victory"
import { spacing } from "../config/MuiConfig"
import { screenStore } from "../ui/ScreenStore"
import { BarData } from "./DeckStatsView"

export interface StatsBarProps {
    name: string
    data?: BarData[]
    yDomain?: [number, number]
    small?: boolean
    style?: React.CSSProperties
    hideY?: boolean
    secondary?: boolean
    xTickValues?: number[]
    xTickFormat?: (tick: number) => number
    quantities?: BarData[]
}

@observer
export class StatsBar extends React.Component<StatsBarProps> {
    render() {
        const {secondary, data} = this.props
        const small = {
            width: 300,
            height: 220,
            fontVariant: "h5"
        }
        const large = {
            width: 544,
            height: 360,
            fontVariant: "h4"
        }
        const autoSizes = screenStore.screenSizeSm() ? small : large

        const sizes = this.props.small == null ? autoSizes : (this.props.small ? small : large)

        if (data == null) {
            return <Typography style={{margin: spacing(2)}}>Calculating Stats</Typography>
        }

        return (
            <div
                style={{
                    maxWidth: sizes.width,
                    padding: spacing(2),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    ...this.props.style
                }}
            >
                <Typography variant={sizes.fontVariant as "h4" | "h5"} color={secondary ? "secondary" : "primary"}>{this.props.name}</Typography>
                <VictoryChart
                    theme={VictoryTheme.material}
                    padding={32}
                    width={sizes.width}
                    height={sizes.height}
                    domainPadding={{x: 16}}
                    style={{
                        parent: {
                            border: "1px solid #ccc"
                        }
                    }}
                    standalone={true}
                    containerComponent={<VictoryContainer responsive={false} style={{pointerEvents: "none"}}/>}
                    domain={this.props.yDomain == null ? undefined : {y: this.props.yDomain}}
                >
                    <VictoryAxis
                        tickValues={this.props.xTickValues}
                        tickFormat={this.props.xTickFormat}
                    />
                    {this.props.hideY ? null : (
                        <VictoryAxis
                            dependentAxis={true}
                            domain={this.props.yDomain}
                        />
                    )}
                    <VictoryBar
                        data={this.props.data}
                        style={{
                            data: {
                                fill: secondary ? amber["500"] : blue["500"]
                            }
                        } as unknown as VictoryStyleInterface}
                    />
                </VictoryChart>
            </div>
        )
    }
}

@observer
export class RechartsStatsBar extends React.Component<StatsBarProps> {
    render() {
        const {secondary, data, quantities, yDomain} = this.props
        const small = {
            width: 300,
            height: 220,
            fontVariant: "h5"
        }
        const large = {
            width: 544,
            height: 360,
            fontVariant: "h4"
        }
        const autoSizes = screenStore.screenSizeSm() ? small : large

        const sizes = this.props.small == null ? autoSizes : (this.props.small ? small : large)

        if (data == null) {
            return <Typography style={{margin: spacing(2)}}>Calculating Stats</Typography>
        }

        const quantitiesMapped = quantities == null ? undefined : new Map(
            quantities.map(quantity => [quantity.x, quantity.y] as [string | number, number])
        )

        const improvedData = sortBy(data, value => value.x)
            .map(data => {
                return {
                    x: data.x,
                    "Win Rate": data.y,
                    quantity: quantitiesMapped == null ? undefined : quantitiesMapped.get(data.x)
                }
            })

        let filteredData = improvedData
        if (quantities != null) {
            filteredData = improvedData.filter(value => value.quantity! > 99)
        }

        return (
            <div
                style={{
                    maxWidth: sizes.width,
                    padding: spacing(2),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    ...this.props.style
                }}
            >
                <Typography variant={sizes.fontVariant as "h4" | "h5"} color={secondary ? "secondary" : "primary"}>{this.props.name}</Typography>
                <ComposedChart
                    width={sizes.width}
                    height={sizes.height}
                    data={filteredData}
                    margin={{top: spacing(1), bottom: spacing(1), left: spacing(1), right: spacing(1)}}
                >
                    <CartesianGrid stroke={grey["100"]}/>
                    <XAxis dataKey={"x"}/>
                    <YAxis yAxisId={"left"} domain={yDomain ? yDomain : [0, 100]}/>
                    <Tooltip/>
                    {quantities == null ? null : (
                        <YAxis yAxisId={"right"} orientation={"right"}/>
                    )}
                    {quantities == null ? null : (
                        <Area
                            type={"monotone"}
                            dataKey={"quantity"}
                            fill={grey["300"]}
                            yAxisId={"right"}
                            stroke={"none"}
                        />
                    )}
                    <Bar
                        yAxisId={"left"}
                        dataKey={"Win Rate"}
                        fill={secondary ? amber["500"] : blue["500"]}
                    />
                </ComposedChart>
            </div>
        )
    }
}
