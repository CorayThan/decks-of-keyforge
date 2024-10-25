import Card, { CardProps } from "@material-ui/core/Card"
import { blue, cyan } from "@material-ui/core/colors"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../config/MuiConfig"
import { Box } from "@material-ui/core"

export const KeyCard = observer((props: {
    topContents: React.ReactNode,
    rightContents?: React.ReactNode,
    topContentsStyle?: React.CSSProperties,
    light?: boolean,
    margin?: number,
} & CardProps) => {

    const {topContents, rightContents, topContentsStyle, children, style, light, margin, ...rest} = props
    let backgroundColor
    if (themeStore.altColors) {
        if (light) {
            backgroundColor = themeStore.darkMode ? cyan["500"] : cyan["200"]
        } else {
            backgroundColor = themeStore.darkMode ? cyan["800"] : cyan["500"]
        }
    } else {
        if (light) {
            backgroundColor = themeStore.darkMode ? blue["500"] : blue["200"]
        } else {
            backgroundColor = themeStore.darkMode ? blue["800"] : blue["500"]
        }
    }
    if (rightContents) {
        return (
            <Card style={{margin: margin ?? spacing(2), ...style}} {...rest}>
                <Box style={{display: "flex"}}>
                    <Box>
                        <Box display={"flex"} style={{backgroundColor, padding: spacing(1), ...topContentsStyle}}>
                            {topContents}
                        </Box>
                        {children}
                    </Box>
                    {rightContents}
                </Box>
            </Card>
        )
    }
    return (
        <Card style={{margin: margin ?? spacing(2), ...style}} {...rest}>
            <Box display={"flex"} style={{backgroundColor, padding: spacing(1), ...topContentsStyle}}>
                {topContents}
            </Box>
            {children}
        </Card>
    )
})
