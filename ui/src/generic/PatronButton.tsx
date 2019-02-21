import { ButtonProps } from "@material-ui/core/Button"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { KeyButton } from "../mui-restyled/KeyButton"
import { PatreonIcon } from "./icons/PatreonIcon"

export const PatronButton = (props: ButtonProps) => (
    <KeyButton
        color={"inherit"}
        href={"https://www.patreon.com/decksofkeyforge"}
        target={"_blank"}
        {...props}
    >
        <PatreonIcon/>
        <div style={{marginRight: spacing(1)}} />
        Become a Patron
    </KeyButton>
)