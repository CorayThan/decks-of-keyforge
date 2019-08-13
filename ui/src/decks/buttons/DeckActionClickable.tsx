import MenuItem from "@material-ui/core/MenuItem"
import * as React from "react"
import { KeyButton } from "../../mui-restyled/KeyButton"

interface DeckActionClickableProps {
    onClick: () => void
    children: React.ReactNode
    menuItem?: boolean
}

export const DeckActionClickable = (props: DeckActionClickableProps) => {
    if (props.menuItem) {
        return (
            <MenuItem
                onClick={props.onClick}
            >
                {props.children}
            </MenuItem>
        )
    }
    return (
        <KeyButton
            color={"primary"}
            onClick={props.onClick}
        >
            {props.children}
        </KeyButton>
    )
}
