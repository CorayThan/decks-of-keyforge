import React from "react"
import { Box, Tooltip } from "@material-ui/core"
import { observer } from "mobx-react"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { deckListingStore } from "../../auctions/DeckListingStore"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { spacing } from "../../config/MuiConfig"


export const DeckSaleIcons = observer((props: { deck: DeckSearchResult, style?: React.CSSProperties }) => {
    const {deck, style} = props
    const {id, forSale, forTrade} = deck

    let displayForSale = false
    let displayForTrade = false

    if (userDeckStore.ownedByMe(deck)) {
        const saleInfo = deckListingStore.listingInfoForDeck(id)
        if (saleInfo != null) {
            displayForSale = true
            displayForTrade = saleInfo.forTrade
        }
    } else {
        displayForSale = forSale == true
        displayForTrade = forTrade == true
    }
    const displaySaleIcons = (displayForSale || displayForTrade)

    if (!displaySaleIcons) {
        return null
    }

    return (
        <Box display={"flex"} style={{gap: spacing(1), ...style}}>
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
