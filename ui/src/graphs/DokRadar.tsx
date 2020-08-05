import { Paper, Typography } from "@material-ui/core"
import { ResponsiveRadar } from "@nivo/radar"
import { observer } from "mobx-react"
import React from "react"
import { spacing, themeStore } from "../config/MuiConfig"
import { screenStore } from "../ui/ScreenStore"

interface DokRadarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
    keys: string[]
    indexBy: string
    name: string
    maxValue?: number
    style?: React.CSSProperties
}

@observer
export class DokRadar extends React.Component<DokRadarProps> {
    render() {
        const {data, style, keys, indexBy, name, maxValue} = this.props

        const margin = 32
        const marginLeftRight = 104
        return (
            <DokDeckGraphWrapper name={name} style={style}>
                <ResponsiveRadar
                    data={data}
                    keys={keys}
                    indexBy={indexBy}
                    maxValue={maxValue}
                    gridLevels={5}
                    gridShape={"linear"}
                    colors={{scheme: "category10"}}
                    margin={{top: margin, right: marginLeftRight, bottom: margin, left: marginLeftRight}}
                    legends={[]}
                    // @ts-ignore
                    theme={themeStore.darkMode ? darkTheme : undefined}/>
            </DokDeckGraphWrapper>
        )
    }
}

export const DokDeckGraphWrapper = observer((props: { name?: string, children: React.ReactNode, style?: React.CSSProperties }) => {
    return (
        <Paper style={{display: "flex", flexDirection: "column", alignItems: "center", margin: spacing(2), ...props.style}}>
            {props.name != null && <Typography style={{marginTop: spacing(1)}} variant={"h5"} color={"primary"}>{props.name}</Typography>}
            <div style={radarStyles()}>
                {props.children}
            </div>
        </Paper>
    )
})

export const radarStyles = () => {
    const pixelSize = screenStore.smallDeckView() ? 120 : 176
    return {height: pixelSize + 32 * 2, width: pixelSize + 104 * 2}
}

const darkTheme = {
    axis: {
        ticks: {
            text: {
                fill: "#EEEEEE"
            }
        },
    },
    grid: {
        line: {
            stroke: "#EEEEEE"
        }
    },
    dots: {
        text: {
            fill: "#EEEEEE"
        }
    },
    tooltip: {
        container: {
            background: "#2d374d",
            color: "inherit",
            boxShadow: "0 3px 9px rgba(0, 0, 0, 0.5)",
        }
    }
}
