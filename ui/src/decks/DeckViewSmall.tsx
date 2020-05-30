import { Collapse, Tooltip } from "@material-ui/core"
import CardActions from "@material-ui/core/CardActions/CardActions"
import CardContent from "@material-ui/core/CardContent/CardContent"
import Divider from "@material-ui/core/Divider/Divider"
import List from "@material-ui/core/List/List"
import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCombos } from "../aerc/AercForCombos"
import { AercViewForDeck, AercViewType } from "../aerc/views/AercViews"
import { DeckListingStatus } from "../auctions/DeckListingDto"
import { deckListingStore } from "../auctions/DeckListingStore"
import { CardAsLine } from "../cards/views/CardAsLine"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, useGlobalStyles } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { ExpansionIcon } from "../expansions/ExpansionIcon"
import { activeExpansions, expansionInfoMap } from "../expansions/Expansions"
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
import { InlineDeckNote } from "../userdeck/DeckNote"
import { OwnersList } from "../userdeck/OwnersList"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { FunnyDeck } from "./buttons/FunnyDeck"
import { MoreDeckActions } from "./buttons/MoreDeckActions"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { WishlistDeck } from "./buttons/WishlistDeck"
import { DeckScoreView } from "./DeckScoreView"
import { DeckSearchResult } from "./models/DeckSearchResult"
import { SimpleCard } from "./models/HouseAndCards"
import { OrganizedPlayStats } from "./OrganizedPlayStats"

interface DeckViewSmallProps {
    deck: DeckSearchResult
    fullVersion?: boolean
    hideActions?: boolean
    forceNarrow?: boolean
    style?: React.CSSProperties
    fake?: boolean
}

export const standardDeckViewWidth = 704

@observer
export class DeckViewSmall extends React.Component<DeckViewSmallProps> {
    render() {
        const {deck, fullVersion, hideActions, forceNarrow, style} = this.props
        const {
            id, keyforgeId, name, wishlistCount, funnyCount,
            forSale, forTrade, forAuction, registered, owners
        } = deck
        let displayForAuction = false
        let displayForSale = false
        let displayForTrade = false

        if (userDeckStore.ownedByMe(id)) {
            const saleInfo = deckListingStore.listingInfoForDeck(id)
            if (saleInfo != null) {
                displayForAuction = saleInfo.status === DeckListingStatus.AUCTION
                if (!displayForAuction) {
                    displayForSale = true
                    displayForTrade = saleInfo.forTrade
                }
            }
        } else {
            displayForAuction = forAuction
            if (!displayForAuction) {
                displayForSale = forSale
                displayForTrade = forTrade
            }
        }

        const compact = forceNarrow || screenStore.smallDeckView()

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
                    <AercViewForDeck deck={deck} type={AercViewType.MOBILE_DECK}/>
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
                                {displayForAuction && (
                                    <Tooltip title={"On auction"}>
                                        <div style={{marginLeft: spacing(1)}}><AuctionDeckIcon/></div>
                                    </Tooltip>
                                )}
                                {displayForSale && (
                                    <Tooltip title={"For sale"}>
                                        <div style={{marginLeft: spacing(1)}}><SellDeckIcon/></div>
                                    </Tooltip>
                                )}
                                {displayForTrade && (
                                    <Tooltip title={"For trade"}>
                                        <div style={{marginLeft: spacing(1)}}><TradeDeckIcon/></div>
                                    </Tooltip>
                                )}
                            </div>
                            <DisplayAllCardsByHouse deck={deck} compact={compact}/>
                            <OwnersList owners={owners}/>
                            <Collapse in={keyLocalStorage.genericStorage.viewNotes}>
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
                                <div style={{flexGrow: 1}}/>
                                <div>
                                    <WishlistDeck deckName={name} deckId={id} wishlistCount={wishlistCount}/>
                                </div>
                                <div>
                                    <FunnyDeck deckName={name} deckId={id} funnyCount={funnyCount}/>
                                </div>
                                <MoreDeckActions deck={deck} compact={compact}/>
                            </CardActions>
                        )}
                    </div>
                    {!compact && activeExpansions.includes(deck.expansion) && <AercViewForDeck deck={deck} type={AercViewType.DECK}/>}
                </div>
            </KeyCard>
        )
    }
}

const DeckViewTopContents = (props: { deck: DeckSearchResult, compact: boolean }) => {
    const {deck, compact} = props
    const houses = deck.housesAndCards.map(house => house.house)
    if (compact) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <HouseBanner houses={houses} size={40} vertical={true}/>
                    <Tooltip title={expansionInfoMap.get(deck.expansion)!.name}>
                        <div style={{marginLeft: spacing(0.5)}}>
                            <ExpansionIcon expansion={deck.expansion} size={32} white={true}/>
                        </div>
                    </Tooltip>
                    <DeckScoreView deck={{...deck, ...deck.synergies!}} style={{marginLeft: spacing(4)}}/>
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
                    <HouseBanner houses={houses} size={72} expansion={deck.expansion}/>
                    <OrganizedPlayStats deck={deck}/>
                </div>
                <DeckScoreView deck={{...deck, ...deck.synergies!}}/>
            </div>
        )
    }
}

const DisplayAllCardsByHouse = (props: { deck: DeckSearchResult, compact: boolean }) => {
    const {deck, compact} = props
    if (compact) {
        return <DisplayAllCardsByHouseCompact deck={deck}/>
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
            {deck.housesAndCards.map((cardsForHouse) => (
                <DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse} deck={props.deck}/>))}
        </div>
    )
}

const DisplayAllCardsByHouseCompact = (props: { deck: DeckSearchResult }) => {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            {props.deck.housesAndCards.map((cardsForHouse) => (
                <DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse} compact={true} deck={props.deck}/>
            ))}
        </div>
    )
}

const smallDeckViewCardLineWidth = 144

const DisplayCardsInHouse = (props: { house: House, cards: SimpleCard[], compact?: boolean, deck: DeckSearchResult }) => {
    const globalClasses = useGlobalStyles()
    const {house, deck, cards, compact} = props
    const deckExpansion = deck.expansion
    return (
        <List>
            <AercForCombos combos={deck.synergies?.synergyCombos.filter(combo => combo.house === house)}>
                <HouseLabel house={house} title={true}/>
            </AercForCombos>
            <Divider style={{marginTop: 4}}/>
            {compact ?
                (
                    <div className={globalClasses.flex}>
                        <div className={globalClasses.marginRightSmall}>
                            {cards.slice(0, 6).map((card, idx) => (
                                <CardAsLine
                                    key={idx}
                                    card={card}
                                    cardActualHouse={house}
                                    width={smallDeckViewCardLineWidth}
                                    marginTop={4}
                                    deckExpansion={deckExpansion}
                                    deck={deck}
                                />
                            ))}
                        </div>
                        <div>
                            {cards.slice(6).map((card, idx) => (
                                <CardAsLine
                                    key={idx}
                                    card={card}
                                    cardActualHouse={house}
                                    width={smallDeckViewCardLineWidth}
                                    marginTop={4}
                                    deckExpansion={deckExpansion}
                                    deck={deck}
                                />
                            ))}
                        </div>
                    </div>
                )
                :
                cards.map((card, idx) => (
                    <CardAsLine
                        key={idx}
                        card={card}
                        cardActualHouse={house}
                        width={160}
                        marginTop={4}
                        deckExpansion={deckExpansion}
                        deck={deck}
                    />
                ))
            }
        </List>
    )
}
