import { Button, IconButton, Paper, TableCell, TextField, Typography } from "@material-ui/core"
import { ChevronLeft, ChevronRight } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { deckListingStore } from "../auctions/DeckListingStore"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, roundToHundreds, roundToTens } from "../config/Utils"
import { CsvDownloadButton } from "../generic/CsvDownloadButton"
import { SortableTable, SortableTableHeaderInfo } from "../generic/SortableTable"
import { HouseBanner } from "../houses/HouseBanner"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { Loader } from "../mui-restyled/Loader"
import { sellerStore } from "../sellers/SellerStore"
import { userStore } from "../user/UserStore"
import { InlineDeckNote } from "../userdeck/DeckNote"
import { UpdatePrice } from "../userdeck/ListingInfo"
import { MoreDeckActions } from "./buttons/MoreDeckActions"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { DeckListViewProps } from "./DeckListView"
import { SaStars } from "./DeckScoreView"
import { DeckSearchResult, DeckUtils } from "./models/DeckSearchResult"

class DeckTableViewStore {
    @observable
    priceChanges: UpdatePrice[] = []

    addPriceChange = (auctionId: string, askingPrice?: number) => {
        this.priceChanges = this.priceChanges.filter(priceChange => priceChange.auctionId !== auctionId)
        this.priceChanges.push({auctionId, askingPrice})
    }
}

const deckTableViewStore = new DeckTableViewStore()

@observer
export class DeckTableView extends React.Component<DeckListViewProps> {

    componentDidMount(): void {
        deckTableViewStore.priceChanges = []
    }

