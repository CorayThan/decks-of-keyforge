import MenuItem from "@material-ui/core/MenuItem"
import * as React from "react"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { themeStore } from "../../config/MuiConfig"

interface DeckActionClickableProps {
    onClick: () => void
    children: React.ReactNode
    menuItem?: boolean
    disabled?: boolean
}

export const DeckActionClickable = (props: DeckActionClickableProps) => {
    if (props.menuItem) {
        return (
            <MenuItem
                onClick={props.onClick}
                disabled={props.disabled}
            >
                {props.children}
            </MenuItem>
        )
    }
    return (
        <KeyButton
            color={themeStore.darkMode ? "secondary" : "primary"}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </KeyButton>
    )
}
