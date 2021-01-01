import { Divider, List, ListItem, Typography } from "@material-ui/core"
import Link from "@material-ui/core/Link"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../config/MuiConfig"
import { DeckScorePill } from "../decks/DeckScoreView"
import { DeckSearchResult } from "../decks/models/DeckSearchResult"
import { AercIcon, AercType } from "../generic/icons/aerc/AercIcon"
import { CardQualityIcon } from "../generic/icons/CardQualityIcon"
import { InfoListCard } from "../generic/InfoListCard"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { AboutGridItem } from "./AboutPage"

@observer
export class SasAndAerc extends React.Component {

    constructor(props: {}) {
        super(props)
        uiStore.setTopbarValues("About", "About", "What it's for and how it works")
    }

    render() {
        /* eslint react/jsx-key: 0 */
        return (
            <>
                <AboutGridItem>
                    <InfoListCard title={"The AERC of your Deck"} infos={[
                        <Typography variant={"h5"}>AERC Deck Traits</Typography>,
                        "I've rated every card in key metrics, like its expected Aember Control (A), Expected Aember (E), Artifact Control (R), " +
                        "Creature Control (C), Efficiency (F), Recursion (U), Disruption (D), Effective Creature Power (P), Creature Protection (CP) " +
                        "and Other.",
                        "Together these traits form a deck's AERC rating, pronounced \"Arc\" much like aember.",
                        "When added together, these metrics represent the value of a deck converted to Aember.",
                        "When searching for decks you can use these to filter decks and only show decks with strong or weak traits.",
                        <div style={{paddingBottom: spacing(1)}}/>,

                        <AercTraitDescription
                            title={"Aember Control (A)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/routine-job.png"}
                            texts={[
                                "Aember control represents the amount of aember the deck can deny your opponent for forging keys. Lost and stolen aember is " +
                                "counted at a 1:1 ratio, while captured aember and increased key cost is counted at a 2:1 ratio, as those can be reclaimed or " +
                                "avoided."
                            ]}
                            icon={AercType.A}
                        />,
                        <AercTraitDescription
                            title={"Expected Aember (E)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/dust-pixie.png"}
                            texts={[
                                "How much aember you can expect a card to generate. It does not account for creatures reaping unless they have a special " +
                                "ability like Dew Faerie's \"Reap: Gain 1<A>\".",
                                "Some cards that are difficult to play have their base aember reduced, and some cards " +
                                "that immediately allow the use of creatures have aember added."
                            ]}
                            icon={AercType.E}
                        />,
                        <AercTraitDescription
                            title={"Artifact Control (R)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/gorm-of-omm.png"}
                            texts={[
                                "Artifact control is increased by cards that destroy enemy artifacts, or deny your opponent the use of them.",
                                "Destroying an artifact is worth 1.5 points. Using an enemy artifact (destroying single use artifacts) is 1 point. And delaying " +
                                "artifacts is 0.5 points."
                            ]}
                            icon={AercType.R}
                        />,
                        <AercTraitDescription
                            title={"Creature Control (C)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/gateway-to-dis.png"}
                            texts={[
                                "Creature control is increased by cards that damage, destroy, or disable enemy creatures. " +
                                "Special abilities that encourage using a creature to fight contribute extra depending on the ability.",
                                "1 point is approximately equal to dealing 3 damage or stunning 2 creatures. Destroying a creature is worth 1.5 C."
                            ]}
                            icon={AercType.C}
                        />,
                        <AercTraitDescription
                            title={"Efficiency (F)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/library-access.png"}
                            texts={[
                                "Efficiency is increased by effects that allow you to play extra cards. " +
                                "It is reduced by cards that prevent you from playing or drawing cards, like cards that give chains or Bad Penny.",
                                "One chain is worth approximately -0.5 F.",
                                "Archiving a random card is worth 1 point, " +
                                "archiving a card of your choice is 1.5, drawing a card is worth 0.75, and discarding a card is worth 0.5."
                            ]}
                            icon={AercType.F}
                        />,
                        <AercTraitDescription
                            title={"Recursion (U)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/regrowth.png"}
                            texts={[
                                "Recursion is increased by effects that allow you to play cards that have already been played. Replaying a card is usually " +
                                "worth 2 or less AERC, depending on restrictions."
                            ]}
                            icon={AercType.U}
                        />,
                        <AercTraitDescription
                            title={"Disruption (D)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/control-the-weak.png"}
                            texts={[
                                "Disruption is increased by effects that reduce the number of cards your opponent can play. " +
                                "1 point is approximately equal to preventing your opponent from drawing 2 cards."
                            ]}
                            icon={AercType.D}
                        />,
                        <AercTraitDescription
                            title={"Effective Power (P)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/mugwump.png"}
                            texts={[
                                "Effective power represents the real usable power of creatures in a deck. Creatures like Grommid, which " +
                                "often cannot be played or used, have their total power reduced.",
                                "Effective power is also increased by Armor at a 1:1 ratio, and other abilities that affect creature survivability, " +
                                "like elusive, skirmish, hazardous, assault and healing.",
                                "When included in total AERC score, Effective Power is divided by 10."
                            ]}
                            icon={AercType.P}
                        />,
                        <AercTraitDescription
                            title={"Creature Protection"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/encounter-suit.png"}
                            texts={[
                                "Creature Protection includes any cards with effects that protect creatures from fighting, damage, or removal. " +
                                "This includes cards that increase power, but whose primary value is in making high value creatures harder to destroy, " +
                                "like Banner of Battle."
                            ]}
                            icon={AercType.S}
                        />,
                        <AercTraitDescription
                            title={"Other"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/psychic-bug.png"}
                            texts={[
                                "Other is a catch all for qualities of cards that don't fit into the other AERC traits. It includes " +
                                "unusual effects such as viewing an opponent's hand."
                            ]}
                            icon={AercType.O}
                        />,
                        <Typography variant={"h5"}>AERC Score</Typography>,
                        <Divider/>,
                        "To calculate the AERC score divide Effective Power by 10, add all other AERC scores, and then add 0.4 x number of creatures. " +
                        "The AERC score represents how good a deck is at the core mechanics of " +
                        "the game.",
                    ]}/>
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard title={"META Score"} infos={[
                        "The META Score represents how well a deck's AERC is distributed.",

                        <List>
                            <ListItem><Typography>A from less than 5 to less than 2 gives -1 to -4 META.</Typography></ListItem>
                            <ListItem><Typography>C from less than 6 to less than 2 gives -1 to -3 META.</Typography></ListItem>
                            <ListItem><Typography>R one or more hard R gives 1 META.</Typography></ListItem>
                            <ListItem><Typography>3+ trait strength worth of board clears is worth 1 META.</Typography></ListItem>
                        </List>
                    ]}/>
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"How SASy is your deck?"} infos={[
                        "My formula calculates a rating for every deck based the quality of its cards and their synergies and antisynergies. " +
                        "This is the deck's SAS rating.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Card AERC Total</Typography>,
                        "Each card's AERC total represents the quality of that card. This is mapped to symbols that represent the quality of the " +
                        "card",
                        <div>
                            <Typography>From worst to best:</Typography>
                            <div style={{display: "flex", alignItems: "center", marginTop: spacing(1)}}>
                                <CardQualityIcon quality={0} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={1} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={2} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={3} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={4} style={{marginRight: spacing(1)}}/>
                            </div>
                        </div>,
                        <CardExample
                            text={"Timetraveller is one of the highest AERC cards with a 3.5 average. Played by itself or with Help from Future Self it consistently provides " +
                            "Aember, a creature, and often replaces itself with its draw effect. " +
                            "Key of Darkness, on the other hand, is one of the lowest at 0.2. It provides no aember and is very difficult to use."}
                            img1={"https://cdn.keyforgegame.com/media/card_front/en/341_153_X83CX7XJ5GRX_en.png"}
                            img2={"https://cdn.keyforgegame.com/media/card_front/en/341_273_VHRR6QWG3C3_en.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Card Synergies</Typography>,
                        "Every card is given a list of traits it provides, and synergies and antisynergies it has with card and deck traits.",
                        "Traits, synergies and antisynergies are rated from 1 to 3, with more powerful effects rated higher. A synergy or antisynergy becomes " +
                        "stronger the more instances of its trait that exist in a deck. Each Card with synergies has a range in which it synergizes, and " +
                        "its value goes up or down within that range based on its synergies and antisynergies.",
                        <CardExample
                            text={"Ember Imp and Shadow Self synergize because Ember Imp has a great effect but is easy to kill, and " +
                            "Shadow Self provides protection. Ember Imp provides more Disruption points to decks when paired with Shadowself."}
                            img1={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/ember-imp.png"}
                            img2={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/shadow-self.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Deck and House Synergies</Typography>,
                        "The app calculates statistics for all decks, like how many creatures are usually in a deck, or whether the creatures are high or " +
                        "low power. Some cards synergize with the traits of a deck, or a house in a deck.",
                        <CardExample
                            text={"Ammonia Clouds damages all creatures, but if your creatures have armor, it can prevent much of the damage dealt by " +
                            "Ammonia clouds. Ammonia Clouds synergizes with decks with high armor."}
                            img1={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/ammonia-clouds.png"}
                            img2={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/staunch-knight.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>SAS (Synergy and AntiSynergy Rating)</Typography>,
                        <DeckScorePill
                            deck={{
                                aercScore: 60,
                                sasRating: 63,
                                synergyRating: 5,
                                antisynergyRating: -2 ,
                                sasPercentile: 50.0
                            } as DeckSearchResult}
                        />,
                        "I add together the base AERC total for each card, synergies, and antisynergies of a deck to create its SAS rating.",
                        "The system isn't perfect, but it gives a reasonable approximation of the relative quality of decks, and can help you " +
                        "see the useful synergies in your deck, as well as antisynergies to be aware of.",
                        "Please keep in mind this system will never judge decks as accurately as a human, and it will inaccurately judge many decks, " +
                        "especially ones with very complex interactions or strategies. So just because SAS thinks your deck is bad, or average, " +
                        "doesn't mean it is in real play!"
                    ]}/>
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard title={"SAStars"} infos={[
                        "SAStars give you at-a-glance info about the percentile ranking of a deck in terms of SAS among all other decks.",
                        "Unlike SAS, a deck's ranking in terms of SAStars can change at any time if the quality of all registered decks is changed in " +
                        "some way, for example by the release of a new set that is rated better or worse than previous sets.",
                        "SAStars are calculated as follows:",
                        <List>
                            <ListItem><Typography>Top 0.01% of decks (1/10,000) will be 5 gold stars</Typography></ListItem>
                            <ListItem><Typography>Top 0.1% of decks (1/1000) will be 5 stars</Typography></ListItem>
                            <ListItem><Typography>Top 1% of decks (1/100) will be 4.5 stars</Typography></ListItem>
                            <ListItem><Typography>Top 10% of decks will be 4 stars</Typography></ListItem>
                            <ListItem><Typography>Top 25% of decks will be 3.5 stars</Typography></ListItem>
                            <ListItem><Typography>Middle 50% of decks will be 3 stars (Half of all decks)</Typography></ListItem>
                            <ListItem><Typography>Bottom 25% of decks will be 2.5 stars</Typography></ListItem>
                            <ListItem>
                                <Typography>
                                    Bottom 10% of decks will be 2 stars
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Bottom 1% of decks will be 1.5 stars
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Bottom 0.1% of decks will be 1 star
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Bottom 0.01% of decks will be 0.5 stars
                                </Typography>
                            </ListItem>
                        </List>
                    ]}/>
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard title={"Using SAS and AERC"} infos={[
                        "SAS estimates the total power of the cards in a deck, and how the synergies and antisynergies effect the deck's quality, but " +
                        "it won't be right about every deck. Many decks have complex combos SAS doesn't take into account, or their component cards " +
                        "and synergies are very good, but they're missing a key overall trait, like sufficient Aember Control.",
                        "Using a combination of SAS, AERC deck traits, and human judgement, it's possible to make an educated guess which of your decks " +
                        "are best, or what would be a good deck to purchase. But even then, the best way to judge the quality of decks will be playing " +
                        "the game!"
                    ]}/>
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard title={"AERC + SAS Details"} infos={[
                        `Traits and synergies are matched together using a complex software algorithm. For example a human creature with the synergy ` +
                        `"Destroys friendly creatures" would synergize with a trait that read "Destroys creatures artifacts" (where player is unspecified) ` +
                        `but not a trait that read "Destroys friendly demon creatures" because the card with the synergy is not a demon.`,
                        "For more detailed notes on how AERC and SAS are calculated and rated, please take a look at this google doc.",
                        (
                            <Link href={"https://docs.google.com/document/d/1WkphfSzWj-hZ8l7BMhAgNF6-8b3Qj9cFiV7gGkR9HBU/edit?usp=sharing"}>
                                AERC Rating Guidelines
                            </Link>
                        )
                    ]}/>
                </AboutGridItem>
            </>
        )
    }
}

export const AercTraitDescription = observer((props: { title: string, texts: string[], img: string, icon: AercType }) => (
    <div>
        <div style={{display: "flex"}}>
            <div>
                <div style={{display: "flex", alignItems: "center", marginBottom: spacing(1)}}>
                    <AercIcon type={props.icon}/>
                    <Typography variant={"h5"} style={{marginLeft: spacing(1)}}>
                        {props.title}
                    </Typography>
                </div>
                <Divider style={{marginBottom: spacing(1)}}/>
                {props.texts.map((text, idx) => (
                    <div style={{marginBottom: spacing(1)}} key={idx}>
                        <Typography>
                            {text}
                        </Typography>
                    </div>
                ))}
            </div>
            {screenStore.screenWidth > 500 && (
                <div>
                    <div style={{marginLeft: spacing(2), padding: spacing(2), backgroundColor: themeStore.aercViewBackground}}>
                        <img
                            style={{width: 200}}
                            src={props.img}
                            alt={"Card For Text"}
                        />
                    </div>
                </div>
            )}
        </div>
        <div style={{paddingBottom: spacing(1)}}/>
    </div>
))


export const CardExample = (props: { text: string, img1: string, img2: string }) => (
    <div style={{padding: spacing(2), backgroundColor: themeStore.aercViewBackground}}>
        <Typography>{props.text}</Typography>
        <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(2), justifyContent: "center"}}>
            <div>
                <img
                    style={{width: 232, margin: spacing(1)}}
                    src={props.img1}
                    alt={"Card left."}
                />
            </div>
            <div>
                <img
                    style={{width: 232, margin: spacing(1)}}
                    src={props.img2}
                    alt={"Card Right."}
                />
            </div>
        </div>
    </div>
)
