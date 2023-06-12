import { Box, Button, Card, Collapse, Tooltip } from "@material-ui/core"
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
import { displaySas, expansionInfoMap } from "../expansions/Expansions"
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
import { KeyLink } from "../mui-restyled/KeyLink"
import { InlineDeckNote } from "../notes/DeckNote"
import { DeckTagsView } from "../tags/DeckTagsView"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { OwnersList } from "../userdeck/OwnersList"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { CompareDeckButton } from "./buttons/CompareDeckButton"
import { EvilTwinButton } from "./buttons/EvilTwinButton"
import { FavoriteDeck } from "./buttons/FavoriteDeck"
import { FunnyDeck } from "./buttons/FunnyDeck"
import { MoreDeckActions } from "./buttons/MoreDeckActions"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { DeckScoreView } from "./DeckScoreView"
import { EnhancementsInDeck } from "./EnhancementsInDeck"
import { DeckSearchResult } from "./models/DeckSearchResult"
import { OrganizedPlayStats } from "./OrganizedPlayStats"
import { DeckOwnershipButton } from "./ownership/DeckOwnershipButton"
import { ForSaleView } from "./sales/ForSaleView"
import { DeleteTheoreticalDeckButton } from "../importdeck/theoretical/DeleteTheoreticalDeckButton"
import { Expansion } from "../generated-src/Expansion"
import { DeckType } from "../generated-src/DeckType"
import { MiniDeckLink } from "./buttons/MiniDeckLink"
import { amber } from "@material-ui/core/colors"

interface DeckViewSmallProps {
    deck: DeckSearchResult
    saleInfo?: DeckSaleInfo[]
    fullVersion?: boolean
    hideActions?: boolean
    style?: React.CSSProperties
    fake?: boolean
    margin?: number
}

