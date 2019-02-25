import { Typography } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import { observer } from "mobx-react"
import * as React from "react"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryStyleInterface, VictoryTheme } from "victory"
import { spacing } from "../config/MuiConfig"
import { screenStore } from "../ui/ScreenStore"
import { BarData } from "./DeckStatsView"

export interface StatsBarProps {
    name: string
    data: BarData[]
    yDomain?: [number, number]
    small?: boolean
    style?: React.CSSProperties
    hideY?: boolean
    secondary?: boolean
}

@observer
export class StatsBar extends React.Component<StatsBarProps> {
    render() {
        const {secondary} = this.props
        const small = {
            width: 400,
            height: 300,
            fontVariant: "h5"
        }
        const large = {
            width: 580,
            height: 390,
            fontVariant: "h4"
        }
        const autoSizes = screenStore.screenSizeSm() ? small : large

        const sizes = this.props.small == null ? autoSizes : (this.props.small ? small : large)
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
                    domainPadding={16}
                    style={{pointerEvents: "none"}}
                    standalone={true}
                    containerComponent={<VictoryContainer responsive={false} style={{pointerEvents: "none"}}/>}
                >
                    <VictoryAxis/>
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