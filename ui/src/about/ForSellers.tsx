import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { InfoListCard } from "../generic/InfoListCard"
import { KeyButton } from "../mui-restyled/KeyButton"
import { sellerStore } from "../sellers/SellerStore"
import { UserStore } from "../user/UserStore"
import { AboutGridItem } from "./AboutPage"

/* tslint:disable:jsdoc-format */
/* tslint:disable:no-trailing-whitespace */
/**
 Seller api:

 Simple with deck name:

 https://decksofkeyforge.com/api/sellers/list-deck
 POST

 Header: Api-Key = UUID

 Registered deck body:
 Body: {
     	  "keyforgeId": "4624dd19-6bf2-4100-b324-38a9445901e6",
         "deckName": "Evans, Genio Arancione",
         "listingInfo": {
             "forSale": true,
             "forTrade": false,
             "condition": "NEW_IN_PLASTIC",
 
       	  "askingPrice": 19.99,
 	          "listingInfo": "Very bad deck, so great for reversal!",
 		      "externalLink": "https://keyforgeseller.com/keyforge/decks/4624dd19-6bf2-4100-b324-38a9445901e6",
   		  "expireInDays": 365
         }
     }

 One of keyforgeId or deckName is required unless it is an unregistered deck. If using deckName it must be an exact match with what's on master vault.

 In "listingInfo" all values after "condition" are optional and may be left out, but asking price and external link are highly recommended.

 Condition options:
 NEW_IN_PLASTIC,
 NEAR_MINT,
 PLAYED,
 HEAVILY_PLAYED

 Unregistered deck body:
 Body: {
         "listingInfo": {
             "forSale": true,
             "forTrade": false,
             "condition": "NEW_IN_PLASTIC",
             "askingPrice": 19.99
         },
         "deckInfo": {
		     "name": "Crazy Pants the Frivolously Named",
		     "expansion": 341,
		     "cards": [
			     {"cardNumber": 116, "house": "Logos"},
			     // 35 more cards
		     ]
	     }
     }

 Unregister a deck by keyforge id:

 https://decksofkeyforge.com/sellers/unlist-deck/4624dd19-6bf2-4100-b324-38a9445901e6
 DELETE

 Header: Api-Key = UUID

 Unregister a deck by keyforge id:

 https://decksofkeyforge.com/sellers/unlist-deck/4624dd19-6bf2-4100-b324-38a9445901e6
 DELETE

 Header: Api-Key = UUID

 Unregister a deck by name:

 https://decksofkeyforge.com/sellers/unlist-deck-by-name/Caedwen%20%22Master%20Bandit%22%20Garc%C3%ADa
 DELETE

 Header: Api-Key = UUID

 */
@observer
export class ForSellers extends React.Component {

    componentDidMount(): void {
        sellerStore.apiKey = undefined
    }

    render() {

        let apiKeyOrButton
        if (!UserStore.instance.loggedIn()) {
            apiKeyOrButton = (
                <Typography>Login to generate an API Key.</Typography>
            )
        } else if (sellerStore.apiKey) {
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