@observer
export class DeckViewSmall extends React.Component<DeckViewSmallProps> {
    render() {

        if (!cardStore.cardsLoaded) {
            return null
        }

        const {deck, saleInfo, fullVersion, hideActions, style, fake, margin} = this.props
        const {id, keyforgeId, name, wishlistCount, funnyCount, owners, twinId, tokenInfo} = deck
        const alliance = deck.deckType === DeckType.ALLIANCE

        const compact = screenStore.smallDeckView()

        const width = screenStore.deckWidth(!!saleInfo)
        const height = screenStore.deckHeight()
        const displaySalesSeparately = screenStore.displayDeckSaleInfoSeparately()

        let saleInfoView
        if (saleInfo) {
            saleInfoView =
                <ForSaleView deckId={id} saleInfo={saleInfo} deckName={name} keyforgeId={keyforgeId}
                             height={displaySalesSeparately ? undefined : height}/>
        }

        const viewNotes = !hideActions && keyLocalStorage.genericStorage.viewNotes && !alliance
        const viewTags = !hideActions && keyLocalStorage.genericStorage.viewTags && !alliance
        let link
        if (alliance) {
            link = Routes.allianceDeckPage(keyforgeId)
        } else if (fake) {
            link = Routes.theoreticalDeckPage(keyforgeId)
        } else {
            link = Routes.deckPage(keyforgeId)
        }

        let ownersFiltered = owners
        if (fullVersion) {
            ownersFiltered = owners?.filter(owner => owner != userStore.username)
        }

        return (
            <div>
                <KeyCard
                    style={{
                        width,
                        margin: margin != null ? margin : spacing(2),
                        ...style
                    }}
                    topContents={<DeckViewTopContents deck={deck} compact={compact} fake={fake}/>}
                    rightContents={!displaySalesSeparately && saleInfoView}
                    id={deck.keyforgeId}
                >
                    {compact && displaySas(deck.expansion) && (
                        <AercViewForDeck deck={deck} type={AercViewType.MOBILE_DECK}/>
                    )}
                    <div style={{display: "flex"}}>
                        <div style={{flexGrow: 1}}>
                            <CardContent style={{paddingBottom: 0, width: compact ? undefined : 544}}>
                                <KeyLink
                                    to={link}
                                    disabled={fullVersion}
                                    noStyle={true}
                                >
                                    <Box style={{maxWidth: width - spacing(6)}}>
                                        <Typography
                                            variant={"h5"}
                                            style={{fontSize: name.length > 48 ? 18 : undefined}}
                                        >
                                            {name}
                                        </Typography>
                                    </Box>
                                </KeyLink>
                                {tokenInfo && (
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography variant={"subtitle1"}>Token: </Typography>
                                        <Box mt={0.25}>
                                            <CardAsLine
                                                card={{cardTitle: tokenInfo.name}}
                                                cardActualHouse={tokenInfo.house}
                                                hideRarity={true}
                                            />
                                        </Box>
                                    </Box>
                                )}
                                <DisplayAllCardsByHouse deck={deck} compact={compact} fake={!!fake}/>
                                <OwnersList owners={ownersFiltered}/>
                                <Collapse in={viewTags}>
                                    <DeckTagsView deckId={deck.id}/>
                                </Collapse>
                                <Collapse in={viewNotes}>
                                    <InlineDeckNote id={deck.id}/>
                                </Collapse>
                            </CardContent>
                            {!hideActions && !fake && (
                                <CardActions style={{flexWrap: "wrap", padding: spacing(1)}}>
                                    {compact ? null : (<CompareDeckButton deck={deck}/>)}
                                    {compact ? null : (<MyDecksButton deck={deck}/>)}
                                    <div style={{flexGrow: 1, margin: 0}}/>
                                    {!alliance && (
                                        <>
                                            <div>
                                                <FavoriteDeck deckName={name} deckId={id}
                                                              favoriteCount={wishlistCount ?? 0}/>
                                            </div>
                                            <div>
                                                <FunnyDeck deckName={name} deckId={id} funnyCount={funnyCount ?? 0}/>
                                            </div>
                                            <DeckOwnershipButton
                                                deck={deck}
                                                hasVerification={deck.hasOwnershipVerification}
                                            />
                                            <EvilTwinButton twinId={twinId}/>
                                        </>
                                    )}
                                    <MoreDeckActions deck={deck} compact={compact}/>
                                </CardActions>
                            )}
                            {fake && (
                                <CardActions style={{flexWrap: "wrap", padding: spacing(1)}}>
                                    {!compact && !fullVersion && (
                                        <DeleteTheoreticalDeckButton deckId={deck.keyforgeId} deckName={deck.name}/>)}
                                </CardActions>
                            )}
                        </div>
                        {!compact && <AercViewForDeck deck={deck} type={AercViewType.DECK}/>}
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

const deckTopClass = "deck-top-contents"

const DeckViewTopContents = observer((props: { deck: DeckSearchResult, compact: boolean, fake?: boolean }) => {
    const {deck, compact, fake} = props
    const alliance = deck.deckType === DeckType.ALLIANCE
    const {housesAndCards, id, forAuction, forSale, forTrade, expansion} = deck
    const houses = housesAndCards.map(house => house.house)

    let displayForAuction = false
    let displayForSale = false
    let displayForTrade = false

    if (userDeckStore.ownedByMe(deck)) {
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
                        <div style={{display: "flex", justifyContent: "center"}}><AuctionDeckIcon height={36}/></div>
                    </Tooltip>
                )}
                {displayForSale && (
                    <Tooltip title={"For sale"}>
                        <div style={{display: "flex", justifyContent: "center"}}><SellDeckIcon height={36}/></div>
                    </Tooltip>
                )}
                {displayForTrade && (
                    <Tooltip title={"For trade"}>
                        <div style={{display: "flex", justifyContent: "center"}}><TradeDeckIcon height={36}/></div>
                    </Tooltip>
                )}
            </>
        )
    }
    if (compact) {
        return (
            <Box
                display={"grid"}
                gridGap={spacing(1)}
                flexGrow={1}
                alignItems={"center"}
            >
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    className={deckTopClass}
                >
                    <Box
                        display={"grid"}
                        gridGap={spacing(2)}
                    >
                        {saleIcons && (
                            <Box
                                display={"grid"}
                                gridGap={spacing(2)}
                                gridAutoFlow={"column"}
                            >
                                {saleIcons}
                            </Box>
                        )}
                        {!fake && (
                            <Tooltip title={expansionInfoMap.get(expansion)!.name}>
                                <div>
                                    <ExpansionIcon expansion={expansion} size={40} white={true}/>
                                </div>
                            </Tooltip>
                        )}
                    </Box>
                    <DeckScoreView deck={deck} style={{marginLeft: spacing(4)}}/>
                </Box>
                <OrganizedPlayStats deck={deck}/>
                <EnhancementsInDeck deck={deck}/>
            </Box>
        )
    } else {
        const invalidAlliance = deck.validAlliance === false
        return (
            <Box
                display={"flex"}
                className={deckTopClass}
            >
                <Box display={"flex"} flexDirection={"column"} flexGrow={1} justifyContent={"center"}>
                    {alliance && (
                        <Box display={"flex"} mb={0.5}>
                            {deck.validAlliance === false && (
                                <Typography
                                    variant={"h5"}
                                    color={"secondary"}
                                    style={{fontSize: 18, marginRight: spacing(1), fontStyle: "italic"}}
                                >

                                </Typography>
                            )}
                            <Typography
                                variant={"h5"}
                                style={{
                                    fontSize: 18,
                                    marginRight: spacing(1),
                                    fontStyle: "italic",
                                    color: invalidAlliance ? amber["400"] : "#FFFFFF"
                                }}
                            >
                                {invalidAlliance ? "Invalid " : ""}Alliance Deck
                            </Typography>
                        </Box>
                    )}
                    <Box
                        display={"grid"}
                        gridGap={spacing(1)}
                        flexGrow={1}
                        alignItems={"center"}
                    >
                        <HouseBanner houses={houses} expansion={fake ? undefined : deck.expansion} extras={saleIcons}/>
                        <OrganizedPlayStats deck={deck}/>
                        <Box display={"flex"} justifyContent={"center"}>
                            <EnhancementsInDeck deck={deck} style={{marginLeft: spacing(4)}}/>
                        </Box>
                    </Box>
                </Box>
                <DeckScoreView deck={deck}/>
            </Box>
        )
    }
})