    render() {

        log.debug("Seller version by props? " + this.props.sellerView)
        const {decks, sellerView} = this.props
        const displayPrices = !!decks[0].deckSaleInfo
        if (sellerView && userStore.username == null && !userStore.loginInProgress) {
            return <Typography>Please login to use the sellers view.</Typography>
        } else if (sellerView && userStore.username == null) {
            return <Loader/>
        }

        const deckTableHeaders: SortableTableHeaderInfo<DeckSearchResult>[] = [
            {
                property: "name",
                width: 240,
                transform: deck => (
                    <KeyLink style={{color: themeStore.defaultTextColor}} noStyle={true} to={Routes.deckPage(deck.keyforgeId)}>
                        {deck.name}
                    </KeyLink>
                )
            },
            {
                title: "Houses",
                sortable: false,
                transform: deck => (
                    <HouseBanner houses={deck.housesAndCards.map(house => house.house)} size={36}/>
                )
            },
            {
                title: "Price",
                transform: deck => <DeckPriceCell deck={deck} sellerVersion={sellerView}/>,
                sortFunction: deck => DeckUtils.findPrice(deck, sellerView),
                hide: !displayPrices,
            },
            {
                title: "Bid",
                transform: deck => DeckUtils.findHighestBid(deck),
                sortFunction: deck => DeckUtils.findHighestBid(deck),
                hide: !displayPrices
            },
            {
                title: "Seller Tools",
                transform: deck => (
                    <MyDecksButton deck={deck}/>
                ),
                sortable: false,
                width: 184,
                hide: !sellerView
            },

            {
                title: "SAS",
                transform: deck => deck.synergies?.sasRating,
                sortFunction: deck => deck.synergies?.sasRating
            },
            {
                title: "SAStars",
                transform: deck => (
                    <SaStars
                        sasPercentile={deck.sasPercentile}
                        small={true}
                        gray={true}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            width: 48
                        }}
                        halfAtEnd={true}
                        noPercent={true}
                    />
                ),
                sortFunction: deck => deck.synergies?.sasRating,
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "SAS%",
                transform: deck => roundToTens(deck.sasPercentile),
                sortFunction: deck => roundToTens(deck.sasPercentile)
            },
            {
                title: "Synergy",
                transform: deck => roundToHundreds(deck.synergies?.synergyRating),
                sortFunction: deck => roundToHundreds(deck.synergies?.synergyRating),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "Antisyn",
                transform: deck => roundToHundreds(deck.synergies?.antisynergyRating),
                sortFunction: deck => roundToHundreds(deck.synergies?.antisynergyRating),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "Raw AERC",
                transform: deck => roundToHundreds(deck.synergies?.rawAerc),
                sortFunction: deck => roundToHundreds(deck.synergies?.rawAerc),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "Notes",
                transform: deck => (
                    <div style={{width: 280}}>
                        <InlineDeckNote id={deck.id}/>
                    </div>
                ),
                hide: !keyLocalStorage.genericStorage.viewNotes
            },
            {
                title: "A",
                transform: deck => roundToHundreds(deck.synergies?.amberControl),
                sortFunction: deck => roundToHundreds(deck.synergies?.amberControl)
            },
            {
                title: "E",
                transform: deck => roundToHundreds(deck.synergies?.expectedAmber),
                sortFunction: deck => roundToHundreds(deck.synergies?.expectedAmber)
            },
            {
                title: "R",
                transform: deck => roundToHundreds(deck.synergies?.artifactControl),
                sortFunction: deck => roundToHundreds(deck.synergies?.artifactControl)
            },
            {
                title: "C",
                transform: deck => roundToHundreds(deck.synergies?.creatureControl),
                sortFunction: deck => roundToHundreds(deck.synergies?.creatureControl)
            },
            {
                title: "P",
                transform: deck => roundToHundreds(deck.synergies?.effectivePower),
                sortFunction: deck => roundToHundreds(deck.synergies?.effectivePower)
            },
            {
                title: "F",
                transform: deck => roundToHundreds(deck.synergies?.efficiency),
                sortFunction: deck => roundToHundreds(deck.synergies?.efficiency)
            },
            {
                title: "D",
                transform: deck => roundToHundreds(deck.synergies?.disruption),
                sortFunction: deck => roundToHundreds(deck.synergies?.disruption)
            },
            {
                title: "CP",
                transform: deck => roundToHundreds(deck.synergies?.creatureProtection),
                sortFunction: deck => roundToHundreds(deck.synergies?.creatureProtection),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "O",
                transform: deck => roundToHundreds(deck.synergies?.other),
                sortFunction: deck => roundToHundreds(deck.synergies?.other),
                hide: keyLocalStorage.smallTableView
            },
            {
                property: "rawAmber",
                title: "Bonus Aember",
                hide: keyLocalStorage.smallTableView
            },
            {
                property: "keyCheatCount",
                title: "Key Cheats",
                hide: keyLocalStorage.smallTableView
            },
            {property: "cardDrawCount", title: "Draw Cards", hide: keyLocalStorage.smallTableView},
            {property: "cardArchiveCount", title: "Archive Cards", hide: keyLocalStorage.smallTableView},
            {property: "totalPower", hide: keyLocalStorage.smallTableView},
            {property: "totalArmor", hide: keyLocalStorage.smallTableView},
            {property: "powerLevel", hide: keyLocalStorage.smallTableView},
            {property: "wins", hide: keyLocalStorage.smallTableView},
            {property: "losses", hide: keyLocalStorage.smallTableView},
            {
                titleNode: (
                    <div style={{display: "flex"}}>
                        <CsvDownloadButton name={"decks"} data={DeckUtils.arrayToCSV(decks)}/>
                        <IconButton
                            onClick={keyLocalStorage.toggleSmallTableView}
                            style={{marginLeft: spacing(2)}}
                        >
                            {keyLocalStorage.smallTableView ? <ChevronRight/> : <ChevronLeft/>}
                        </IconButton>
                    </div>
                ),
                transform: deck => (
                    <div style={{display: "flex"}}>
                        <KeyLink
                            to={Routes.deckPage(deck.keyforgeId)}
                            noStyle={true}
                            style={{marginRight: spacing(2)}}
                        >
                            <KeyButton color={"primary"} size={"small"}>View Deck</KeyButton>
                        </KeyLink>
                        <MoreDeckActions deck={deck} compact={true}/>
                    </div>
                ),
                sortable: false
            }
        ]

        return (
            <div>
                <Paper style={{marginBottom: spacing(2), marginRight: spacing(2)}}>
                    <SortableTable
                        headers={deckTableHeaders}
                        data={decks}
                        defaultSort={"sasRating"}
                    />
                </Paper>
                {sellerView ? (
                    <Button
                        disabled={deckTableViewStore.priceChanges.length === 0}
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                            sellerStore.updatePrices(deckTableViewStore.priceChanges)
                            deckTableViewStore.priceChanges = []
                        }}
                    >
                        Save Prices
                    </Button>
                ) : null}
            </div>
        )
    }
}

interface SellerViewCellProps {
    deck: DeckSearchResult
    sellerVersion?: boolean
}

@observer
class DeckPriceCell extends React.Component<SellerViewCellProps> {
    @observable
    price?: string

    componentDidMount() {
        this.setPriceForSeller(this.props)
    }

    componentDidUpdate() {
        this.setPriceForSeller(this.props)
    }

    setPriceForSeller = (props: SellerViewCellProps) => {
        const {deck, sellerVersion} = props
        this.price = DeckUtils.findPrice(deck, sellerVersion)?.toString()
    }

    render() {
        const {deck, sellerVersion} = this.props
        const auctionInfo = deckListingStore.listingInfoForDeck(deck.id)
        if (auctionInfo != null && this.price != null && sellerVersion) {
            return (
                <TableCell>
                    <TextField
                        label={"Price"}
                        value={this.price}
                        type={"number"}
                        onChange={(event) => {
                            this.price = event.target.value
                            log.debug(`Price for seller is ${this.price}`)
                            const asNumber = Number(this.price)
                            const realPrice = asNumber < 1 ? undefined : asNumber
                            deckTableViewStore.addPriceChange(auctionInfo.id, realPrice)
                        }}
                        style={{width: 64}}
                    />
                </TableCell>
            )
        }
        if (sellerVersion) {
            return <TableCell/>
        }
        return (
            <TableCell>
                {this.price == null ? "" : this.price}
            </TableCell>
        )
    }
}
