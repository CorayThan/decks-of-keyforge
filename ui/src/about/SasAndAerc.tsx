import { Typography } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { DeckScoreView } from "../decks/DeckScoreView"
import { AboveAverageIcon } from "../generic/icons/AboveAverageIcon"
import { AverageIcon } from "../generic/icons/AverageIcon"
import { BelowAverageIcon } from "../generic/icons/BelowAverageIcon"
import { CardQualityIcon } from "../generic/icons/CardQualityIcon"
import { InfoListCard } from "../generic/InfoListCard"
import { Loader } from "../mui-restyled/Loader"
import { KeyBar } from "../stats/DeckStatsView"
import { StatsStore } from "../stats/StatsStore"
import { UiStore } from "../ui/UiStore"
import { AboutGridItem } from "./AboutPage"

@observer
export class SasAndAerc extends React.Component {

    constructor(props: {}) {
        super(props)
        UiStore.instance.setTopbarValues("About", "About", "What it's for and how it works")
    }

    render() {
        const stats = StatsStore.instance.stats

        return (
            <>
                <AboutGridItem>
                    <InfoListCard title={"How SASy is your deck?"} infos={[
                        "My formula calculates a rating for every deck based the quality of its cards and their synergies and antisynergies. " +
                        "This is the deck's SAS rating.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Card Ratings</Typography>,
                        "Every card in the game is given a rating between 0 and 4, where 0 is very bad, and 4 is very good. These create the deck's Card " +
                        "Rating.",
                        <div>
                            <Typography>These ratings are represented, from best to worst, by the symbols:</Typography>
                            <div style={{display: "flex", alignItems: "center", marginTop: spacing(1)}}>
                                <CardQualityIcon quality={1} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={1.5} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={2} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={2.5} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={3} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={3.5} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={4} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={4.5} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={5} style={{marginRight: spacing(1)}}/>
                            </div>
                        </div>,
                        <CardExample
                            text={"Bait and Switch is one of the few cards rated 4. It consistently provides a net value of 2, 4, or more aember. " +
                            "Key of Darkness, on the other hand, is one of the few cards rated 0. It provides no aember and is very difficult to use."}
                            img1={"https://cdn.keyforgegame.com/media/card_front/en/341_267_VHQ67J5MWQV5_en.png"}
                            img2={"https://cdn.keyforgegame.com/media/card_front/en/341_273_VHRR6QWG3C3_en.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Card Synergies</Typography>,
                        "Every card is given a list of traits it provides, and synergies and antisynergies it has with card and deck traits.",
                        "Synergies and antisynergies are rated from 1 to 3, with more powerful effects rated higher. A synergy or antisynergy becomes " +
                        "stronger the more instances of its trait that exist in a deck, up to a maximum of 4. At maximum effect you can expect " +
                        "the following increases to total synergy:",
                        <div style={{display: "flex", alignItems: "center"}}>
                            <BelowAverageIcon/>
                            <Typography style={{marginLeft: spacing(1)}}>Level 1 synergy: 0.5</Typography>
                        </div>,
                        <div style={{display: "flex", alignItems: "center"}}>
                            <AverageIcon/>
                            <Typography style={{marginLeft: spacing(1)}}>Level 2 synergy: 1</Typography>
                        </div>,
                        <div style={{display: "flex", alignItems: "center"}}>
                            <AboveAverageIcon/>
                            <Typography style={{marginLeft: spacing(1)}}>Level 3 synergy: 2</Typography>
                        </div>,
                        "Synergy and antisynergy benefits are limited to 2 and -2 per card, to help reflect diminishing returns.",
                        <CardExample
                            text={"Ember Imp and Shadow Self synergize because Ember Imp has a great effect but is easy to kill, and " +
                            "Shadow Self provides protection."}
                            img1={"https://cdn.keyforgegame.com/media/card_front/en/341_85_C72X25358RG2_en.png"}
                            img2={"https://cdn.keyforgegame.com/media/card_front/en/341_310_C33C4J4W6726_en.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Deck and House Synergies</Typography>,
                        "The app calculates statistics for all decks, like how many creatures are usually in a deck, or whether the creatures are high or " +
                        "low power. Some cards synergize with the traits of a deck, or a house in a deck.",
                        <CardExample
                            text={"Ammonia Clouds damages all creatures, but if your creatures have armor, it can prevent much of the damage dealt by " +
                            "Ammonia clouds. Ammonia Clouds synergizes with decks with high armor."}
                            img1={"https://cdn.keyforgegame.com/media/card_front/en/341_160_VQMVCX37C6XQ_en.png"}
                            img2={"https://cdn.keyforgegame.com/media/card_front/en/341_259_F6VVWM6QHCRR_en.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>SAS (Synergy and AntiSynergy Rating)</Typography>,
                        <div
                            style={{
                                backgroundColor: blue["500"],
                                padding: spacing(2),
                                width: 200,
                                borderRadius: 10
                            }}
                        >
                            <DeckScoreView deck={{
                                cardsRating: 75,
                                sasRating: 80,
                                synergyRating: 10,
                                antisynergyRating: 5,
                            }}/>
                        </div>,
                        "I add together the card ratings, synergy, and antisynergy of a deck to create its SAS rating.",
                        "The system isn't perfect, but it gives a reasonable approximation of the relative quality of decks, and can help you " +
                        "see the useful synergies in your deck, as well as antisynergies to be aware of.",
                        "Please keep in mind this system will never judge decks as accurately as a human, and it will inaccurately judge many decks, " +
                        "especially ones with very complex interactions or strategies. So just because SAS thinks your deck is bad, or average, " +
                        "doesn't mean it is in real play!"
                    ]}/>
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"The AERC of your Deck"} infos={[
                        <Typography variant={"h6"}>AERC Deck Traits</Typography>,
                        <div style={{maxWidth: 520, maxHeight: 320}}>
                            {stats ? (
                                <KeyBar
                                    data={[
                                        {x: "Aember Ctrl", y: stats.averageAmberControl},
                                        {x: "Expected Aember", y: stats.averageExpectedAmber},
                                        {x: "Artifact Ctrl", y: stats.averageArtifactControl},
                                        {x: "Creature Ctrl", y: stats.averageCreatureControl},
                                        {x: "Deck Manip", y: stats.averageDeckManipulation},
                                        {x: "Effective Power", y: stats.averageEffectivePower / 10},
                                    ]}
                                    domainPadding={60}
                                />
                            ) : <Loader/>}
                        </div>,
                        <div style={{paddingBottom: spacing(2)}}/>,
                        "I've rated every card in key metrics, like its expected aember control (A), expected aember (E), artifact control (R), " +
                        "creature control (C), Deck Manipulation (D) and Effective Total Creature Power (P).",
                        "Together these traits form a deck's AERC rating, pronounced \"Arc\" much like aember.",
                        "These are important metrics to consider when judging the quality of a deck, but they don't directly impact a deck's SAS " +
                        "rating.",
                        "However, when searching for decks you can use these to filter decks and only show decks with strong or weak traits.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Aember Control (A)</Typography>,
                        "Aember control represents the amount of aember the deck can deny your opponent for forging keys. Lost and stolen aember is " +
                        "counted at a 1:1 ratio, while captured aember and increased key cost is counted at a 2:1 ratio, as those can be reclaimed or " +
                        "avoided.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Expected Aember (E)</Typography>,
                        "This rating is an approximation of how much aember you can expect a card to generate. It does not take the ability of creatures " +
                        "to reap into account, unless they are a special skill that will usually generate extra aember, like Dew " +
                        "Faerie's \"Reap: Gain 1<A>\".",
                        "Some cards that are difficult to play have their base aember reduced, and some cards " +
                        "that immediately allow the use of creatures have aember added on the assumption creatures will be used to reap.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Artifact Control (R)</Typography>,
                        "Artifact control is increased by cards that destroy enemy artifacts, or deny your opponent the use of them.",
                        "1 point is approximately equal to destroying one artifact.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Creature Control (C)</Typography>,
                        "Creature control is increased by cards that damage, destroy, or disable enemy creatures. " +
                        "Special abilities that encourage using a creature to fight contribute extra depending on the ability.",
                        "1 point is approximately equal to destroying one 3 power creature or stunning 2 creatures.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Deck Manipulation (D)</Typography>,
                        "Deck Manipulation is increased by effects that allow you to play extra cards, or reduce the number your opponent can play. " +
                        "It is reduced by cards that prevent you from playing or drawing cards, like cards that give chains or Bad Penny.",
                        "1 point is approximately equal to drawing two cards, archiving a random card, or preventing your opponent from drawing 2.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Effective Power (P)</Typography>,
                        "While raw total creature power in a deck is a useful statistic, it has many flaws that Effective Creature Power is made to address. " +
                        "For example, there are many powerful creatures with significant downsides, " +
                        "like Kelifi Dragon or Grommid. These creatures have had their effective power reduced.",
                        "There are other creatures and abilities " +
                        "that contribute extra power, like Blood of Titans or Zyzzix the Many. These have had their effective power increased.",
                        "Effective power is also increased by Armor at a 1:1 ratio.",
                        "When included in total AERC score, Effective Power is divided by 5 and rounded to the nearest 0.5. This would make a vanilla 11 " +
                        "power creature equal to a Dust Pixie in Total AERC score.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>AERC Score (AERC)</Typography>,
                        "The AERC score of a deck is simply its AERC ratings added together. It represents how good a deck is at the core mechanics of " +
                        "the game: creating aember, and controlling aember, artifacts, and creatures. It doesn't directly represent how good a deck is.",
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
                </AboutGridItem>
            </>
        )
    }
}

export const CardExample = (props: { text: string, img1: string, img2: string }) => (
    <div style={{padding: spacing(2), backgroundColor: "#DDDDDD"}}>
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