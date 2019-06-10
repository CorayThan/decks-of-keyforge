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
import { statsStore } from "../stats/StatsStore"
import { AboutGridItem } from "./AboutPage"

export const latestVersion = "5.3"

@observer
export class ReleaseNotes extends React.Component {
    render() {
        return (
            <AboutGridItem>
                <ReleaseNote releaseNumber={"5.3"} expanded={true} releaseNotes={[
                    "Moved Expansion selector down to above search bar to improve spacing on deck search.",
                    "Added a sellers view to make it more convenient for sellers to use the table view to update prices and unlist decks.",
                    "When listing an auction you can now select the time it will end.",
                    "Improved stability by improving the deck statistics update function."
                ]}/>
                <ReleaseNote releaseNumber={"5.2"} expanded={true} releaseNotes={[
                    "Refined card ratings and synergies for AoA.",
                    "Improved deck importer to better keep up with quantity of decks.",
                    "Cards sorted in a CotA style for AoA decks."
                ]}/>
                <ReleaseNote releaseNumber={"5.1"} expanded={true} releaseNotes={[
                    "In the process of adding separate stats for expansions.",
                    "Improved deck importer to better keep up with quantity of decks.",
                    "I haven't made changes yet, but I'll be updating and improving SAS ratings for AOA as I get more familiar with the set. " +
                    "While I do think AOA is weaker in general than COTA, and will have generally lower scores, I think it's being a bit underrated " +
                    "by SAS at this time."
                ]}/>
                <ReleaseNote releaseNumber={"5.0"} expanded={true} releaseNotes={[
                    "Age of Ascension traits, synergies, and antisynergies have been added! There are still some new synergies in AoA that are not yet " +
                    "represented, like an automatic anti-synergy for multiple copies of the Alpha keyword in the same house.",
                    "Revised Bait and Switch as well as Library Access. Despite it being unfortunate that they needed to do it, I'm personally excited about " +
                    "the wider array of decks now viable in top-level competitions.",
                    "A long time ago I added C (Creature Control) rating to high power creatures. I was supposed to remove that when I added Effective " +
                    "Power, but instead those C ratings were incompletely removed. They are now completely removed, so cards like Shooler don't have a C " +
                    "rating.",
                    "Legacy symbols now show up next to decks with legacy cards.",
                    "Fixed an issue with notifications not being sent for newly listed auctions."
                ]}/>
                <ReleaseNote releaseNumber={"4.4"} expanded={true} releaseNotes={[
                    "Age of Ascension decks are now importing into Decks of Keyforge! Note that these decks have SAS ratings, but those should be " +
                    "taken with a huge grain of salt. I haven't had time to add traits, synergies or antisynergies yet, so Age of Ascension decks will " +
                    "also have lower scores than they should."
                ]}/>
                <ReleaseNote releaseNumber={"4.3"} expanded={true} releaseNotes={[
                    `Search for cards as mavericks in a specific house! Just use the "Copies" drop down and select the house you want.`,
                    "New article previewing SAS ratings for many of the known cards coming out in Age of Ascension!"
                ]}/>
                <ReleaseNote releaseNumber={"4.2"} expanded={true} releaseNotes={[
                    "Added expansion selectors. The one for cards will show you the COTA cards included in AOA!",
                    "Can add filter on number of chains.",
                    "Temporarily removing house select and recently listed sort to try to improve recent performance issues. " +
                    "Also converted the total deck count to be an estimate that is much faster to calculate, but also isn't necessarily exactly how many " +
                    "decks exist."
                ]}/>
                <ReleaseNote releaseNumber={"4.1"} expanded={true} releaseNotes={[
                    "AERC now has tool tips that tell you what cards contributed to each score.",
                    "You will receive an email notification when outbid on an auction.",
                    "Added a button to go to a random registered deck."
                ]}/>
                <ReleaseNote releaseNumber={"4.0"} expanded={true} releaseNotes={[
                    "Updates to SAS and AERC! Please note the stats will be out of date temporarily. " +
                    "This will be the last big change before Age of Ascension.",
                    "The following are the changes to SAS ratings: ",
                    (
                        <List>
                            <ListItem><Typography>Brothers in Battle 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Punch 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Banner of Battle 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Pile of Skulls 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Bilgum Avalanche 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Bumpsy 2.5 -> 3</Typography></ListItem>
                            <ListItem><Typography>Ganger Chieftan 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Grenade Snib 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Lomir Flamefist 3 -> 2</Typography></ListItem>
                            <ListItem><Typography>Looter Goblin 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Rogue Ogre 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Troll 3 -> 2</Typography></ListItem>
                            <ListItem><Typography>Valdr 1.5 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Phoenix Heart 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>A Fair Game 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Control the Weak 3 -> 4</Typography></ListItem>
                            <ListItem><Typography>Tendrils of Pain 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Mind Barb 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Three Fates 3.5 -> 3</Typography></ListItem>
                            <ListItem><Typography>Key to Dis 3 -> 3.5</Typography></ListItem>
                            <ListItem><Typography>Ember Imp 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Succubus 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Master of 2/3 3 -> 2</Typography></ListItem>
                            <ListItem><Typography>Collar of Subordination 3.5 -> 3</Typography></ListItem>
                            <ListItem><Typography>Flame-Wreathed 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Effervescent Principle 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Knowledge is Power 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Phase Shift 3 -> 3.5</Typography></ListItem>
                            <ListItem><Typography>Scrambler Storm 3 -> 3.5</Typography></ListItem>
                            <ListItem><Typography>Crazy Killing Machine 1.5 -> 1</Typography></ListItem>
                            <ListItem><Typography>The Howling Pit 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Brain Eater 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Ganymede Archivist 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Titan Mechanic 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Vespilon Theorist 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Experimental Therapy 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Martians Make Bad Allies 1.5 -> 1</Typography></ListItem>
                            <ListItem><Typography>Sample Collection 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Shatter Storm 1.5 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Feeding Pit 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Invasion Portal 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Ether Spider 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Mindwarper 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Phylyx the Disintegrator 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Brain Stem Antenna 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Charge! 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Clear Mind 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Mighty Lance 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Oath of Poverty 1.5 -> 1</Typography></ListItem>
                            <ListItem><Typography>Shield of Justice 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Terms of Redress 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>The Harder They Come 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Horseman of Famine 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Jehu the Bureaucrat 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Staunch Knight 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Gatekeeper 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Routine Job 3 -> 3.5</Typography></ListItem>
                            <ListItem><Typography>Treasure Map 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Noddy the Thief 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Shadow Self 2.5 -> 3</Typography></ListItem>
                            <ListItem><Typography>Umbra 1.5 -> 1</Typography></ListItem>
                            <ListItem><Typography>Duskrunner 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Grasping Vines 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Lifeweb 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Perilous Wild 3 -> 2</Typography></ListItem>
                            <ListItem><Typography>Giant Sloth 2 -> 1.5</Typography></ListItem>
                        </List>
                    ),
                    "Also, the system for how AERC estimates artifact control has been adjusted. Now hard artifact removal like Sneklifter, or " +
                    "Neutron Shark provides 1.5 R, artifact use (removing one-use artifacts) like Remote Access or Nexus provides 1 R, and artifact delay " +
                    "like Barehanded or Grasping Vines provides 0.5 R.",
                    "You can now view only your decks that are not for sale via the top menu.",
                    "I've also begun the under-the-hoods preparations for the release of Age of Ascension."
                ]}/>
                <ReleaseNote releaseNumber={"3.8"} expanded={true} releaseNotes={[
                    "New deck view with more info! You can use the expand less button to return to the old view.",
                    "Table view now has a ton of new columns. You can see a smaller table view using the top right button.",
                    "Fixed an issue causing new patreon subscribers to not gain their benefits."
                ]}/>
                <ReleaseNote releaseNumber={"3.7"} expanded={true} releaseNotes={[
                    "Auctions added as a selling and buying option!",
                    "Choose a currency symbol on your profile so you can sell your decks with € or any other currency.",
                    "Select a deck language when selling a deck to help users know what language your deck is in. This " +
                    "defaults to English, so be sure to set it to another language if needed."
                ]}/>
                <ReleaseNote releaseNumber={"3.6"} expanded={true} releaseNotes={[
                    "Real Patron rewards! " +
                    "First one is pretty sweet. Become a $5 a month patron to save deck searches, and get email notifications when new " +
                    "decks are listed for sale or trade that match your search.",
                    `If you're a seller, you can become a $10 a month patron to have your "Store" link be featured on the landing page with a custom ` +
                    "store name and picture. (Please email me a 48px height image to get a custom image.)",
                    "Speaking of which, there's a new landing page! You won't need to wait to see the same top SAS decks you've seen a 100 times before " +
                    "anymore. It also provides some suggested deck searches, featured sellers, articles, and a couple graphs.",
                    "I've added a new public API for getting the stats used to build the charts and graphs on this site."
                ]}/>
                <ReleaseNote releaseNumber={"3.5"} expanded={true} releaseNotes={[
                    "Created an articles section with two new articles by Dunkoro and Big Z! If you're interested in contributing articles send me a " +
                    "short summary of your idea and an example paragraph. But keep in mind I'm going to be selective about what articles are added to the site."
                ]}/>
                <ReleaseNote releaseNumber={"3.4"} expanded={true} releaseNotes={[
                    "Synergy Details table now includes all cards, AERC scores, and is sortable in desktop mode.",
                    "Deck name search now ignores punctuation."
                ]}/>
                <ReleaseNote releaseNumber={"3.3"} expanded={true} releaseNotes={[
                    "Added two new AERC traits, deck manipulation and effective creature power. Read more about them on the SAS and AERC about page!",
                    "Added those two new traits to the total AERC score. This causes a major change to those scores.",
                    "Minor update to SAS based on latest card win rates. No card was changed by more than 0.5 card rating.",
                    "You can now search by card quantity \"none\" to exclude cards you don't want.",
                    "Added new \"filter on\" options to deck search. You can now filter on deck manipulation, effective creature power, as well as " +
                    "card type quantity."
                ]}/>
                <ReleaseNote releaseNumber={"3.2"} expanded={true} releaseNotes={[
                    `Europeans rejoice! You can now select "Buying Countries" in your profile. When you search decks for sale, these will be used instead of ` +
                    "your home country for searching.",
                    "Fixed a bug that could prevent users from removing a deck from their decks.",
                    `Added an "Import to my decks" option to the import deck popover.`
                ]}/>
                <ReleaseNote releaseNumber={"3.1"} expanded={true} releaseNotes={[
                    "You can set page size when searching decks to be 100. Look at the bottom of the deck search drawer!",
                    `When searching decks for sale you can set a "Listed Within Days" limit to see only more recently listed decks.`,
                    "Updated AERC stats to give credit in the C category to creatures with high power. 5-6 power provides 0.5 C, while 7+ " +
                    "is typically 7+. Also made minor improvements to other AERC stats of cards.",
                    "Added a total AERC score, along with sorting and constraining by that."
                ]}/>
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
                            {statsStore.stats == null ? <Loader/> : (
                                <StatsBar name={"SAS v3 Win Rate"} data={statsStore.stats.sasWinRate} small={true} yDomain={[0, 100]}/>
                            )}
                            <StatsBar name={"SAS v2 Win Rate"} data={sasV2BarData} small={true} yDomain={[0, 100]}/>
                        </div>
                    )
                ]}/>
                <ReleaseNote releaseNumber={"2.7"} releaseNotes={[
                    "More graphs for the deck page. Click the expansion button to see them!",
                    "Site notifies you of new releases.",
                    "Improved Patreon page."
                ]}/>
                <ReleaseNote releaseNumber={"2.6"} releaseNotes={[
                    "Cards view for deck that shows all the cards.",
                    "Sellers and traders can now update the listing for their decks.",
                    "Added an asking price deck search filter if \"For Sale\" is selected."
                ]}/>
                <ReleaseNote releaseNumber={"2.5"} releaseNotes={[
                    "Page titles now change with the pages.",
                    "Created an API for stores or technically saavy sellers to list and unlist decks.",
                    "Updated the About page. Still as meta as the first time!"
                ]}/>
                <ReleaseNote releaseNumber={"2.4"} releaseNotes={[
                    "Improved card search! Faster, and you can search up to 5 different cards.",
                    "Searching decks for sale will display sale info directly in the deck search."
                ]}/>
                <ReleaseNote releaseNumber={"2.3"} releaseNotes={[
                    "You can send an email to sellers and traders if you are logged in and they have not listed an external link for the deck.",
                    "You can now select a country for yourself and filter decks for sale or trade by the country they are listed in. Note that " +
                    "as of this release, no decks have a country selected, but all future decks listed for sale or trade will."
                ]}/>
                <ReleaseNote releaseNumber={"2.2"} releaseNotes={[
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
                <ReleaseNote releaseNumber={"2.1"} releaseNotes={[
                    "You can now view decks in a table view with column sorting.",
                    "Added password reset.",
                    "Created a Patreon page with some donation options to help support the site!"
                ]}/>
                <ReleaseNote releaseNumber={"2.0"} releaseNotes={[
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
