import { ButtonProps } from "@material-ui/core/Button"
import Button from "@material-ui/core/Button/Button"
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface KeyButtonProps extends ButtonProps {
    loading?: boolean
    component?: string
    icon?: boolean
}

export const KeyButton = (props: KeyButtonProps) => {
    const {loading, children, icon, color, style, ...rest} = props
    return (
        <Button
            color={color}
            size={icon ? "small" : undefined}
            style={{width: icon ? 32 : undefined, height: icon ? 32 : undefined, minWidth: icon ? 32 : undefined, minHeight: icon ? 32 : undefined, ...style}}
            {...rest}
        >
            {children}
            {loading ? (
                <CircularProgress
                    color={color === "primary" ? "inherit" : "primary"}
                    style={{marginLeft: spacing(1)}}
                    size={spacing(2)}
                />
            ) : null}
        </Button>
    )
}
