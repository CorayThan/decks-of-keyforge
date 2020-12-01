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
                                    <LinkPatreon redirectPath={AboutSubPaths.patreon}/>
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
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Dark Mode – $3+</Typography>,
                            <Typography>Go to your <Link href={Routes.myProfile}>profile</Link> to toggle on dark mode.</Typography>,
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Deck for sale notifications – $6+</Typography>,
                            <Typography>
                                Search <Link href={Routes.decksForSale()}>decks for sale</Link> and you will see a "Notify" button appear next to
                                the "Search" button. Use that to save a custom search and get notified when someone lists a match.
                            </Typography>,
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Store listing on the landing page – $12+</Typography>,
                            <Typography>
                                You must have 10 or more decks listed for sale or trade for your store to show. You can change your store name,
                                icon and banner from your <Link href={Routes.myProfile}>profile</Link>.
                            </Typography>,
                        ]}
                    />
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard
                        title={"It that Fastidiously Notices Bargains"}
                        titleVariant={"h5"}
                        subtitle={"$3 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "Dark mode",
                            "Analyze collections of decks up to 1000",
                            "Create tags for decks and search those tags",
                            "List decks for sale or trade for up to 1 year",
                            "List up to 250 decks for sale. (Free maximum is 100.)",
                            "Create auctions or public offer-based sale listings",
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
                        subtitle={"$6 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "Up to 25 deck sale notifications: Set up to be notified whenever decks that match certain search criteria are listed for sale or trade.",
                            "List up to 1000 decks for sale",
                            "Download deck search result spreadsheets with 1,000 or 5,000 results",
                            "Form a team and manage members",
                            "See your full purchase and sale history",
                            "Analyze collections of decks up to 2,500",
                        ]}
                    />
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"Merchant Æmbermaker"}
                        titleVariant={"h5"}
                        subtitle={"$12 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "List any number of decks for sale.",
                            `Get your store listed on the landing page of the site!`,
                            "Add a name and icon for your store. These will show on your deck listings and landing page store card.",
                            "Add a banner for your store! This will show across the top of the page when users view your decks for sale.",
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
                </AboutGridItem>
            </>
        )
    }
}
