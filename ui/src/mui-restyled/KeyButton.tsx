import { ButtonProps } from "@material-ui/core/Button"
import Button from "@material-ui/core/Button/Button"
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface KeyButtonProps extends ButtonProps {
    outlinedWhite?: boolean
    loading?: boolean
    component?: string
}

export const KeyButton = (props: KeyButtonProps) => {
    const {loading, children, outlinedWhite, style, color, ...rest} = props
    return (
        <Button
            variant={outlinedWhite ? "outlined" : undefined}
            style={{border: outlinedWhite ? "1px solid rgb(255, 255, 255)" : undefined, ...style}}
            color={color}
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
