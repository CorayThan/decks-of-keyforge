import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { InfoListCard } from "../generic/InfoListCard"

export class AboutPage extends React.Component {
    render() {
        return (
            <div style={{margin: spacing(4), display: "flex", justifyContent: "center"}}>
                <Grid container={true} spacing={32} style={{maxWidth: 1280}}>
                    <Grid item={true} xs={12} md={6}>
                        <InfoListCard title={"Decks of Keyforge"} titleVariant={"h3"} infos={[
                            "The most robust deck and card search capabilities available for Keyforge.",
                            "A unique rating system that gives you a quick approximation of relative deck power.",
                            "Sellers and traders can list their decks for sale or trade to help potential buyers search and evaluate their decks.",
                            "Wishlist and mark decks as funny, and see what everyone else thinks too!",
                        ]}/>
                    </Grid>
                    <Grid item={true} xs={12} md={6}>
                        <InfoListCard title={"How SASy is your deck?"} titleVariant={"h4"} infos={[
                            "The formula calculates a rating for every deck based the quality of its cards, and their synergies and antisynergies. " +
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
                            <Typography variant={"h6"}>Synergies and Antisynergies</Typography>,
                            "Every card is given a list of traits it provides, and synergies and antisynergies it has with card and deck traits.",
                            "Synergies and antisynergies are rated from 1 to 3, with more powerful effects rated higher.",
                            "Synergy and antisynergy benefits are limited to 2 and -2 per card, to help reflect diminishing returns.",
                            <CardExample
                                text={"Ember Imp and Shadow Self synergize, because Ember Imp has a great effect but is easy to kill, and " +
                                "Shadow Self provides protection."}
                                img1={"https://cdn.keyforgegame.com/media/card_front/en/341_85_C72X25358RG2_en.png"}
                                img2={"https://cdn.keyforgegame.com/media/card_front/en/341_310_C33C4J4W6726_en.png"}
                            />,
                            <div style={{paddingBottom: spacing(1)}}/>,
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
                            "We add together the card ratings, synergy, and antisynergy, of a deck to create its SAS rating.",
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