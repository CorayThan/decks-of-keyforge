import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, List, ListItem, Typography } from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { BarData } from "../stats/DeckStatsView"
import { StatsBar } from "../stats/StatsBar"
import { StatsStore } from "../stats/StatsStore"
import { AboutGridItem } from "./AboutPage"

export const latestVersion = "3.0"

@observer
export class ReleaseNotes extends React.Component {
    render() {
        return (
            <AboutGridItem>
                <ReleaseNote releaseNumber={"3.0"} expanded={true} releaseNotes={[
                    "TLDR; Updated SAS and added win rates for cards on the cards page.",
                    "This is a major revision to SAS ratings. I've used win rates of cards from the official API to inform my card ratings for SAS. I have " +
                    "followed the win rates for commons more close than uncommons or rares due to the larger amount of data.",
                    "I've also added new tiers to the card ratings, which include 0.5, 1.5, 2.5 and 3.5 for more precision in rating.",
                    "These changes have changed the scale of SAS somewhat. 75 is still pretty close to average, but the scale has widened. " +
                    "There are now 105 SAS decks (rather than 102) and 39 SAS decks (rather than 45).",
                    "Some of the major card rating changes include (keep in mind synergies can make the value in a deck go up or down):",
                    (
                        <List>
                            <ListItem><Typography>Relentless Assault 1 -> 3</Typography></ListItem>
                            <ListItem><Typography>Hebe the Huge 3 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Key Hammer 2 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Restringuntus 1 -> 3</Typography></ListItem>
                            <ListItem><Typography>Emp Blast 3 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Gatekeeper 4 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Total Recall 3 -> 1</Typography></ListItem>
                            <ListItem><Typography>Safe Place 1 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Save the Pack 2 -> 0.5</Typography></ListItem>
                        </List>
                    ),
                    "Many more have been changed by 0.5 or 1 point. You can see the previous spreadsheet in the 2.0 release notes, and compare to this one.",
                    // TODO do it
                    <a href={"https://docs.google.com/spreadsheets/d/1NpRMo_uZcOh8EkiYTvSQZOPHgfAEDU88rd7VuBDkgwQ/edit?usp=sharing"}>
                        Card Ratings v3 Spreadsheet
                    </a>,
                    "Also, you can see the win ratings for cards on the Cards page, and sort by win rating. The ratings are pretty interesting, but need " +
                    "to be taken with a huge grain of salt. First, they are highly correlated with house win rates. Shadows wins the most, so all its cards " +
                    "rate high, and Mars wins the least, so all its rate low. I've used the range of ratings intra-house more than I've compared across " +
                    "houses.",
                    "Added a global stats page.",
                    (
                        <div style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
                            {StatsStore.instance.stats == null ? <Loader/> : (
                                <StatsBar name={"SAS v3 Win Rate"} data={StatsStore.instance.stats.sasWinRate} small={true} yDomain={[0, 100]}/>
                            )}
                            <StatsBar name={"SAS v2 Win Rate"} data={sasV2BarData} small={true} yDomain={[0, 100]}/>
                        </div>
                    )
                ]}/>
                <ReleaseNote releaseNumber={"2.7"} expanded={true} releaseNotes={[
                    "More graphs for the deck page. Click the expansion button to see them!",
                    "Site notifies you of new releases.",
                    "Improved Patreon page."
                ]}/>
                <ReleaseNote releaseNumber={"2.6"} expanded={true} releaseNotes={[
                    "Cards view for deck that shows all the cards.",
                    "Sellers and traders can now update the listing for their decks.",
                    "Added an asking price deck search filter if \"For Sale\" is selected."
                ]}/>
                <ReleaseNote releaseNumber={"2.5"} expanded={true} releaseNotes={[
                    "Page titles now change with the pages.",
                    "Created an API for stores or technically saavy sellers to list and unlist decks.",
                    "Updated the About page. Still as meta as the first time!"
                ]}/>
                <ReleaseNote releaseNumber={"2.4"} expanded={true} releaseNotes={[
                    "Improved card search! Faster, and you can search up to 5 different cards.",
                    "Searching decks for sale will display sale info directly in the deck search."
                ]}/>
                <ReleaseNote releaseNumber={"2.3"} expanded={true} releaseNotes={[
                    "You can send an email to sellers and traders if you are logged in and they have not listed an external link for the deck.",
                    "You can now select a country for yourself and filter decks for sale or trade by the country they are listed in. Note that " +
                    "as of this release, no decks have a country selected, but all future decks listed for sale or trade will."
                ]}/>
                <ReleaseNote releaseNumber={"2.2"} expanded={true} releaseNotes={[
                    "Added power level, chains, wins, and losses to decks, and sorting by chains.",
                    "You can now add unregistered decks to discover their SAS and list them for sale! Just login and go to Import Deck, then use the link.",
                    "By default unregistered decks are filtered out of searches.",
                    "Traits are colored teal to differentiate from synergies.",
                    "Improved the simple deck API to v2, see below.",
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Typography>Added a</Typography>
                        <LinkButton style={{marginLeft: spacing(1)}} size={"small"} to={Routes.privacyPolicy}>Privacy Policy</LinkButton>
                    </div>
                ]}/>
                <ReleaseNote releaseNumber={"2.1"} expanded={true} releaseNotes={[
                    "You can now view decks in a table view with column sorting.",
                    "Added password reset.",
                    "Created a Patreon page with some donation options to help support the site!"
                ]}/>
                <ReleaseNote releaseNumber={"2.0"} expanded={true} releaseNotes={[
                    "Updated SAS Ratings.",
                    "The ratings of card + card synergies has been reduced in many instances. People felt that the system was over weighting " +
                    "the increased value of how cards work together when often they don't both appear in the same game, or at the wrong time.",
                    "Increased ratings of cards that increase expected aember, aember control, and creatures that help develop board control.",
                    "Added an \"Expected Aember\" deck trait synergy and synergies with it.",
                    "Added synergies, antisynergies, and changed card ratings based on community feedback.",
                    "You can view the ratings as spreadsheets on google docs. (Although I recommend toggling on full view on the Cards page for the " +
                    "current version.)",
                    <a href={"https://docs.google.com/spreadsheets/d/1v8YYw1uTaZc_G01pFqbofgYsvKP2lADEs-5-SqGR6LY/edit?usp=sharing"}>
                        Card Ratings v2 Spreadsheet
                    </a>,
                    <a href={"https://docs.google.com/spreadsheets/d/16gdzgD9Z3S6bb8NJbJCQ0A-mcOnznQnqV2wFoJublbs/edit?usp=sharing"}>
                        Card Ratings v1 Spreadsheet
                    </a>,
                    "",
                    "Added expiration date for deck listings."
                ]}/>
                <ReleaseNote releaseNumber={"1.4"} releaseNotes={[
                    "New graphs on deck page to show deck scores relative to global averages.",
                    "Added SAS and Cards Rating options to the deck search filters.",
                    "Fix for vague error on registration page.",
                ]}/>
                <ReleaseNote releaseNumber={"1.3"} releaseNotes={[
                    `Added "My Favorites" to deck search options. Changed "Wishlist" to favorites, but it can be used for either.`,
                    "Added card popovers with expanded details to Synergy Details.",
                    "Improved release notes. Whoa so meta!",
                    "Fixed some bugs, like when the site is linked to from Facebook."
                ]}/>
                <ReleaseNote releaseNumber={"1.2"} releaseNotes={[
                    "Fixed problem with user registration."
                ]}/>
                <ReleaseNote releaseNumber={"1.1"} releaseNotes={[
                    "I've temporarily disabled searching for more than one card in the deck search. It was possible to create long-running searches " +
                    "that had the potential to bring down the database.",
                    "Fixed a bug where average artifact control and creature control were showing average artifact count and creature count."
                ]}/>
            </AboutGridItem>
        )
    }
}

