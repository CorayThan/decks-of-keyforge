import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { InfoListCard } from "../generic/InfoListCard"
import { KeyButton } from "../mui-restyled/KeyButton"
import { sellerStore } from "../sellers/SellerStore"
import { AboutGridItem } from "./AboutPage"

@observer
export class ForSellers extends React.Component {

    componentDidMount(): void {
        sellerStore.apiKey = undefined
    }

    render() {

        let apiKeyOrButton
        if (sellerStore.apiKey) {
            apiKeyOrButton = (
                <div>
                    <Typography variant={"h4"} style={{marginTop: spacing(2)}}>
                        Your secret API key:
                    </Typography>
                    <Typography variant={"h5"} color={"primary"} style={{marginTop: spacing(2)}}>
                        {sellerStore.apiKey}
                    </Typography>
                    <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(2)}}>
                        <Typography style={{marginRight: spacing(1)}}>
                            To learn the API contact /u/CorayThan on Reddit, send an email to
                        </Typography>
                        <a href={"mailto:decksofkeyforge@gmail.com"}>decksofkeyforge@gmail.com</a>
                        <Typography style={{marginLeft: spacing(1), marginRight: spacing(1)}}>
                            or join us on the Decks of Keyforge discord:
                        </Typography>
                        <KeyButton
                            style={{margin: spacing(1)}}
                            color={"inherit"}
                            href={"https://discord.gg/T5taTHm"}
                        >
                            Discord
                        </KeyButton>
                    </div>
                </div>
            )
        } else {
            apiKeyOrButton = (
                <div style={{display: "flex", justifyContent: "center", marginTop: spacing(4)}}>
                    <KeyButton
                        color={"secondary"}
                        variant={"contained"}
                        loading={sellerStore.generatingApiKey}
                        disabled={sellerStore.generatingApiKey}
                        onClick={sellerStore.generateApiKey}
                    >
                        Generate API Key
                    </KeyButton>
                </div>
            )
        }

        return (
            <AboutGridItem>
                <InfoListCard title={"List and unlist decks via API"} infos={[
                    "If you sell decks on a website, or have the technical know-how, you can list and unlist decks " +
                    "for sale on Decks of Keyforge via an API.",
                    "Using the button below you can generate your Api Key. You should treat this API key as a secret, like a password. " +
                    "You can make a new one at any time, but when " +
                    "you do the previous Api Key immediately becomes invalid. You will only be able to see this API key " +
                    "immediately after it is generated.",
                    apiKeyOrButton
                ]}/>
            </AboutGridItem>
        )
    }
}
