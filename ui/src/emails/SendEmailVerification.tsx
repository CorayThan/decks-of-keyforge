import { observer } from "mobx-react"
import * as React from "react"
import { KeyButton } from "../mui-restyled/KeyButton"
import { emailStore } from "./EmailStore"

@observer
export class SendEmailVerification extends React.Component {
    render() {
        return (
            <KeyButton color={"primary"} onClick={emailStore.sendEmailVerification} loading={emailStore.sendingEmailVerification}>
                Send Verification Email
            </KeyButton>
        )
    }
}