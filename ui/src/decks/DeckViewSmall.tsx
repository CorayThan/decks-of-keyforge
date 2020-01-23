import { Collapse, IconButton, Tooltip } from "@material-ui/core"
import CardActions from "@material-ui/core/CardActions/CardActions"
import CardContent from "@material-ui/core/CardContent/CardContent"
import Divider from "@material-ui/core/Divider/Divider"
import List from "@material-ui/core/List/List"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography/Typography"
import { MoreVert } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCombos } from "../aerc/AercForCombos"
import { AercView } from "../aerc/AercViews"
import { DeckListingStatus } from "../auctions/DeckListingDto"
import { auctionStore } from "../auctions/DeckListingStore"
import { CardsForDeck } from "../cards/CardsForDeck"
import { CardAsLine } from "../cards/CardSimpleView"
import { KCard } from "../cards/KCard"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { activeExpansions, BackendExpansion } from "../expansions/Expansions"
import { AuctionDeckIcon } from "../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../generic/icons/TradeDeckIcon"
import { UnregisteredDeckIcon } from "../generic/icons/UnregisteredDeckIcon"
import { KeyCard } from "../generic/KeyCard"
import { House, HouseLabel } from "../houses/House"
import { HouseBanner } from "../houses/HouseBanner"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { DeckNote, InlineDeckNote } from "../userdeck/DeckNote"
import { OwnersButton } from "../userdeck/OwnersButton"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { DeckActionClickable } from "./buttons/DeckActionClickable"
import { FunnyDeck } from "./buttons/FunnyDeck"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { WishlistDeck } from "./buttons/WishlistDeck"
import { Deck, DeckUtils } from "./Deck"
import { DeckScoreView } from "./DeckScoreView"
import { deckStore } from "./DeckStore"
import { OrganizedPlayStats } from "./OrganizedPlayStats"

interface DeckViewSmallProps {
    deck: Deck
    fullVersion?: boolean
    hideActions?: boolean
    style?: React.CSSProperties
}

export const standardDeckViewWidth = 704

@observer
export class DeckViewSmall extends React.Component<DeckViewSmallProps> {
    render() {
        const {deck, fullVersion, hideActions, style} = this.props
        const {
            id, keyforgeId, name, wishlistCount, funnyCount,
            forSale, forTrade, forAuction, registered, owners
        } = deck
        const saleInfo = auctionStore.listingInfoForDeck(id)
        let userDeckForSale = false
        let userDeckForTrade = false
        let userDeckForAuction = false
        if (saleInfo) {
            userDeckForSale = true
            userDeckForTrade = saleInfo.forTrade
            userDeckForAuction = saleInfo.status === DeckListingStatus.ACTIVE
        }

        const compact = screenStore.smallDeckView()

        let width
        if (compact) {
            width = 328
        } else {
            width = standardDeckViewWidth
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
                id={deck.keyforgeId}
            >
                {compact && activeExpansions.includes(deck.expansion) && (
                    <AercView deck={deck} horizontal={true} style={{marginLeft: spacing(1)}}/>
                )}
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
                                {!forAuction && (forSale || userDeckForSale) ? (
                                    <Tooltip title={"For sale"}>
                                        <div style={{marginLeft: spacing(1)}}><SellDeckIcon/></div>
                                    </Tooltip>
                                ) : null}
                                {!forAuction && (forTrade || userDeckForTrade) ? (
                                    <Tooltip title={"For trade"}>
                                        <div style={{marginLeft: spacing(1)}}><TradeDeckIcon/></div>
                                    </Tooltip>
                                ) : null}
                                {forAuction || userDeckForAuction ? (
                                    <Tooltip title={"On auction"}>
                                        <div style={{marginLeft: spacing(1)}}><AuctionDeckIcon/></div>
                                    </Tooltip>
                                ) : null}
                            </div>
                            <DisplayAllCardsByHouse deck={deck}/>
                            <Collapse in={userDeckStore.viewNotes}>
                                <InlineDeckNote id={deck.id}/>
                            </Collapse>
                        </CardContent>
                        {hideActions ? null : (
                            <CardActions style={{flexWrap: "wrap", padding: spacing(1)}}>
                                {fullVersion && !compact && deck.registered ? (
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
                                {compact ? null : (<MyDecksButton deck={deck}/>)}
                                <OwnersButton owners={owners}/>
                                <div style={{flexGrow: 1}}/>
                                <div style={{marginRight: spacing(1)}}>
                                    <WishlistDeck deckName={name} deckId={id} wishlistCount={wishlistCount}/>
                                </div>
                                <div style={{marginRight: spacing(1)}}>
                                    <FunnyDeck deckName={name} deckId={id} funnyCount={funnyCount}/>
                                </div>
                                <MoreDeckActions deck={deck} compact={compact}/>
                            </CardActions>
                        )}
                    </div>
                    {!compact && activeExpansions.includes(deck.expansion) && <AercView deck={deck}/>}
                </div>
            </KeyCard>
        )
    }
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
                    <DeckScoreView deck={{...deck, ...deck.synergies!}} style={{marginLeft: spacing(6)}}/>
                </div>
                <OrganizedPlayStats deck={deck} style={{marginTop: spacing(2)}}/>
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
                    <HouseBanner houses={houses} size={72}/>
                    <OrganizedPlayStats deck={deck}/>
                </div>
                <DeckScoreView deck={{...deck, ...deck.synergies!}}/>
            </div>
        )
    }
}

