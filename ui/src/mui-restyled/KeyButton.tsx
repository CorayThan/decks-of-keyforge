import { ButtonProps } from "@material-ui/core/Button"
import Button from "@material-ui/core/Button/Button"
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface KeyButtonProps extends ButtonProps {
    loading?: boolean
    component?: string
}

export const KeyButton = (props: KeyButtonProps) => {
    const {loading, children, color, ...rest} = props
    return (
        <Button
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