export const ReleaseNote = (props: { releaseNumber: string, releaseNotes: React.ReactNode[], expanded?: boolean }) => (
    <ExpansionPanel defaultExpanded={props.expanded}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
            <Typography color={"primary"} variant={"h6"}>{props.releaseNumber}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <div>
                {props.releaseNotes.map((note, idx) => {
                    if (typeof note === "string") {
                        return (
                            <Typography key={idx} style={{marginBottom: idx !== props.releaseNotes.length - 1 ? spacing(1) : undefined}}>
                                {note}
                            </Typography>
                        )
                    } else {
                        return (
                            <div key={idx}>
                                {note}
                            </div>
                        )
                    }
                })}
            </div>
        </ExpansionPanelDetails>
    </ExpansionPanel>
)

const sasV2BarData: BarData[] = [
    {
        x: 69,
        y: 44.74
    },
    {
        x: 81,
        y: 55.01
    },
    {
        x: 78,
        y: 55.52
    },
    {
        x: 99,
        y: 70.59
    },
    {
        x: 73,
        y: 48.12
    },
    {
        x: 77,
        y: 51.98
    },
    {
        x: 90,
        y: 62.54
    },
    {
        x: 87,
        y: 59.22
    },
    {
        x: 86,
        y: 59.45
    },
    {
        x: 79,
        y: 53.82
    },
    {
        x: 84,
        y: 59.08
    },
    {
        x: 83,
        y: 54.62
    },
    {
        x: 74,
        y: 49.93
    },
    {
        x: 70,
        y: 44.72
    },
    {
        x: 72,
        y: 45.1
    },
    {
        x: 80,
        y: 51.29
    },
    {
        x: 76,
        y: 51.99
    },
    {
        x: 82,
        y: 55.73
    },
    {
        x: 85,
        y: 59.46
    },
    {
        x: 75,
        y: 48.57
    },
    {
        x: 71,
        y: 44.31
    },
    {
        x: 89,
        y: 61.78
    },
    {
        x: 68,
        y: 44.1
    },
    {
        x: 62,
        y: 33.71
    },
    {
        x: 65,
        y: 42.29
    },
    {
        x: 88,
        y: 60.17
    },
    {
        x: 63,
        y: 39.77
    },
    {
        x: 92,
        y: 62.12
    },
    {
        x: 58,
        y: 40
    },
    {
        x: 67,
        y: 40.36
    },
    {
        x: 91,
        y: 61.35
    },
    {
        x: 61,
        y: 32.81
    },
    {
        x: 66,
        y: 41.03
    },
    {
        x: 64,
        y: 41.34
    },
    {
        x: 94,
        y: 69.77
    },
    {
        x: 93,
        y: 58.11
    },
    {
        x: 60,
        y: 30.95
    },
    {
        x: 96,
        y: 71.43
    },
    {
        x: 59,
        y: 38.46
    },
    {
        x: 95,
        y: 66.67
    },
    {
        x: 57,
        y: 42.86
    },
    {
        x: 98,
        y: 100
    },
    {
        x: 56,
        y: 50
    },
    {
        x: 50,
        y: 50
    }
]
