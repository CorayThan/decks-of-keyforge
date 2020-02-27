import Card, { CardProps } from "@material-ui/core/Card"
import { blue } from "@material-ui/core/colors"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../config/MuiConfig"

export const KeyCard = observer((props: { topContents: React.ReactNode, topContentsStyle?: React.CSSProperties, light?: boolean, margin?: number } & CardProps) => {
    const {topContents, topContentsStyle, children, style, light, margin, ...rest} = props
    let backgroundColor
    if (light) {
        backgroundColor = themeStore.darkMode ? blue["500"] :  blue["200"]
    } else {
        backgroundColor = themeStore.darkMode ? blue["800"] : blue["500"]
    }
    return (
        <Card style={{margin: margin ?? spacing(2), ...style}} {...rest}>
            <div style={{backgroundColor, padding: spacing(2), ...topContentsStyle}}>
                {topContents}
            </div>
            {children}
        </Card>
    )
})
