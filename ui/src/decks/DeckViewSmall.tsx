import { Card, Collapse, Tooltip } from "@material-ui/core"
import CardActions from "@material-ui/core/CardActions/CardActions"
import CardContent from "@material-ui/core/CardContent/CardContent"
import Divider from "@material-ui/core/Divider/Divider"
import List from "@material-ui/core/List/List"
import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { AercForCombos } from "../aerc/AercForCombos"
import { AercViewForDeck, AercViewType } from "../aerc/views/AercViews"
import { deckListingStore } from "../auctions/DeckListingStore"
import { cardStore } from "../cards/CardStore"
import { CardAsLine } from "../cards/views/CardAsLine"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { ExpansionIcon } from "../expansions/ExpansionIcon"
import { activeExpansions, expansionInfoMap } from "../expansions/Expansions"
import { DeckListingStatus } from "../generated-src/DeckListingStatus"
import { DeckSaleInfo } from "../generated-src/DeckSaleInfo"
import { House } from "../generated-src/House"
import { SimpleCard } from "../generated-src/SimpleCard"
import { AuctionDeckIcon } from "../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../generic/icons/TradeDeckIcon"
import { KeyCard } from "../generic/KeyCard"
import { HouseBanner } from "../houses/HouseBanner"
import { HouseLabel } from "../houses/HouseUtils"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { InlineDeckNote } from "../notes/DeckNote"
import { DeckTagsView } from "../tags/DeckTagsView"
import { screenStore } from "../ui/ScreenStore"
import { OwnersList } from "../userdeck/OwnersList"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { FavoriteDeck } from "./buttons/FavoriteDeck"
import { FunnyDeck } from "./buttons/FunnyDeck"
import { MoreDeckActions } from "./buttons/MoreDeckActions"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { DeckScoreView } from "./DeckScoreView"
import { DeckSearchResult } from "./models/DeckSearchResult"
import { OrganizedPlayStats } from "./OrganizedPlayStats"
import { DeckOwnershipButton } from "./ownership/DeckOwnershipButton"
import { ForSaleView } from "./sales/ForSaleView"

interface DeckViewSmallProps {
    deck: DeckSearchResult
    saleInfo?: DeckSaleInfo[]
    fullVersion?: boolean
    hideActions?: boolean
    style?: React.CSSProperties
    fake?: boolean
}

@observer
export class DeckViewSmall extends React.Component<DeckViewSmallProps> {
    render() {

        if (!cardStore.cardsLoaded) {
            return null
        }

        const {deck, saleInfo, fullVersion, hideActions, style} = this.props
        const {id, keyforgeId, name, wishlistCount, funnyCount, owners} = deck

        const compact = screenStore.smallDeckView()

        const width = screenStore.deckWidth(!!saleInfo)
        const height = screenStore.deckHeight()
        const displaySalesSeparately = screenStore.displayDeckSaleInfoSeparately()

        let saleInfoView
        if (saleInfo) {
            saleInfoView =
                <ForSaleView deckId={id} saleInfo={saleInfo} deckName={name} keyforgeId={keyforgeId} height={displaySalesSeparately ? undefined : height}/>
        }

        const viewNotes = !hideActions && keyLocalStorage.genericStorage.viewNotes
        const viewTags = !hideActions && keyLocalStorage.genericStorage.viewTags

        return (
            <div>
                <KeyCard
                    style={{
                        width,
                        margin: spacing(2),
                        ...style
                    }}
                    topContents={<DeckViewTopContents deck={deck} compact={compact}/>}
                    rightContents={!displaySalesSeparately && saleInfoView}
                    id={deck.keyforgeId}
                >
                    {compact && activeExpansions.includes(deck.expansion) && (
                        <AercViewForDeck deck={deck} type={AercViewType.MOBILE_DECK}/>
                    )}
                    <div style={{display: "flex"}}>
                        <div style={{flexGrow: 1}}>
                            <CardContent style={{paddingBottom: 0, width: compact ? undefined : 544}}>
                                <KeyLink
                                    to={Routes.deckPage(keyforgeId)}
                                    disabled={fullVersion}
                                    noStyle={true}
                                >
                                    <div style={{maxWidth: width - spacing(6)}}>
                                        <Typography variant={"h5"}>{name}</Typography>
                                    </div>
                                </KeyLink>
                                <DisplayAllCardsByHouse deck={deck} compact={compact}/>
                                <OwnersList owners={owners}/>
                                <Collapse in={viewTags}>
                                    <DeckTagsView deckId={deck.id}/>
                                </Collapse>
                                <Collapse in={viewNotes}>
                                    <InlineDeckNote id={deck.id}/>
                                </Collapse>
                            </CardContent>
                            {hideActions ? null : (
                                <CardActions style={{flexWrap: "wrap", padding: spacing(1)}}>
                                    {fullVersion && !compact ? (
                                        <KeyButton
                                            href={"https://www.keyforgegame.com/deck-details/" + keyforgeId}
                                            color={"primary"}
                                        >
                                            MV
                                        </KeyButton>
                                    ) : null}
                                    {!fullVersion ? (
                                        <KeyLink
                                            to={Routes.deckPage(keyforgeId)}
                                            noStyle={true}
                                        >
                                            <KeyButton color={"primary"}>View</KeyButton>
                                        </KeyLink>
                                    ) : null}
                                    {compact ? null : (<MyDecksButton deck={deck}/>)}
                                    <div style={{flexGrow: 1, margin: 0}}/>
                                    <div>
                                        <FavoriteDeck deckName={name} deckId={id} favoriteCount={wishlistCount ?? 0}/>
                                    </div>
                                    <div>
                                        <FunnyDeck deckName={name} deckId={id} funnyCount={funnyCount ?? 0}/>
                                    </div>
                                    <DeckOwnershipButton deckName={name} deckId={id} hasVerification={deck.hasOwnershipVerification}/>
                                    <MoreDeckActions deck={deck} compact={compact}/>
                                </CardActions>
                            )}
                        </div>
                        {!compact && activeExpansions.includes(deck.expansion) && <AercViewForDeck deck={deck} type={AercViewType.DECK}/>}
                    </div>
                </KeyCard>
                {displaySalesSeparately && saleInfo && (
                    <Card
                        style={{
                            width: width > 400 ? 400 : width,
                            margin: spacing(2),
                        }}
                    >
                        {saleInfoView}
                    </Card>
                )}
            </div>
        )
    }
}

