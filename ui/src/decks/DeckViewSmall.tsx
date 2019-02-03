import { Tooltip } from "@material-ui/core"
import Card from "@material-ui/core/Card/Card"
import CardActions from "@material-ui/core/CardActions/CardActions"
import CardContent from "@material-ui/core/CardContent/CardContent"
import { blue } from "@material-ui/core/colors"
import Divider from "@material-ui/core/Divider/Divider"
import List from "@material-ui/core/List/List"
import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { CardAsLine } from "../cards/CardSimpleView"
import { KCard } from "../cards/KCard"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { ChainsView } from "../generic/icons/ChainsView"
import { SellDeckIcon } from "../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../generic/icons/TradeDeckIcon"
import { UnregisteredDeckIcon } from "../generic/icons/UnregisteredDeckIcon"
import { House, houseValues } from "../houses/House"
import { HouseBanner } from "../houses/HouseBanner"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { TraitsView } from "../stats/TraitsView"
import { ScreenStore } from "../ui/ScreenStore"
import { UserStore } from "../user/UserStore"
import { FunnyDeck } from "./buttons/FunnyDeck"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { WishlistDeck } from "./buttons/WishlistDeck"
import { Deck, DeckUtils } from "./Deck"
import { DeckScoreView } from "./DeckScoreView"

interface DeckViewSmallProps {
    deck: Deck
    fullVersion?: boolean
}

@observer
export class DeckViewSmall extends React.Component<DeckViewSmallProps> {
    render() {
        const {deck, fullVersion} = this.props
        const {
            id, keyforgeId, name, houses,
            wishlistCount, funnyCount,
            forSale, forTrade, chains,
            registered
        } = deck
        const userDeck = UserStore.instance.userDeckByDeckId(id)
        let wishlist = false
        let funny = false
        let userDeckForSale = false
        let userDeckForTrade = false
        if (userDeck) {
            wishlist = userDeck.wishlist
            funny = userDeck.funny
            userDeckForSale = userDeck.forSale
            userDeckForTrade = userDeck.forTrade
        }
        const compact = ScreenStore.instance.screenSizeXs()
        return (
            <Card
                style={{
                    margin: spacing(2),
                    width: compact ? 344 : 544,
                }}
            >
                <div
                    style={{
                        backgroundColor: blue ["500"],
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingTop: spacing(1),
                        paddingBottom: spacing(1),
                    }}
                >
                    <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-evenly"}}>
                        <div style={{flexGrow: compact ? undefined : 1, display: compact ? "flex" : undefined}}>
                            <HouseBanner houses={houses} vertical={compact}/>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: spacing(1)}}>
                                <ChainsView chains={chains} style={{marginRight: spacing(2)}}/>
                                <TraitsView hasTraits={deck} compact={compact} round={true}/>
                            </div>
                        </div>
                        <DeckScoreView deck={deck} style={{marginRight: spacing(2)}}/>
                    </div>
                </div>
                <CardContent style={{paddingBottom: 0, flexGrow: 1}}>
                    <div style={{display: "flex"}}>
                        {registered ? null : (
                            <Tooltip title={"Unregistered Deck"}>
                                <div>
                                    <UnregisteredDeckIcon style={{marginRight: spacing(1), marginTop: 3}} height={24}/>
                                </div>
                            </Tooltip>
                        )}
                        <div style={{paddingBottom: spacing(1), flexGrow: 1}}>
                            <KeyLink
                                to={Routes.deckPage(keyforgeId)}
                                disabled={fullVersion}
                                noStyle={true}
                            >
                                <Typography variant={"h5"}>{name}</Typography>
                            </KeyLink>
                        </div>
                        {forSale || userDeckForSale ? (
                            <Tooltip title={"For sale"}>
                                <div style={{marginLeft: spacing(1)}}><SellDeckIcon/></div>
                            </Tooltip>
                        ) : null}
                        {forTrade || userDeckForTrade ? (
                            <Tooltip title={"For trade"}>
                                <div style={{marginLeft: spacing(1)}}><TradeDeckIcon/></div>
                            </Tooltip>
                        ) : null}
                    </div>
                    <DisplayAllCardsByHouse deck={this.props.deck}/>
                </CardContent>

                <CardActions>
                    {fullVersion ? (
                        <KeyButton
                            href={"https://www.keyforgegame.com/deck-details/" + keyforgeId}
                            color={"primary"}
                            style={{marginRight: spacing(2)}}
                        >
                            Master Vault
                        </KeyButton>
                    ) : (
                        <KeyLink
                            to={Routes.deckPage(keyforgeId)}
                            noStyle={true}
                            style={{marginRight: spacing(2)}}
                        >
                            <KeyButton color={"primary"}>View Deck</KeyButton>
                        </KeyLink>
                    )}
                    <MyDecksButton deck={this.props.deck}/>
                    <div style={{flexGrow: 1}}/>
                    <div style={{marginRight: spacing(1)}}>
                        <WishlistDeck deckName={name} wishlisted={wishlist} deckId={id} wishlistCount={wishlistCount}/>
                    </div>
                    <div style={{marginRight: spacing(1)}}>
                        <FunnyDeck deckName={name} funny={funny} deckId={id} funnyCount={funnyCount}/>
                    </div>
                </CardActions>
            </Card>
        )
    }
}

const DisplayAllCardsByHouse = (props: { deck: Deck }) => {
    const cardsByHouse = DeckUtils.cardsInHouses(props.deck)

    if (ScreenStore.instance.screenSizeXs()) {
        return <DisplayAllCardsByHouseCompact {...props}/>
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
            {cardsByHouse.map((cardsForHouse) => (<DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse}/>))}
        </div>
    )
}

const DisplayAllCardsByHouseCompact = (props: { deck: Deck }) => {
    const cardsByHouse = DeckUtils.cardsInHouses(props.deck)

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            {cardsByHouse.map((cardsForHouse) => (
                <DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse}/>
            ))}
        </div>
    )
}

const DisplayCardsInHouse = (props: { house: House, cards: KCard[] }) => (
    <List>
        {houseValues.get(props.house)!.title}
        <Divider style={{marginTop: 4}}/>
        {props.cards.map((card, idx) => (<CardAsLine key={idx} card={card}/>))}
    </List>
)
