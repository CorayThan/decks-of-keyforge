import { ButtonProps } from "@material-ui/core/Button"
import Button from "@material-ui/core/Button/Button"
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface KeyButtonProps extends ButtonProps {
    loading?: boolean
}

export const KeyButton = (props: KeyButtonProps) => {
    const {loading, children, ...rest} = props
    return (
        <Button
            {...rest}
        >
            {children}
            {loading ? <CircularProgress style={{marginLeft: spacing(1)}} size={spacing(2)}/> : null}
        </Button>
    )
}
