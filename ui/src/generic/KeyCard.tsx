import Card, { CardProps } from "@material-ui/core/Card"
import { blue } from "@material-ui/core/colors"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export const KeyCard = (props: { topContents: React.ReactNode } & CardProps) => {
    const {topContents, children, ...rest} = props
    return (
        <Card style={{margin: spacing(2)}} {...rest}>
            <div style={{backgroundColor: blue["500"], padding: spacing(2)}}>
                {topContents}
            </div>
            {children}
        </Card>
    )
}
