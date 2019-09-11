import { Paper, Typography } from "@material-ui/core"
import { ResponsiveRadar } from "@nivo/radar"
import { observer } from "mobx-react"
import React from "react"
import { spacing } from "../config/MuiConfig"
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
        const pixelSize = screenStore.smallDeckView() ? 120 : 176
        return (
            <Paper style={{display: "flex", flexDirection: "column", alignItems: "center", margin: spacing(2), ...style}}>
                <Typography style={{marginTop: spacing(1)}} variant={"h5"} color={"primary"}>{name}</Typography>
                <div style={{height: pixelSize + margin * 2, width: pixelSize + marginLeftRight * 2}}>
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
                    />
                </div>
            </Paper>
        )
    }
}
