import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { InfoListCard } from "../generic/InfoListCard"
import { LinkButton } from "../mui-restyled/LinkButton"
import { DiscordButton } from "../thirdpartysites/discord/DiscordButton"
import { patreonStore } from "../thirdpartysites/patreon/PatreonStore"
import { PatronButton } from "../thirdpartysites/patreon/PatronButton"
import { TwitterButton } from "../thirdpartysites/twitter/TwitterButton"
import { AboutGridItem } from "./AboutPage"

@observer
export class ContactMe extends React.Component {

    componentDidMount(): void {
        patreonStore.findTopPatrons()
    }

    /* eslint react/jsx-key: 0 */
    render() {
        return (
            <>
                <AboutGridItem>
                    <InfoListCard
                        style={{maxWidth: 608}}
                        title={"Decks of KeyForge"}
                        infos={[
                            "The most robust deck and card search available for KeyForge.",
                            "SAS is a unique rating system that reflects approximate deck power.",
                            "List decks for sale or trade, and use the search features to find available decks.",
                            "Wishlist and mark decks as funny, and see what everyone else thinks too!",
                            <span style={{display: "flex", alignItems: "center"}}>
                                <Typography style={{marginRight: spacing(1)}}>Join the discussion:</Typography>
                                <DiscordButton style={{margin: spacing(1)}}/>
                                <TwitterButton style={{margin: spacing(1)}}/>
                            </span>,
                            <span>
                                <Typography>
                                    For comments and suggestions join the Discord server, contact CorayThan on Reddit, or send an email to
                                </Typography>
                                <a href={"mailto:decksofkeyforge@gmail.com"}>decksofkeyforge@gmail.com</a>
                            </span>,
                            <div style={{paddingTop: spacing(1)}}>
                                <PatronButton/>
                            </div>
                        ]}
                    />
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"Thanks and Kudos"} infos={[
                        "Decks of KeyForge wouldn't be possible without the support of this great community. To everyone who has given advice, " +
                        "reported bugs, or sent me their appreciation thank you!",
                        "I also want to specifically thank the site's most generous patrons:",
                        <div>
                            {patreonStore.topPatrons.map((patronUsername) => (
                                <Typography key={patronUsername}>{patronUsername}</Typography>
                            ))}
                        </div>,
                        "Without their support, as well as the support of all the other patrons, this site would not be possible. If you aren't already a " +
                        "patron, please consider becoming one to support the site and get some exclusive benefits on the site!",
                    ]}/>
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"Legal Stuff"} infos={[
                        "Decks of KeyForge is not associated with KeyForge or Fantasy Flight Games.",
                        "You sell, trade, and purchase decks at your own risk. We do not verify the authenticity or trustworthiness of any sellers, " +
                        "buyers, or transactions.",
                        "The SAS rating system is a copyrighted property of Decks of KeyForge, but I'm always interested in hearing about ways you'd " +
                        "like to help make it better or collaborate! But please don't steal the system, obviously.",
                        "Also, the SAS rating system isn't perfect, and is subject to change at any time. We are not responsible for any perceived " +
                        "or real loss of value due to changes to the system.",
                        <LinkButton variant={"outlined"} size={"small"} href={Routes.privacyPolicy}>Privacy Policy</LinkButton>
                    ]}/>
                </AboutGridItem>
            </>
        )
    }
}
