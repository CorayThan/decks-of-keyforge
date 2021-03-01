import { Box, Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface LargeValueIconProps {
    value: number | string
    iconSrc?: string
    style?: React.CSSProperties
    tooltip?: string
}

export const LargeValueIconsRow = (props: { values: LargeValueIconProps[], style?: React.CSSProperties }) => {
    return (
        <Box
            display={"grid"}
            gridGap={spacing(2)}
            gridAutoFlow={"column"}
            justifyContent={"center"}
            style={props.style}
        >
            {props.values.map((valueProps, idx) => (
                <LargeValueIcon {...valueProps} key={idx}/>
            ))}
        </Box>
    )
}

export const LargeValueIcon = (props: LargeValueIconProps) => {
    const {value, iconSrc, style, tooltip} = props

    const contents = (
        <Box display={"flex"} alignItems={"center"} style={style}>
            <Typography variant={"h6"} style={{fontWeight: 550, marginRight: iconSrc ? spacing(0.5) : 0, color: "#FFF"}}>{value}</Typography>
            {iconSrc && (
                <img alt={"Icon Value"} src={iconSrc} style={{width: 20}}/>
            )}
        </Box>
    )

    if (tooltip) {
        return (
            <Tooltip title={tooltip}>
                {contents}
            </Tooltip>
        )
    }

    return contents
}
