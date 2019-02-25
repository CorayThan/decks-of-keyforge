import { ButtonProps } from "@material-ui/core/Button"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { KeyButton } from "../mui-restyled/KeyButton"
import { PatreonIcon } from "./icons/PatreonIcon"

export const PatronButton = (props: ButtonProps & { primary?: boolean }) => {
    const {primary, ...rest} = props
    return (
        <KeyButton
            color={"inherit"}
            href={"https://www.patreon.com/decksofkeyforge"}
            target={"_blank"}
            {...rest}
        >
            <PatreonIcon primary={primary}/>
            <div style={{marginRight: spacing(1)}}/>
            Become a Patron
        </KeyButton>
    )
}
