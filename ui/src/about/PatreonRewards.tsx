import { Link, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths, Routes } from "../config/Routes"
import { InfoListCard } from "../generic/InfoListCard"
import { LinkPatreon } from "../thirdpartysites/patreon/LinkPatreon"
import { patronRewardLevelName } from "../thirdpartysites/patreon/PatreonRewardsTier"
import { patreonStore } from "../thirdpartysites/patreon/PatreonStore"
import { PatronButton } from "../thirdpartysites/patreon/PatronButton"
import { userStore } from "../user/UserStore"
import { AboutGridItem } from "./AboutPage"

@observer
export class PatreonRewards extends React.Component {

    componentDidMount(): void {
        patreonStore.findTopPatrons()
    }

    /* eslint react/jsx-key: 0 */
    render() {
        return (
            <>
                <AboutGridItem>
                    {userStore.patron ? (
                        <InfoListCard
                            title={"Thanks for being a Patron!"}
                            infos={[
                                <Typography style={{marginBottom: spacing(2)}}>Patreon tier: {patronRewardLevelName(userStore.patronTier)}</Typography>,
                                "All tiers have the benefits of all lower tiers.",
                                <div style={{paddingTop: spacing(1), display: "flex", justifyContent: "center"}}>
                                    <PatronButton/>
                                </div>
                            ]}
                        />
                    ) : (
                        <InfoListCard
                            title={"Become a Patron"}
                            infos={[
                                "Become a patron with Patreon to support the site and gain rewards! After becoming a Patron link your Patreon account to " +
                                "get your benefits.",
                                "All tiers have the benefits of all lower tiers.",
                                <div style={{paddingTop: spacing(1), display: "flex", justifyContent: "center"}}>
                                    <PatronButton style={{marginRight: spacing(2)}}/>
                                    <LinkPatreon returnPath={AboutSubPaths.patreon}/>
                                </div>
                            ]}
                        />
                    )}
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"Accessing your rewards"}
                        infos={[
                            <Typography style={{marginRight: spacing(2)}}>
                                After becoming a patron link your account with the above "Link Patreon" button.
                            </Typography>,
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Dark Mode – $1+</Typography>,
                            <Typography>Go to your <Link href={Routes.myProfile}>profile</Link> to toggle on dark mode.</Typography>,
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Deck for sale notifications – $5+</Typography>,
                            <Typography>
                                Search <Link href={Routes.decksForSale()}>decks for sale</Link> and you will see a "Notify" button appear next to
                                the "Search" button. Use that to save a custom search and get notified when someone lists a match.
                            </Typography>,
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Store listing on the landing page – $10+</Typography>,
                            `You must have 10 or more decks listed for sale or trade for your store to show. You can change your store name from your ` +
                            `profile. To have an icon send me a 48px high image, ideally in png format with transparency. The more like an icon it is, ` +
                            `and the less like a picture, the better.`,
                        ]}
                    />
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard
                        title={"It that Fastidiously Notices Bargains"}
                        titleVariant={"h5"}
                        subtitle={"$1 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "Dark mode",
                            "List decks for sale or trade for up to 1 year",
                            "List up to 250 decks for sale. (Free maximum is 100.)",
                            "Automatically renew expired deck for sale listings with a setting in your profile",
                            "Search team decks",
                            "Create Theoretical Decks",
                            "That warm and fuzzy feeling that comes from supporting something cool",
                        ]}
                    />
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"The Archon that Purchases the Paradigm"}
                        titleVariant={"h5"}
                        subtitle={"$5 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "Up to 25 deck sale notifications: Set up to be notified whe never decks that match certain search criteria are listed for sale or trade.",
                            "List up to 1000 decks for sale",
                            "Form a team and manage members",
                            "See your full purchase and sale history"
                        ]}
                    />
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"Merchant Æmbermaker"}
                        titleVariant={"h5"}
                        subtitle={"$10 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "List any number of decks for sale.",
                            `Get your store listed on the landing page of the site!`,
                            "Your listings will show your store icon and name, and they will link to your decks for sale.",
                        ]}
                    />
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"The Charitable Champion"}
                        titleVariant={"h5"}
                        subtitle={"$25 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "Up to 50 deck sale notifications.",
                            "Credit on the contact me about page as a major contributor to the site.",
                            "Join a special major contributor channel on the discord."
                        ]}
                    />
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"The Generous Patron of Agajoll"}
                        titleVariant={"h5"}
                        subtitle={"$50 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "One hour of online KeyForge coaching per month from me, CorayThan!",
                            "This can be playing a game with open hands where we discuss the best lines to take, or I can do a bit of collection " +
                            "evaluation if you prefer.",
                            "I am a two-time #1 ranked player on the Vault Tour leaderboard, and currently ranked #3. I have won two vault tours: " +
                            "the Denver Survival and Indianapolis sealed WC. I am also the creator of Decks of KeyForge and the SAS and AERC rating systems."
                        ]}
                    />
                </AboutGridItem>
            </>
        )
    }
}
