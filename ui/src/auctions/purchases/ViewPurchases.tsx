import { Paper } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { CsvDownloadButton } from "../../generic/CsvDownloadButton"
import { HelperText } from "../../generic/CustomTypographies"
import { SortableTable, SortableTableHeaderInfo } from "../../generic/SortableTable"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { Loader } from "../../mui-restyled/Loader"
import { PurchaseSearchResult, PurchaseUtils } from "./PurchaseSearchResult"
import { purchaseStore } from "./PurchaseStore"

export const ViewPurchases = observer(() => {

    useEffect(() => {
        purchaseStore.findMyPurchases()
    }, [])

    const myPurchases = purchaseStore.myPurchases

    if (myPurchases == null) {
        return <Loader/>
    }

    return (
        <div>
            <PurchasesList
                name={"My Purchases"}
                noneMessage={"Buy some decks to see your purchases!"}
                buyer={true}
                purchases={myPurchases?.myPurchases}
            />
            <div style={{marginTop: spacing(2)}}/>
            <PurchasesList
                name={"My Sales"}
                noneMessage={"Sell some decks to see your sales!"}
                buyer={false}
                purchases={myPurchases?.mySales}
            />
            <div style={{marginTop: spacing(2)}}/>
            <HelperText style={{marginBottom: spacing(1)}}>
                For standard deck sales you can report a purchase from the three vertical dots on the bottom of a deck you have marked as owned.
            </HelperText>
            <HelperText style={{marginBottom: spacing(1)}}>
                Auction and offer sales will be automatically recorded with buyer and seller.
            </HelperText>
            <HelperText>
                If a buyer or seller has already created a sale or purchase in the past week for this deck with the same price they will automatically be
                linked as the buyer or seller.
            </HelperText>
        </div>
    )
})

const purchaseTableHeaders = (buyer: boolean): SortableTableHeaderInfo<PurchaseSearchResult>[] => {
    let buyerOrSeller: SortableTableHeaderInfo<PurchaseSearchResult>
    if (buyer) {
        buyerOrSeller = {
            property: "sellerUsername",
            title: "Seller",
            sortable: true,
            transform: (purchase) => (
                <Link to={Routes.userProfilePage(purchase.sellerUsername)}>{purchase.sellerUsername}</Link>
            )
        }
    } else {
        buyerOrSeller = {
            property: "buyerUsername",
            title: "Buyer",
            sortable: true,
            transform: (purchase) => (
                <Link to={Routes.userProfilePage(purchase.buyerUsername)}>{purchase.buyerUsername}</Link>
            )
        }
    }
    return [
        {
            property: "deckName",
            title: "Deck",
            sortable: true,
            transform: (purchase) => (
                <KeyLink style={{color: themeStore.defaultTextColor}} noStyle={true} to={Routes.deckPage(purchase.deckKeyforgeId)}>
                    {purchase.deckName}
                </KeyLink>
            )
        },
        {
            property: "saleAmount",
            title: "Sale Amount",
            sortable: true,
            transform: (purchase) => `${purchase.currencySymbol ?? ""}${purchase.saleAmount}`
        },
        {property: "saleType", sortable: true, title: "Sale Type"},
        {property: "purchasedOn", title: "Sale Date", sortable: true},
        buyerOrSeller
    ]
}

const PurchasesList = (props: { name: string, noneMessage: string, buyer: boolean, purchases: PurchaseSearchResult[] }) => {
    const {name, noneMessage, buyer, purchases} = props
    return (
        <div style={{marginBottom: spacing(4)}}>
            {purchases.length === 0 ? (
                <Typography>{noneMessage}</Typography>
            ) : (
                <Paper style={{backgroundColor: themeStore.tableBackgroundColor, maxWidth: 1200, overflowX: "auto"}}>
                    <div style={{margin: spacing(2), display: "flex"}}>
                        <Typography variant={"h5"}>
                            {name}
                        </Typography>
                        <div style={{flexGrow: 1}}/>
                        <CsvDownloadButton
                            data={PurchaseUtils.arrayToCSV(purchases)}
                            name={name.toLowerCase().replace(" ", "-")}
                            size={"small"}
                        />
                    </div>
                    <SortableTable
                        defaultSort={"purchasedOn"}
                        data={purchases}
                        headers={purchaseTableHeaders(buyer)}
                    />
                </Paper>
            )}
        </div>
    )
}
