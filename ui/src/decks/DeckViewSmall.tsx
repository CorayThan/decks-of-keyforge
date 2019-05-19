import { IconButton, Tooltip } from "@material-ui/core"
import CardActions from "@material-ui/core/CardActions/CardActions"
import CardContent from "@material-ui/core/CardContent/CardContent"
import Divider from "@material-ui/core/Divider/Divider"
import List from "@material-ui/core/List/List"
import Typography from "@material-ui/core/Typography/Typography"
import { ExpandLess, ExpandMore } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { CardsForDeck } from "../cards/CardsForDeck"
import { CardAsLine } from "../cards/CardSimpleView"
import { CardsWithAerc } from "../cards/CardsWithAerc"
import { KCard } from "../cards/KCard"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { TextConfig } from "../config/TextConfig"
import { AmberIcon } from "../generic/icons/AmberIcon"
import { ArchiveIcon } from "../generic/icons/ArchiveIcon"
import { AuctionDeckIcon } from "../generic/icons/AuctionDeckIcon"
import { DrawIcon } from "../generic/icons/DrawIcon"
import { KeyCheatIcon } from "../generic/icons/KeyCheatIcon"
import { SellDeckIcon } from "../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../generic/icons/TradeDeckIcon"
import { UnregisteredDeckIcon } from "../generic/icons/UnregisteredDeckIcon"
import { InfoIconList } from "../generic/InfoIcon"
import { KeyCard } from "../generic/KeyCard"
import { House, houseValues } from "../houses/House"
import { HouseBanner } from "../houses/HouseBanner"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { AercScoreView } from "../stats/AercScoreView"
import { screenStore } from "../ui/ScreenStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { FunnyDeck } from "./buttons/FunnyDeck"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { WishlistDeck } from "./buttons/WishlistDeck"
import { Deck, DeckUtils } from "./Deck"
import { DeckScoreView } from "./DeckScoreView"
import { OrganizedPlayStats } from "./OrganizedPlayStats"

interface DeckViewSmallProps {
    deck: Deck
    fullVersion?: boolean
    hideActions?: boolean
    style?: React.CSSProperties
}