const DisplayAllCardsByHouse = (props: { deck: Deck }) => {
    const cardsByHouse = DeckUtils.cardsInHouses(props.deck)

    if (screenStore.smallDeckView()) {
        return <DisplayAllCardsByHouseCompact {...props}/>
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
            {cardsByHouse.map((cardsForHouse) => (
                <DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse} deckExpansion={props.deck.expansion} deck={props.deck}/>))}
        </div>
    )
}

const DisplayAllCardsByHouseCompact = (props: { deck: Deck }) => {
    const cardsByHouse = DeckUtils.cardsInHouses(props.deck)
    const deckExpansion = props.deck.expansion
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            {cardsByHouse.map((cardsForHouse) => (
                <DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse} compact={true} deckExpansion={deckExpansion} deck={props.deck}/>
            ))}
        </div>
    )
}

const DisplayCardsInHouse = (props: { house: House, cards: KCard[], deckExpansion: BackendExpansion, compact?: boolean, deck: Deck }) => {
    const {house, deck, cards, deckExpansion, compact} = props
    return (
        <List>
            <AercForCombos combos={deck.synergies?.synergyCombos.filter(combo => combo.house === house)}>
                <HouseLabel house={house} title={true}/>
            </AercForCombos>
            <Divider style={{marginTop: 4}}/>
            {compact ?
                (
                    <div style={{display: "flex"}}>
                        <div style={{marginRight: spacing(1)}}>
                            {cards.slice(0, 6).map((card, idx) => (
                                <CardAsLine key={idx} card={card} width={144} marginTop={4} deckExpansion={deckExpansion} deck={deck}/>))}
                        </div>
                        <div>
                            {cards.slice(6).map((card, idx) => (
                                <CardAsLine key={idx} card={card} width={144} marginTop={4} deckExpansion={deckExpansion} deck={deck}/>))}
                        </div>
                    </div>
                )
                :
                cards.map((card, idx) => (<CardAsLine key={idx} card={card} width={160} marginTop={4} deckExpansion={deckExpansion} deck={deck}/>))
            }
        </List>
    )
}

export const MoreDeckActions = (props: { deck: Deck, compact: boolean }) => {
    const {deck, compact} = props

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <IconButton aria-controls="more-deck-actions-menu" aria-haspopup="true" onClick={handleClick}>
                <MoreVert/>
            </IconButton>
            <Menu
                id={"more-deck-actions-menu"}
                anchorEl={anchorEl}
                keepMounted={true}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {compact ? <MyDecksButton deck={deck} menuItem={true}/> : null}
                <CardsForDeck cards={deck.searchResultCards} deckName={deck.name} onClick={handleClose}/>
                <DeckNote id={deck.id} name={deck.name} onClick={handleClose}/>
                <MenuItem
                    component={"a"}
                    href={"https://www.keyforgegame.com/deck-details/" + deck.keyforgeId}
                >
                    Master Vault
                </MenuItem>
                {userStore.loggedIn() && (
                    <DeckActionClickable
                        onClick={() => {
                            handleClose()
                            deckStore.refreshDeckScores(deck.keyforgeId)
                        }}
                        menuItem={true}
                    >
                        Refresh MV Wins
                    </DeckActionClickable>
                )}
            </Menu>
        </>
    )
}
