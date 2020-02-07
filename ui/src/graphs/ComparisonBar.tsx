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


// export const ComparisonBar = (props: ComparisonBarProps) => {
//     const dataSorted = sortBy(props.data, data => data.x)
//         .map(data => ({quantity: data.y, value: data.x.toString()}))
//     const ticks: number[] = []
//     if (dataSorted.length > 0) {
//         const start = Number(dataSorted[0].value)
//         const end = Number(dataSorted[dataSorted.length - 1].value)
//         const range = end - start
//         if (range > 49) {
//
//         } else if (range > 9) {
//
//         } else {
//
//         }
//     }
//     return (
//         <div
//             style={{
//                 padding: spacing(2),
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 ...props.style
//             }}
//         >
//             <Typography variant={"h5"} color={"primary"} style={{marginBottom: spacing(2)}}>{props.name}</Typography>
//             <Bar
//                 height={104}
//                 width={300}
//                 data={dataSorted}
//                 keys={["quantity"]}
//                 indexBy={"value"}
//                 isInteractive={false}
//                 enableGridY={false}
//                 enableGridX={false}
//                 enableLabel={false}
//                 margin={{ top: 8, right: 0, bottom: 32, left: 0 }}
//                 axisBottom={{
//                     tickSize: 5,
//                     tickPadding: 5,
//                     tickValues: [5, 10, 15, 20, 25],
//
//                 }}
//                 axisLeft={null}
//                 animate={false}
//                 padding={0.3}
//                 colors={(datum: { data: BarData }) => {
//                     if (props.name === "SAS") {
//                         log.debug(`Bar data from colors comparison: ${props.comparison} ${prettyJson(datum)}`)
//                     }
//                     return datum.data.x === props.comparison ? amber["500"] : blue["500"]
//                 }}
//             />
//         </div>
//     )
// }
