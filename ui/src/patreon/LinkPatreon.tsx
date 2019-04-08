import { ButtonProps } from "@material-ui/core/Button"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Utils } from "../config/Utils"
import { PatreonIcon } from "../generic/icons/PatreonIcon"
import { KeyButton } from "../mui-restyled/KeyButton"
import { userStore } from "../user/UserStore"
import { patreonStore } from "./PatreonStore"

const patreonClientId = Utils.isDev()
    ? "3ZBEu_2szKMO8S7kB3GuyUk4QizFzS4P0GjYG3NK7fAYegitcFZLNxpmCuIFpxMF"
    : "5dTatoZIqm7HxUDiu2FXHsiP8BQtULk0JECv2DTUb6gpju4HVaRYzisY1aX_dXEG"

const basePatLink = "https://www.patreon.com/oauth2/authorize" +
    "?response_type=code" +
    "&client_id=" +
    patreonClientId +
    "&redirect_url=https://decksofkeyforge.com/my-profile"

const userLink = basePatLink + "&scope=identity"

const creatorLink = basePatLink + "&scope=campaigns.members%5Bemail%5D"

@observer
export class LinkPatreon extends React.Component<ButtonProps> {
    render() {
        let patreonLink = userLink
        if (userStore.email === "coraythan@gmail.com") {
            patreonLink = creatorLink
        }
        if (userStore.patron) {
            return (
                <KeyButton
                    color={"primary"}
                    variant={"outlined"}
                    {...this.props}
                    onClick={patreonStore.unlinkAccount}
                >
                    <PatreonIcon primary={true}/>
                    <div style={{marginRight: spacing(1)}}/>
                    Unlink Patreon
                </KeyButton>
            )
        }
        return (
            <KeyButton
                color={"primary"}
                variant={"outlined"}
                href={patreonLink}
                {...this.props}
            >
                <PatreonIcon primary={true}/>
                <div style={{marginRight: spacing(1)}}/>
                Link your Patreon Account
            </KeyButton>
        )
    }
}
