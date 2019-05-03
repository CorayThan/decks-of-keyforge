import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { PatreonIcon } from "../generic/icons/PatreonIcon"
import { KeyButton } from "../mui-restyled/KeyButton"

@observer
export class PatronButton extends React.Component {
    render() {
        return (
            <KeyButton
                color={"primary"}
                variant={"contained"}
                href={"https://www.patreon.com/decksofkeyforge"}
                target={"_blank"}
            >
                <PatreonIcon primary={false}/>
                <div style={{marginRight: spacing(1)}}/>
                Become a Patron
            </KeyButton>
        )
    }
}
