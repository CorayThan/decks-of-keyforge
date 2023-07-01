import React from "react"
import { Box, Tooltip } from "@material-ui/core"
import { observer } from "mobx-react"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { deckListingStore } from "../../auctions/DeckListingStore"
import { DeckListingStatus } from "../../generated-src/DeckListingStatus"
import { AuctionDeckIcon } from "../../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { spacing } from "../../config/MuiConfig"


export const DeckSaleIcons = observer((props: { deck: DeckSearchResult, style?: React.CSSProperties }) => {
    const {deck, style} = props
    const {id, forAuction, forSale, forTrade} = deck

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

    if (!displaySaleIcons) {
        return null
    }

    return (
        <Box display={"flex"} style={{gap: spacing(1), ...style}}>
            {displayForAuction && (
                <Tooltip title={"On auction"}>
                    <div><AuctionDeckIcon height={36} white={true}/></div>
                </Tooltip>
            )}
            {displayForSale && (
                <Tooltip title={"For sale"}>
                    <div><SellDeckIcon height={36} white={true}/></div>
                </Tooltip>
            )}
            {displayForTrade && (
                <Tooltip title={"For trade"}>
                    <div><TradeDeckIcon height={36} white={true}/></div>
                </Tooltip>
            )}
        </Box>
    )
})
