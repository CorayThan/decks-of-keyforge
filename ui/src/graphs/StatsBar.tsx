import { Card, Typography } from "@material-ui/core"
import { amber, blue, cyan, deepPurple, grey } from "@material-ui/core/colors"
import { sortBy } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { Area, Bar, CartesianGrid, ComposedChart, Label, Tooltip, XAxis, YAxis } from "recharts"
import { spacing, themeStore } from "../config/MuiConfig"
import { roundToTens } from "../config/Utils"
import { BarData } from "../generated-src/BarData"
import { screenStore } from "../ui/ScreenStore"

export type StatsBarPropsSimplified = Omit<StatsBarProps, "yAxisName" | "filterQuantitiesBelow">

export interface StatsBarProps {
    name: string
    yAxisName: string
    xAxisName?: string
    filterQuantitiesBelow: number
    data?: BarData[]
    yDomain?: [number, number]
    small?: boolean
    style?: React.CSSProperties
    hideY?: boolean
    secondary?: boolean
    xTickValues?: number[]
    xTickFormat?: (tick: number) => number
    quantities?: BarData[]
    includePercent?: boolean
}

@observer
export class StatsBar extends React.Component<StatsBarProps> {
    render() {
        const {secondary, data, quantities, yDomain, yAxisName, xAxisName, small, style, name, hideY, filterQuantitiesBelow, includePercent} = this.props
        const smallStyle = {
            width: 300,
            height: 220,
            fontVariant: "h5"
        }
        const largeStyle = {
            width: 544,
            height: 360,
            fontVariant: "h4"
        }
        const autoSizes = screenStore.screenSizeSm() ? smallStyle : largeStyle

        const sizes = small == null ? autoSizes : (small ? smallStyle : largeStyle)

        if (data == null) {
            return <Typography style={{margin: spacing(2)}}>Calculating {name}</Typography>
        }

        const quantitiesMapped = quantities == null ? undefined : new Map(
            quantities.map(quantity => [quantity.x, quantity.y] as [string | number, number])
        )
        
        const total = includePercent ? data.map(data => data.y).reduce((sum, current) => sum + current) : 1

        const improvedData = sortBy(data, value => value.x)
            .map(data => {
                const quantity = quantitiesMapped == null ? undefined : quantitiesMapped.get(data.x)
                return {
                    x: data.x,
                    y: data.y,
                    quantity
                }
            })

        let filteredData = improvedData
        if (quantities != null) {
            filteredData = improvedData.filter(value => value.quantity! >= filterQuantitiesBelow)
        }

        let fill
        if (themeStore.altColors) {
            fill = secondary ? cyan["500"] : deepPurple["500"]
        } else {
            fill = secondary ? amber["500"] : blue["500"]
        }

        return (
            <Card style={{margin: spacing(2)}}>
                <div
                    style={{
                        maxWidth: sizes.width,
                        padding: spacing(2),
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        ...style
                    }}
                >
                    <Typography variant={sizes.fontVariant as "h4" | "h5"} color={secondary ? "secondary" : "primary"} style={{marginBottom: spacing(2)}}>
                        {name}
                    </Typography>
                    <ComposedChart
                        width={sizes.width}
                        height={sizes.height}
                        data={filteredData}
                        margin={{top: spacing(1), bottom: spacing(1), left: spacing(1), right: spacing(1)}}
                    >
                        <CartesianGrid stroke={grey["100"]}/>
                        <XAxis dataKey={"x"}>
                            {xAxisName && (
                                <Label
                                    offset={-8}
                                    position={"insideBottom"}
                                    value={xAxisName}
                                />
                            )}
                        </XAxis>
                        {!hideY && (
                            <YAxis yAxisId={"left"} domain={yDomain ? yDomain : [0, 100]}>
                                <Label
                                    value={yAxisName}
                                    angle={-90}
                                    position={"insideLeft"}
                                    offset={16}
                                    style={{fill: themeStore.lightTextColor}}
                                />
                            </YAxis>
                        )}
                        {includePercent ? (
                            <Tooltip
                                formatter={(value) => `${roundToTens((value as number) * 100 / (total as number))}%`}
                            />
                        ) : (
                            <Tooltip/>
                        )}
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
                            dataKey={"y"}
                            name={yAxisName}
                            fill={fill}
                        />
                    </ComposedChart>
                </div>
            </Card>
        )
    }
}
