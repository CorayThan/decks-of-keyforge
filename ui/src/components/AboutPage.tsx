import { Grid, Typography } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { DeckScoreView } from "../decks/DeckScoreView"
import { KeyBar, KeyPie } from "../decks/DeckStatsView"
import { InfoListCard } from "../generic/InfoListCard"
import { UiStore } from "../ui/UiStore"

export class AboutPage extends React.Component {

    constructor(props: {}) {
        super(props)
        UiStore.instance.setTopbarValues("About", "About", "What it's for and how it works")
    }

    render() {
        return (
            <div style={{margin: spacing(4), display: "flex", justifyContent: "center"}}>
                <Grid container={true} spacing={32} style={{maxWidth: 1280}}>
                    <Grid item={true} xs={12} md={6}>
                        <InfoListCard title={"Decks of Keyforge"} titleVariant={"h4"} infos={[
                            "The most robust deck and card search available for Keyforge.",
                            "SAS is a unique rating system that reflects deck power.",
                            "List decks for sale or trade, and use the search features to find available decks.",
                            "Wishlist and mark decks as funny, and see what everyone else thinks too!",
                            <span>
                                <Typography>For comments and suggestions send a PM to Coraythan on Reddit, or send an email to</Typography>
                                <a href={"mailto:decksofkeyforge@gmail.com"}>decksofkeyforge@gmail.com</a>
                            </span>
                        ]}/>
                        <div style={{marginBottom: spacing(4)}}/>
                        <InfoListCard title={"Stats of Keyforge"} titleVariant={"h4"} infos={[
                            <Typography variant={"h6"}>Deck Statistics</Typography>,
                            <div style={{paddingBottom: spacing(1)}}/>,
                            <div style={{maxWidth: 520, maxHeight: 240}}>
                                <KeyPie creatures={17} actions={14} artifacts={4} upgrades={1} padding={48}/>
                            </div>,
                            "I've calculated the average statistics for decks in many categories, like card type ratios.",
                            <div style={{paddingBottom: spacing(1)}}/>,
                            <Typography variant={"h6"}>Deck Traits</Typography>,
                            <div style={{maxWidth: 520, maxHeight: 320}}>
                                <KeyBar
                                    data={[
                                        {x: "Expected Aember", y: 18},
                                        {x: "Aember Control", y: 7},
                                        {x: "Creature Control", y: 11},
                                        {x: "Artifact Control", y: 1},
                                    ]}
                                    domainPadding={60}
                                />
                            </div>,
                            <div style={{paddingBottom: spacing(2)}}/>,
                            "I've rated every card in key metrics, like its expected aember generation, aember control (a combination of steal, " +
                            "loss, and capture), creature control, and artifact control.",
                            "These are important metrics to consider when judging the quality of a deck, but they don't directly impact a deck's SAS " +
                            "rating.",
                            "However, when searching for decks you can use these to filter decks and only show decks with strong or weak traits.",
                        ]}/>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                        <InfoListCard title={"How SASy is your deck?"} titleVariant={"h4"} infos={[
                            "My formula calculates a rating for every deck based the quality of its cards and their synergies and antisynergies. " +
                            "This is the deck's SAS rating.",
                            <div style={{paddingBottom: spacing(1)}}/>,
                            <Typography variant={"h6"}>Card Ratings</Typography>,
                            "Every card in the game is given a rating between 0 and 4, where 0 is very bad, and 4 is very good. These create the deck's Card Rating.",
                            <CardExample
                                text={"Bait and Switch is one of the few cards rated 4. It consistently provides a net value of 2, 4, or more aember. " +
                                "Key of Darkness, on the other hand, is one of the few cards rated 0. It provides no aember and is very difficult to use."}
                                img1={"https://cdn.keyforgegame.com/media/card_front/en/341_267_VHQ67J5MWQV5_en.png"}
                                img2={"https://cdn.keyforgegame.com/media/card_front/en/341_273_VHRR6QWG3C3_en.png"}
                            />,
                            <div style={{paddingBottom: spacing(1)}}/>,
                            <Typography variant={"h6"}>Card Synergies</Typography>,
                            "Every card is given a list of traits it provides, and synergies and antisynergies it has with card and deck traits.",
                            "Synergies and antisynergies are rated from 1 to 3, with more powerful effects rated higher.",
                            "Synergy and antisynergy benefits are limited to 2 and -2 per card, to help reflect diminishing returns.",
                            <CardExample
                                text={"Ember Imp and Shadow Self synergize because Ember Imp has a great effect but is easy to kill, and " +
                                "Shadow Self provides protection."}
                                img1={"https://cdn.keyforgegame.com/media/card_front/en/341_85_C72X25358RG2_en.png"}
                                img2={"https://cdn.keyforgegame.com/media/card_front/en/341_310_C33C4J4W6726_en.png"}
                            />,
                            <div style={{paddingBottom: spacing(1)}}/>,
                            <Typography variant={"h6"}>Deck and House Synergies</Typography>,
                            "The app calculates statistics for all decks, like how many creatures are usually in a deck, or whether the creatures are high or low " +
                            "power. Some cards synergize with the traits of a deck, or a house in a deck.",
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
                            "The system isn't perfect, but it gives a great approximation of the relative quality of decks, and can help you " +
                            "see the useful synergies in your deck, as well as antisynergies to be aware of."
                        ]}/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export const CardExample = (props: { text: string, img1: string, img2: string }) => (
    <div style={{padding: spacing(2), backgroundColor: "#DDDDDD"}}>
        <Typography>{props.text}</Typography>
        <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(2)}}>
            <div>
                <img
                    style={{width: 240, marginRight: spacing(2)}}
                    src={props.img1}
                />
            </div>
            <div>
                <img
                    style={{width: 240}}
                    src={props.img2}
                />
            </div>
        </div>
    </div>
)