const DeckViewTopContents = observer((props: { deck: DeckSearchResult, compact: boolean }) => {
    const {deck, compact} = props
    const {housesAndCards, id, forAuction, forSale, forTrade, expansion} = deck
    const houses = housesAndCards.map(house => house.house)

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
        displayForAuction = forAuction == true
        if (!displayForAuction) {
            displayForSale = forSale == true
            displayForTrade = forTrade == true
        }
    }
    const displaySaleIcons = (displayForAuction || displayForSale || displayForTrade)
    let saleIcons
    if (displaySaleIcons) {
        saleIcons = (
            <>
                {displayForAuction && (
                    <Tooltip title={"On auction"}>
                        <div style={{display: "flex", justifyContent: "center"}}><AuctionDeckIcon height={40}/></div>
                    </Tooltip>
                )}
                {displayForSale && (
                    <Tooltip title={"For sale"}>
                        <div style={{display: "flex", justifyContent: "center"}}><SellDeckIcon height={40}/></div>
                    </Tooltip>
                )}
                {displayForTrade && (
                    <Tooltip title={"For trade"}>
                        <div style={{display: "flex", justifyContent: "center"}}><TradeDeckIcon height={40}/></div>
                    </Tooltip>
                )}
            </>
        )
    }
    if (compact) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginRight: spacing(2),
                }}
            >
                <div style={{display: "grid", gap: spacing(2)}}>
                    {saleIcons && (
                        <div style={{display: "grid", gap: spacing(1), gridAutoFlow: "column", alignItems: "end"}}>
                            {saleIcons}
                        </div>
                    )}
                    <Tooltip title={expansionInfoMap.get(expansion)!.name}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: displaySaleIcons ? undefined : "center"}}>
                            <ExpansionIcon expansion={expansion} size={40} white={true}/>
                        </div>
                    </Tooltip>
                </div>
                <DeckScoreView deck={deck} style={{marginLeft: spacing(4)}}/>
            </div>
        )
    } else {
        return (
            <div style={{
                display: "flex",
                alignItems: "center"
            }}>
                <div style={{display: "grid", gap: spacing(2)}}>
                    {saleIcons}
                </div>
                <div style={{flexGrow: 1}}>
                    <HouseBanner houses={houses} expansion={deck.expansion}/>
                    <OrganizedPlayStats deck={deck}/>
                </div>
                <DeckScoreView deck={deck}/>
            </div>
        )
    }
})

const DisplayAllCardsByHouse = observer((props: { deck: DeckSearchResult, compact: boolean }) => {
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
})

const DisplayAllCardsByHouseCompact = observer((props: { deck: DeckSearchResult }) => {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            {props.deck.housesAndCards.map((cardsForHouse) => (
                <DisplayCardsInHouse key={cardsForHouse.house} {...cardsForHouse} compact={true} deck={props.deck}/>
            ))}
        </div>
    )
})

const smallDeckViewCardLineWidth = 144

const DisplayCardsInHouse = observer((props: { house: House, cards: SimpleCard[], compact?: boolean, deck: DeckSearchResult }) => {
    const {house, deck, cards, compact} = props
    const deckExpansion = deck.expansion
    return (
        <List>
            <AercForCombos combos={deck.synergyDetails?.filter(combo => combo.house === house)}>
                <HouseLabel house={house} title={true}/>
            </AercForCombos>
            <Divider style={{marginTop: 4}}/>
            {compact ?
                (
                    <div style={{display: "flex"}}>
                        <div style={{marginRight: spacing(1)}}>
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
})