@observer
export class DeckViewSmall extends React.Component<DeckViewSmallProps> {
    render() {
        const {deck, fullVersion, hideActions, style} = this.props
        const {
            id, keyforgeId, name, wishlistCount, funnyCount,
            forSale, forTrade, forAuction, registered
        } = deck
        const userDeck = userDeckStore.userDeckByDeckId(id)
        let userDeckForSale = false
        let userDeckForTrade = false
        let userDeckForAuction = false
        if (userDeck) {
            userDeckForSale = userDeck.forSale
            userDeckForTrade = userDeck.forTrade
            userDeckForAuction = userDeck.forAuction
        }
        const compact = screenStore.screenSizeXs()

        let width
        if (compact) {
            width = 328
        } else if (keyLocalStorage.displayOldDeckView) {
            width = 544
        } else {
            width = 652
        }
        return (
            <KeyCard
                style={{
                    width,
                    margin: spacing(2),
                    ...style
                }}
                topContents={<DeckViewTopContents deck={deck} compact={compact}/>}
                topContentsStyle={{
                    padding: 0,
                    paddingTop: spacing(1),
                    paddingBottom: spacing(1)
                }}
            >
                <div style={{display: "flex"}}>
                    <div style={{flexGrow: 1}}>
                        <CardContent style={{paddingBottom: 0, width: compact ? undefined : 544}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                {registered ? null : (
                                    <Tooltip title={"Unregistered Deck"}>
                                        <div>
                                            <UnregisteredDeckIcon style={{marginRight: spacing(1), marginTop: 3}}/>
                                        </div>
                                    </Tooltip>
                                )}
                                <div style={{flexGrow: 1}}>
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
                                {forAuction || userDeckForAuction ? (
                                    <Tooltip title={"On auction"}>
                                        <div style={{marginLeft: spacing(1)}}><AuctionDeckIcon/></div>
                                    </Tooltip>
                                ) : null}
                                {keyLocalStorage.displayOldDeckView && !compact ? (
                                    <IconButton onClick={keyLocalStorage.toggleDisplayOldDeckView}>
                                        <ExpandMore fontSize={"small"}/>
                                    </IconButton>
                                ) : null}
                            </div>
                            <DisplayAllCardsByHouse deck={this.props.deck}/>
                        </CardContent>
                        {hideActions ? null : (
                            <CardActions style={{flexWrap: "wrap", padding: spacing(1)}}>
                                {fullVersion && deck.registered ? (
                                    <KeyButton
                                        href={"https://www.keyforgegame.com/deck-details/" + keyforgeId}
                                        color={"primary"}
                                    >
                                        Master Vault
                                    </KeyButton>
                                ) : null}
                                {!fullVersion ? (
                                    <KeyLink
                                        to={Routes.deckPage(keyforgeId)}
                                        noStyle={true}
                                    >
                                        <KeyButton color={"primary"}>View Deck</KeyButton>
                                    </KeyLink>
                                ) : null}
                                <CardsForDeck style={{marginRight: spacing(1)}} cards={deck.searchResultCards} deckName={deck.name}/>
                                <MyDecksButton deck={deck}/>
                                <div style={{flexGrow: 1}}/>
                                <div style={{marginRight: spacing(1)}}>
                                    <WishlistDeck deckName={name} deckId={id} wishlistCount={wishlistCount}/>
                                </div>
                                <div style={{marginRight: spacing(1)}}>
                                    <FunnyDeck deckName={name} deckId={id} funnyCount={funnyCount}/>
                                </div>
                            </CardActions>
                        )}
                    </div>
                    {keyLocalStorage.displayOldDeckView || compact ? null : (
                        <SideBarInfo deck={deck}/>
                    )}
                </div>
            </KeyCard>
        )
    }
}

const SideBarInfo = (props: { deck: Deck }) => {
    const {deck} = props
    const {searchResultCards} = deck
    const aercInfos = [
        {
            icon: <Typography variant={"h5"} color={"primary"}>A</Typography>,
            info: deck.amberControl,
            tooltip: <CardsWithAerc title={"Aember Control"} accessor={card => card!.extraCardInfo!.amberControl} cards={searchResultCards}/>
        },
        {
            icon: <Typography variant={"h5"} color={"primary"}>E</Typography>,
            info: deck.expectedAmber,
            tooltip: <CardsWithAerc title={"Expected Aember"} accessor={card => card!.extraCardInfo!.expectedAmber} cards={searchResultCards}/>
        },
        {
            icon: <Typography variant={"h5"} color={"primary"}>R</Typography>,
            info: deck.artifactControl,
            tooltip: <CardsWithAerc title={"Artifact Control"} accessor={card => card!.extraCardInfo!.artifactControl} cards={searchResultCards}/>
        },
        {
            icon: <Typography variant={"h5"} color={"primary"}>C</Typography>,
            info: deck.creatureControl,
            tooltip: <CardsWithAerc title={"Creature Control"} accessor={card => card!.extraCardInfo!.creatureControl} cards={searchResultCards}/>
        },
        {
            icon: <Typography variant={"h5"} color={"primary"}>D</Typography>,
            info: deck.deckManipulation,
            tooltip: <CardsWithAerc title={"Deck Manipulation"} accessor={card => card!.extraCardInfo!.deckManipulation} cards={searchResultCards}/>
        },
        {
            icon: <Typography variant={"h5"} color={"primary"}>P</Typography>,
            info: deck.effectivePower / 10,
            tooltip: (
                <CardsWithAerc
                    title={"Effective Creature Power"}
                    accessor={card => {
                        const effPower = card!.effectivePower
                        if (effPower == null) {
                            return 0
                        }
                        return effPower
                    }}
                    cards={searchResultCards}
                />
            )
        }
    ]
    const extraInfos = [
        {
            icon: <AmberIcon/>,
            info: deck.rawAmber,
            tooltip: "Bonus Aember"
        },
        {
            icon: <KeyCheatIcon/>,
            info: deck.keyCheatCount,
            tooltip: "Key Cheat Cards"
        },
        {
            icon: <DrawIcon/>,
            info: deck.cardDrawCount,
            tooltip: "Extra Draw Cards"
        },
        {
            icon: <ArchiveIcon/>,
            info: deck.cardArchiveCount,
            tooltip: "Archive Cards"
        }
    ]

    return (
        <div style={{padding: spacing(2), paddingTop: 0, paddingBottom: 0, backgroundColor: "#DFDFDF"}}>
            <div style={{display: "flex", justifyContent: "center"}}>
                <IconButton onClick={keyLocalStorage.toggleDisplayOldDeckView}>
                    <ExpandLess fontSize={"small"}/>
                </IconButton>
            </div>
            <InfoIconList values={aercInfos}/>
            <Divider/>
            <Tooltip title={"Total AERC Score (rounded)"}>
                <div style={{display: "flex", alignItems: "flex-end", marginBottom: spacing(2)}}>
                    <Typography variant={"h5"} style={{marginRight: spacing(1)}}>{Math.round(deck.aercScore)}</Typography>
                    <p style={{fontFamily: TextConfig.TITLE, fontSize: 16, margin: 0, marginBottom: 4}}>AERC</p>
                </div>
            </Tooltip>
            <InfoIconList values={extraInfos}/>
        </div>
    )
}

const DeckViewTopContents = (props: { deck: Deck, compact: boolean }) => {
    const {deck, compact} = props
    const {houses} = deck
    if (compact) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <HouseBanner houses={houses} size={48} vertical={true}/>
                    <DeckScoreView deck={deck} style={{marginLeft: spacing(6)}}/>
                </div>
                <AercScoreView hasAerc={deck} style={{marginTop: spacing(2)}} includeTotal={true}/>
            </div>
        )
    } else {
        return (
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: spacing(2),
            }}>
                <div style={{flexGrow: 1}}>
                    <HouseBanner houses={houses} size={keyLocalStorage.displayOldDeckView ? 64 : 72}/>
                    {keyLocalStorage.displayOldDeckView ? (
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <AercScoreView hasAerc={deck} style={{marginTop: spacing(1)}} includeTotal={true}/>
                        </div>
                    ) : (
                        <OrganizedPlayStats deck={deck}/>
                    )}
                </div>
                <DeckScoreView deck={deck} style={compact ? {alignItems: "flex-end"} : undefined}/>
            </div>
        )
    }
}

const DisplayAllCardsByHouse = (props: { deck: Deck }) => {
    const cardsByHouse = DeckUtils.cardsInHouses(props.deck)

    if (screenStore.screenSizeXs()) {
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
                <DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse} compact={true}/>
            ))}
        </div>
    )
}

const DisplayCardsInHouse = (props: { house: House, cards: KCard[], disableTextSelection?: boolean, compact?: boolean }) => (
    <List>
        {houseValues.get(props.house)!.title}
        <Divider style={{marginTop: 4}}/>
        {props.compact ?
            (
                <div style={{display: "flex"}}>
                    <div style={{marginRight: spacing(1)}}>
                        {props.cards.slice(0, 6).map((card, idx) => (<CardAsLine key={idx} card={card} width={144} marginTop={4}/>))}
                    </div>
                    <div>
                        {props.cards.slice(6).map((card, idx) => (<CardAsLine key={idx} card={card} width={144} marginTop={4}/>))}
                    </div>
                </div>
            )
            :
            props.cards.map((card, idx) => (<CardAsLine key={idx} card={card} width={160} marginTop={4}/>))
        }
    </List>
)
