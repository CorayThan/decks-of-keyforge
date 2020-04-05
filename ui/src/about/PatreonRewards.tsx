import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { InfoListCard } from "../generic/InfoListCard"
import { LinkButton } from "../mui-restyled/LinkButton"
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
                                "Become a patron with Patreon to support the site and gain rewards!",
                                "All tiers have the benefits of all lower tiers.",
                                <div style={{paddingTop: spacing(1), display: "flex", justifyContent: "center"}}>
                                    <PatronButton/>
                                </div>
                            ]}
                        />
                    )}
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"Accessing your rewards"}
                        infos={[
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Typography style={{marginRight: spacing(2)}}>After becoming a patron link your account from your </Typography>
                                <LinkButton
                                    variant={"outlined"}
                                    to={Routes.myProfile}
                                >
                                    Profile
                                </LinkButton>
                            </div>,
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Dark Mode – $1+</Typography>,
                            `Go to your profile to toggle on dark mode.`,
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Deck for sale notifications – $5+</Typography>,
                            `On the deck search page if you select "For Sale", "For Trade", or "Auctions" you will see a "Notify" button appear next to ` +
                            ` the "Search" button. Use that to save a search and get notified when someone lists a match.`,
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Store listing on the landing page – $10+</Typography>,
                            `You must have 10 or more decks listed for sale or trade for your store to show. You can change your store name from your ` +
                            `profile. To have an icon send me a 48px high image, ideally in png format with transparancy. The more like an icon it is, ` +
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
                            "List decks for sale or trade for up to 1 year.",
                            "Dark mode",
                            "Create Theoretical Decks",
                            "That warm and fuzzy feeling that comes from supporting something cool.",
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
                            "List up to five simultaneous auctions. (By default you are only allowed one.)",
                            "See your full purchase and sale history."
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
                            `Get your store listed on the landing page of the site!`,
                            "Your listings will show your store icon and name, and they will link to your decks for sale.",
                            "List up to ten simultaneous auctions."
                        ]}
                    />
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"The Speedily Super Hooligan"}
                        titleVariant={"h5"}
                        subtitle={"$25 or more per month"}
                        noDivider={true}
                        infos={[
                            "This is a limited quantity tier.",
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "Unlimited simultaneous auctions.",
                            "Up to 50 deck sale notifications.",
                            "Credit on the contact me about page as a major contributor to the site.",
                            "Join a special major contributor channel on the discord."
                        ]}
                    />
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard
                        title={"Butterfield the Always Generous"}
                        titleVariant={"h5"}
                        subtitle={"$50 or more per month"}
                        noDivider={true}
                        infos={[
                            <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>Rewards</Typography>,
                            "Request a feature to be added or moved up in my TODO list!",
                        ]}
                    />
                </AboutGridItem>
            </>
        )
    }
}
