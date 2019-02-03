import Card, { CardProps } from "@material-ui/core/Card"
import { blue } from "@material-ui/core/colors"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export const KeyCard = (props: { topContents: React.ReactNode, light?: boolean } & CardProps) => {
    const {topContents, children, style, light, ...rest} = props
    return (
        <Card style={{margin: spacing(2), ...style}} {...rest}>
            <div style={{backgroundColor: light ? blue["200"] : blue["500"], padding: spacing(2)}}>
                {topContents}
            </div>
            {children}
        </Card>
    )
}
