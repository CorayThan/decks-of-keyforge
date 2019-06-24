import { Link, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { InfoListCard } from "../generic/InfoListCard"
import { KeyButton } from "../mui-restyled/KeyButton"
import { publicApiStore } from "../sellers/PublicApiStore"
import { userStore } from "../user/UserStore"
import { AboutGridItem } from "./AboutPage"

/* tslint:disable:jsdoc-format */
/* tslint:disable:no-trailing-whitespace */
/**
 Seller api:

 Simple with deck name:

 https://decksofkeyforge.com/public-api/sellers/list-deck
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

 https://decksofkeyforge.com/public-api/sellers/unlist-deck/4624dd19-6bf2-4100-b324-38a9445901e6
 DELETE

 Header: Api-Key = UUID

 Unregister a deck by keyforge id:

 https://decksofkeyforge.com/public-api/sellers/unlist-deck/4624dd19-6bf2-4100-b324-38a9445901e6
 DELETE

 Header: Api-Key = UUID

 Unregister a deck by name:

 https://decksofkeyforge.com/public-api/sellers/unlist-deck-by-name/Caedwen%20%22Master%20Bandit%22%20Garc%C3%ADa
 DELETE

 Header: Api-Key = UUID

 */
@observer
export class SellersAndDevs extends React.Component {

    componentDidMount(): void {
        publicApiStore.apiKey = undefined
    }

    render() {

        let apiKeyOrButton
        if (!userStore.loggedIn()) {
            apiKeyOrButton = (
                <Typography>Login to generate an API Key.</Typography>
            )
        } else if (publicApiStore.apiKey) {
            apiKeyOrButton = (
                <div>
                    <Typography variant={"h4"} style={{marginTop: spacing(2)}}>
                        Your secret API key:
                    </Typography>
                    <Typography variant={"h5"} color={"primary"} style={{marginTop: spacing(2)}}>
                        {publicApiStore.apiKey}
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
                        loading={publicApiStore.generatingApiKey}
                        disabled={publicApiStore.generatingApiKey}
                        onClick={publicApiStore.generateApiKey}
                    >
                        Generate API Key
                    </KeyButton>
                </div>
            )
        }

        return (
            <>
                <AboutGridItem>
                    <InfoListCard title={"Generate your API Key"} infos={[
                        "To use our public APIs to sell decks or get SAS and AERC stats you'll need to generate an API key.",
                        "Using the button below you can generate your Api Key. You should treat this API key as a secret, like a password. " +
                        "You can make a new one at any time, but when " +
                        "you do the previous Api Key immediately becomes invalid. You will only be able to see this API key " +
                        "immediately after it is generated.",
                        apiKeyOrButton
                    ]}/>
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"Deck Selling API"} infos={[
                        "If you sell decks on a website, or have the technical know-how, you can list and unlist decks " +
                        "for sale on Decks of Keyforge via an API.",
                        "Generate an API key, and then contact me to get the API details."
                    ]}/>
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"File with all SAS and AERC"} infos={[
                        "Please use this instead of the API if it fits your needs to help conserve DoK's server resources.",
                        "I've created a csv (spreadsheet) file with the deck info for all decks up to the time it was generated.",
                        <Link href={"https://drive.google.com/open?id=1LP8_YSzBuGA4lhVA-dBFQWiMBAE4V-Q5"} target={"_blank"}>
                            https://drive.google.com/open?id=1LP8_YSzBuGA4lhVA-dBFQWiMBAE4V-Q5
                        </Link>,
                        "Like with the API, if you use this please attribute decksofkeyforge.com on your site / material.",
                        "I will plan to create a new file whenever I update SAS or AERC, but this file will only contain the decks up to the time it was " +
                        "generated."
                    ]}/>
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"SAS and AERC API"} infos={[
                        "I've created a simple API you can use to get SAS and AERC ratings for a deck, but if you use it I would appreciate it " +
                        "if you could follow a few rules.",
                        "1. Don't hit the endpoint too hard. It's a fairly efficient request, but my servers aren't super robust.",
                        "2. Please don't send requests with deck IDs that don't exist in master vault.",
                        "3. If you display SAS or AERC values please provide a link to decksofkeyforge.com (or a link to the deck itself " +
                        "on decksofkeyforge.com) along with the rating. " +
                        `It doesn't need to be obtrusive, for example making "75 SAS" into a link, or having a small link icon next to it, is fine.`,
                        "4. Please attribute decksofkeyforge.com on your site.",
                        "5. You'll need to use the API key associated with your account.",
                        "6. I've included the version of SAS used. If possible, please cache or persist SAS scores until a new version is released.",
                        "The url to request deck info is:",
                        "https://decksofkeyforge.com/public-api/v3/decks/{deck-id-from-master-vault}",
                        `You'll need to include the header "Api-Key: {your-api-key}`
                    ]}/>
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"Deck Statistics API"} infos={[
                        "In addition to the SAS and AERC API, I've provided an API with the data I use to build the graphs and charts you see on the site.",
                        "Again, please read the following rules for using this API:",
                        "1. Statistics are updated once every 3 days. You shouldn't need to request them more often than that.",
                        "2. Please provide a link to decksofkeyforge.com on your site. " +
                        "3. Please attribute decksofkeyforge.com as a source of data for your site.",
                        "4. You'll need to use the API key associated with your account.",
                        "The url to request stats is:",
                        "https://decksofkeyforge.com/public-api/v1/stats",
                        `You'll need to include the header "Api-Key: {your-api-key}`
                    ]}/>
                </AboutGridItem>
            </>
        )
    }
}
