import { observer } from "mobx-react"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { DeckType } from "../../generated-src/DeckType"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { deckListingStore } from "../../auctions/DeckListingStore"
import { DeckListingStatus } from "../../generated-src/DeckListingStatus"
import { Box, Tooltip } from "@material-ui/core"
import { AuctionDeckIcon } from "../../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { spacing } from "../../config/MuiConfig"
import { expansionInfoMap } from "../../expansions/Expansions"
import { ExpansionIcon } from "../../expansions/ExpansionIcon"
import { DeckScoreView } from "../DeckScoreView"
import { OrganizedPlayStats } from "../OrganizedPlayStats"
import { EnhancementsInDeck } from "../EnhancementsInDeck"
import Typography from "@material-ui/core/Typography/Typography"
import { amber } from "@material-ui/core/colors"
import { HouseBanner } from "../../houses/HouseBanner"
import * as React from "react"
import { DeckViewDeckName } from "./DeckViewDeckName"
import { DeckTokenView } from "./DeckTokenView"
import { DeckSaleIcons } from "./DeckSaleIcons"
import { Expansion } from "../../generated-src/Expansion"
import { DeckAllianceText } from "./DeckAllianceText"
import { CardAsLine } from "../../cards/views/CardAsLine"

interface BannerProps {
    deck: DeckSearchResult
    fullVersion: boolean
    fake: boolean
}

export const DeckTopBanner = (props: BannerProps & { compact: boolean }) => {
    if (props.compact) {
        return <DeckTopBannerCompact  {...props} />
    }

    return <DeckTopBannerFull {...props} />
}

const DeckTopBannerFull = (props: BannerProps) => {
    const {deck, fullVersion, fake} = props
    const token = deck.tokenInfo

    let specialCard
    if (token != null) {
        specialCard = (
            <CardAsLine
                card={{cardTitle: token.name}}
                deck={deck}
                width={100}
                img={true}
                cardActualHouse={token.house}
            />
        )
    } else if (deck.expansion === Expansion.DARK_TIDINGS) {
        specialCard = (<DeckTokenView tokenName={"Tide Card"}/>)
    }

    return (
        <>
            {specialCard != null && (
                <Box>
                    {specialCard}
                </Box>
            )}
            <Box flexGrow={1} display={"flex"} flexDirection={"column"} ml={2}>
                <Box flexGrow={1}/>
                <Box display={"flex"} mb={2} alignItems={"flexEnd"} flexGrow={1}>
                    <ExpansionIcon expansion={deck.expansion} size={40} white={true} style={{marginRight: spacing(1)}}/>
                    <DeckSaleIcons deck={deck}/>
                    <Box flexGrow={1}/>
                    <Box ml={1}>
                        <OrganizedPlayStats deck={deck}/>
                    </Box>
                </Box>
                <DeckAllianceText deck={deck}/>
                <Box mb={0.5}>
                    <DeckViewDeckName deck={deck} fake={fake} fullVersion={fullVersion}/>
                </Box>
            </Box>
            <Box ml={2}>
                <DeckScoreView deck={deck}/>
            </Box>
        </>
    )
}

const DeckTopBannerCompact = (props: BannerProps) => {
    const {deck, fake, fullVersion} = props
    const token = deck.tokenInfo

    let specialCard
    if (token != null) {
        specialCard = (<DeckTokenView tokenName={token.name} width={88}/>)
    }

    return (
        <Box>
            <DeckAllianceText deck={deck}/>
            <DeckViewDeckName deck={deck} fake={fake} fullVersion={fullVersion}/>
            <Box display={"flex"} alignItems={"flex-end"} mt={1}>
                <Box>
                    <DeckSaleIcons deck={deck}/>
                    <Box mt={1}>
                        {specialCard}
                    </Box>
                </Box>
                <Box flexGrow={1}/>
                <DeckScoreView deck={deck} style={{marginLeft: spacing(4)}}/>
            </Box>
        </Box>
    )
}

const deckTopClass = "deck-top-contents"

export const DeckViewTopContents = observer((props: { deck: DeckSearchResult, compact: boolean, fake?: boolean }) => {
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