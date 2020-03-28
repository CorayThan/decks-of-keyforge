import { Typography, TypographyProps } from "@material-ui/core"
import React from "react"

export const HelperText = (props: TypographyProps) => {
    const {style, ...rest} = props
    return (
        <Typography variant={"body2"} color={"textSecondary"} {...rest} style={{fontStyle: "italic", ...style}}/>
    )
}