const DisplayAllCardsByHouse = observer((props: { deck: DeckSearchResult, compact: boolean, fake: boolean }) => {
    const {deck, compact, fake} = props

    if (compact) {
        return <DisplayAllCardsByHouseCompact
            deck={deck}
            fake={fake}
        />
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
            {deck.housesAndCards.map((cardsForHouse) => (
                <DisplayCardsInHouse
                    key={cardsForHouse.house}
                    {...cardsForHouse}
                    deck={props.deck}
                    fake={fake}
                />
            ))}
        </div>
    )
})

const DisplayAllCardsByHouseCompact = observer((props: { deck: DeckSearchResult, fake: boolean }) => {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            {props.deck.housesAndCards.map((cardsForHouse) => (
                <DisplayCardsInHouse
                    key={cardsForHouse.house} {...cardsForHouse}
                    compact={true}
                    deck={props.deck}
                    fake={props.fake}
                />
            ))}
        </div>
    )
})

const smallDeckViewCardLineWidth = 144

const DisplayCardsInHouse = observer((props: { house: House, cards: SimpleCard[], compact?: boolean, deck: DeckSearchResult, fake: boolean }) => {
    const {
        house,
        deck,
        cards,
        compact,
        fake,
    } = props
    const alliance = deck.deckType === DeckType.ALLIANCE
    const deckExpansion = deck.expansion

    let allianceHouse
    if (deck.allianceHouses != null) {
        allianceHouse = deck.allianceHouses.find(houseInfo => houseInfo.house === house)
    }

    return (
        <List>
            <Box display={"flex"} alignItems={compact ? "center" : undefined}
                 flexDirection={compact ? undefined : "column"}>
                <Box flexGrow={1} mb={compact ? undefined : 1}>
                    <AercForCombos combos={deck.synergyDetails?.filter(combo => combo.house === house)}>
                        <HouseLabel house={house} title={true}/>
                    </AercForCombos>
                </Box>
                {allianceHouse && (
                    <MiniDeckLink deck={allianceHouse} maxHeight={24}/>
                )}
            </Box>
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
            {keyLocalStorage.genericStorage.buildAllianceDeck && !fake && !alliance && (
                <>
                    <Divider style={{marginTop: spacing(1), marginBottom: spacing(0.5)}}/>
                    <AddHouseToAlliance deckId={deck.keyforgeId} deckName={deck.name} house={house}
                                        expansion={deck.expansion}/>
                </>
            )}
        </List>
    )
})

const AddHouseToAlliance = observer((props: { deckId: string, deckName: string, house: House, expansion: Expansion }) => {
    const {deckId, deckName, house, expansion} = props
    return (
        <Button
            onClick={() => {
                keyLocalStorage.addAllianceHouse(deckId, deckName, house, expansion)
            }}
            disabled={
                keyLocalStorage.allianceDeckHouses.length > 2 ||
                keyLocalStorage.allianceDeckHouses.find(allianceDeck => allianceDeck.house === house) != null ||
                keyLocalStorage.allianceDeckHouses.find(allianceDeck => allianceDeck.expansion !== expansion) != null
            }
        >
            Add to Alliance
        </Button>
    )
})