import Card from "@material-ui/core/Card/Card"
import CardContent from "@material-ui/core/CardContent/CardContent"
import { teal } from "@material-ui/core/colors"
import Divider from "@material-ui/core/Divider/Divider"
import List from "@material-ui/core/List/List"
import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { CardAsLine } from "../cards/CardSimpleView"
import { KCard } from "../cards/KCard"
import { spacing } from "../config/MuiConfig"
import { House, houseValues } from "../houses/House"
import { HouseBanner } from "../houses/HouseBanner"
import { Deck, DeckUtils } from "./Deck"


interface DeckViewSmallProps {
    deck: Deck
}

export class DeckViewSmall extends React.Component<DeckViewSmallProps> {
    render() {
        const {name, houses, cards} = this.props.deck
        return (
            <Card
                style={{
                    margin: spacing(2),
                    width: 520,
                }}
            >
                <div style={{backgroundColor: teal["500"], height: 104, width: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <div style={{marginLeft: spacing(4), marginRight: spacing(4)}}>
                        <HouseBanner houses={houses}/>
                    </div>
                </div>
                <CardContent>
                    <Typography variant={"h5"}>{name}</Typography>
                    <div style={{display: "flex"}}>
                        <DisplayAllCardsByHouse deck={this.props.deck}/>
                    </div>
                </CardContent>

                {/*<CardActions>*/}
                {/**/}
                {/*</CardActions>*/}

            </Card>
        )
    }
}

const DisplayAllCardsByHouse = (props: { deck: Deck }) => {
    const cardsByHouse = DeckUtils.cardsInHouses(props.deck)

    return (
        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
            {cardsByHouse.map((cardsForHouse) => (<DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse}/>))}
        </div>
    )
}

const DisplayCardsInHouse = (props: { house: House, cards: KCard[] }) => (
    <List>
        {houseValues.get(props.house)!.title}
        <Divider style={{marginTop: 4}}/>
        {props.cards.map((card, idx) => (<CardAsLine key={idx} card={card} />))}
    </List>
)