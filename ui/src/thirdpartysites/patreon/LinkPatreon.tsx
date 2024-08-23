import { ButtonProps } from "@material-ui/core/Button"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Utils } from "../../config/Utils"
import { PatreonIcon } from "../../generic/icons/PatreonIcon"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { userStore } from "../../user/UserStore"
import { patreonStore } from "./PatreonStore"

const patreonClientId = Utils.isDev()
    ? "3ZBEu_2szKMO8S7kB3GuyUk4QizFzS4P0GjYG3NK7fAYegitcFZLNxpmCuIFpxMF"
    : "5dTatoZIqm7HxUDiu2FXHsiP8BQtULk0JECv2DTUb6gpju4HVaRYzisY1aX_dXEG"

const basePatLink = (returnPath: string) => "https://www.patreon.com/oauth2/authorize" +
    "?response_type=code" +
    "&client_id=" +
    patreonClientId +
    `&redirect_url=https://decksofkeyforge.com${returnPath}`

const userLink = (returnPath: string) => basePatLink(returnPath) + "&scope=identity"

const creatorLink = (returnPath: string) => basePatLink(returnPath) + "&scope=campaigns.members%5Bemail%5D"

interface LinkPatreonProps extends ButtonProps {
    redirectPath: string
}

@observer
export class LinkPatreon extends React.Component<LinkPatreonProps> {
    render() {
        const {redirectPath, ...rest} = this.props
        let patreonLink = userLink(redirectPath)
        if (userStore.email === "coraythan@gmail.com") {
            patreonLink = creatorLink(redirectPath)
        } else if (userStore.patron) {
            return (
                <KeyButton
                    color={themeStore.darkMode ? "secondary" : "primary"}
                    variant={"outlined"}
                    {...rest}
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
                color={themeStore.darkMode ? "secondary" : "primary"}
                variant={"outlined"}
                href={patreonLink}
                {...rest}
            >
                <PatreonIcon primary={true}/>
                <div style={{marginRight: spacing(1)}}/>
                Link Patreon
            </KeyButton>
        )
    }
}
