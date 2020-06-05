import { Typography } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import * as React from "react"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryTheme } from "victory"
import { spacing, themeStore } from "../config/MuiConfig"
import { BarData } from "./StatsBar"

export interface ComparisonBarProps {
    name: string
    data: BarData[]
    comparison?: number
    style?: React.CSSProperties
}

export const ComparisonBar = (props: ComparisonBarProps) => (
    <div
        style={{
            maxWidth: 400,
            padding: spacing(2),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ...props.style
        }}
    >
        <Typography variant={"h5"} color={themeStore.darkMode ? "textPrimary" : "primary"}>{props.name}</Typography>
        <VictoryChart
            // @ts-ignore
            theme={VictoryTheme.material}
            padding={{top: 24, bottom: 32, left: 32, right: 32}}
            width={300}
            height={142}
            style={{
                parent: {pointerEvents: "none"},
            }}
            standalone={true}
            containerComponent={<VictoryContainer responsive={false} style={{pointerEvents: "none"}}/>}
        >
            <VictoryAxis/>
            <VictoryBar
                data={props.data}
                style={{
                    data: {
                        fill: ({datum}) => {
                            if (themeStore.darkMode) {
                                return datum.x === props.comparison ? amber.A100 : blue.A100
                            }
                            return datum.x === props.comparison ? amber["500"] : blue["500"]
                        }
                    }
                }}
            />
        </VictoryChart>
    </div>
)
