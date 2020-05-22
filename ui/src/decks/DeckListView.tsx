import { Button, IconButton, Paper, TableCell, TableSortLabel, TextField, Typography } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"
import { ChevronLeft, ChevronRight } from "@material-ui/icons"
import { sortBy } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { AercRadar } from "../aerc/AercRadar"
import { deckListingStore } from "../auctions/DeckListingStore"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, roundToHundreds, roundToTens, SortOrder } from "../config/Utils"
import { CsvDownloadButton } from "../generic/CsvDownloadButton"
import { SortableTable, SortableTableHeaderInfo } from "../generic/SortableTable"
import { HouseBanner } from "../houses/HouseBanner"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { Loader } from "../mui-restyled/Loader"
import { sellerStore } from "../sellers/SellerStore"
import { CardTypeRadar } from "../stats/CardTypeRadar"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { InlineDeckNote } from "../userdeck/DeckNote"
import { UpdatePrice } from "../userdeck/ListingInfo"
import { MoreDeckActions } from "./buttons/MoreDeckActions"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { Deck, DeckUtils } from "./Deck"
import { SaStars } from "./DeckScoreView"
import { deckStore } from "./DeckStore"
import { DeckViewSmall } from "./DeckViewSmall"
import { SaleInfoView } from "./sales/SaleInfoView"

interface DeckListViewProps {
    decks: Deck[]
    sellerView?: boolean
}

class DeckTableViewStore {
    @observable
    activeTableSort = ""
    @observable
    tableSortDir: SortOrder = "desc"
    @observable
    priceChanges: UpdatePrice[] = []

    addPriceChange = (auctionId: string, askingPrice?: number) => {
        this.priceChanges = this.priceChanges.filter(priceChange => priceChange.auctionId !== auctionId)
        this.priceChanges.push({auctionId, askingPrice})
    }

    resort = () => {
        if (deckStore.deckPage) {
            const decks: IObservableArray<Deck> = deckStore.deckPage.decks as IObservableArray<Deck>
            if (deckTableViewStore.activeTableSort === "price") {
                decks.replace(sortBy(decks.slice(), (deck: Deck) => {
                    if (deck.deckSaleInfo && deck.deckSaleInfo.length > 0 && deck.deckSaleInfo[0] && deck.deckSaleInfo[0].buyItNow) {
                        return deck.deckSaleInfo[0].buyItNow
                    } else {
                        return deckTableViewStore.tableSortDir === "desc" ? 0 : 1000000
                    }
                }))
            } else if (deckTableViewStore.activeTableSort === "buyItNow") {
                decks.replace(sortBy(decks.slice(), (deck: Deck) => {
                    const buyItNow = findBuyItNowForDeck(deck)
                    if (buyItNow) {
                        return buyItNow
                    }
                    return deckTableViewStore.tableSortDir === "desc" ? 0 : 1000000
                }))
            } else {
                decks.replace(sortBy(decks.slice(), deckTableViewStore.activeTableSort))
            }
            if (deckTableViewStore.tableSortDir === "desc") {
                log.info("Reversing table sort")
                decks.replace(decks.slice().reverse())
            }
        }
    }

    reset = () => {
        this.activeTableSort = ""
        this.tableSortDir = "desc"
    }
}

export const deckTableViewStore = new DeckTableViewStore()

@observer
export class DeckTableView extends React.Component<DeckListViewProps> {

    componentDidMount(): void {
        deckTableViewStore.priceChanges = []
    }

    render() {

        // Observe changes
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const deckPageId = deckStore.deckPageId

        log.debug("Seller version by props? " + this.props.sellerView)
        const {decks, sellerView} = this.props
        const displayPrices = !!decks[0].deckSaleInfo
        if (sellerView && userStore.username == null && !userStore.loginInProgress) {
            return <Typography>Please login to use the sellers view.</Typography>
        } else if (sellerView && userStore.username == null) {
            return <Loader/>
        }

        const deckTableHeaders: SortableTableHeaderInfo<Deck>[] = [
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
                    <HouseBanner houses={deck.houses} size={36}/>
                )
            },
            {
                title: "Price",
                transform: deck =>  <DeckPriceCell deck={deck} sellerVersion={sellerView}/>,
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
                title: "AP",
                transform: deck => roundToHundreds(deck.synergies?.amberProtection),
                sortFunction: deck => roundToHundreds(deck.synergies?.amberProtection),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "HC",
                transform: deck => roundToHundreds(deck.synergies?.houseCheating),
                sortFunction: deck => roundToHundreds(deck.synergies?.houseCheating),
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
    deck: Deck
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

const changeSortHandler = (property: string) => {
    return () => {
        if (deckTableViewStore.activeTableSort === property) {
            deckTableViewStore.tableSortDir = deckTableViewStore.tableSortDir === "desc" ? "asc" : "desc"
        } else {
            deckTableViewStore.activeTableSort = property
        }
        deckTableViewStore.resort()
    }
}

const DeckHeader = (props: { title: React.ReactNode, property: string, tooltip?: string, minWidth?: number }) => (
    <TableCell style={{minWidth: props.minWidth ? props.minWidth : undefined, maxWidth: 72}}>
        <Tooltip title={props.tooltip ? props.tooltip : ""}>
            <TableSortLabel
                active={deckTableViewStore.activeTableSort === props.property}
                direction={deckTableViewStore.tableSortDir}
                onClick={changeSortHandler(props.property)}
            >
                {props.title}
            </TableSortLabel>
        </Tooltip>
    </TableCell>
)

const findBuyItNowForDeck = (deck: Deck): number | null => {

    if (deck.deckSaleInfo) {
        for (const saleInfo of deck.deckSaleInfo) {
            if (saleInfo.buyItNow) {
                return saleInfo.buyItNow
            }
        }
    }
    return null
}

@observer
export class DeckListView extends React.Component<DeckListViewProps> {
    render() {

        // Observe changes
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const deckPageId = deckStore.deckPageId

        return (
            <>
                {this.props.decks.map((deck) => {

                    let saleInfo = null
                    if (deck.deckSaleInfo) {
                        saleInfo = (
                            <SaleInfoView
                                saleInfo={deck.deckSaleInfo}
                                deckName={deck.name}
                                keyforgeId={deck.keyforgeId}
                                deckId={deck.id}
                            />
                        )
                    }

                    let deckContainerStyle
                    if (!saleInfo && screenStore.screenWidth > 1472) {
                        deckContainerStyle = {display: "flex"}
                    } else if (screenStore.screenWidth > 1888) {
                        deckContainerStyle = {display: "flex"}
                    }

                    return (
                        <div key={deck.id} style={deckContainerStyle}>
                            <div>
                                <DeckViewSmall deck={deck}/>
                            </div>
                            {saleInfo && (
                                <div>
                                    <div style={{display: screenStore.smallDeckView() ? undefined : "flex", flexWrap: "wrap"}}>
                                        {saleInfo}
                                        {keyLocalStorage.deckListViewType === "graphs" ? (
                                            <div>
                                                <AercRadar deck={deck}/>
                                                <CardTypeRadar deck={deck} style={{marginTop: spacing(4)}}/>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            {!saleInfo && keyLocalStorage.deckListViewType === "graphs" && (
                                <div style={{display: screenStore.smallDeckView() ? undefined : "flex", flexWrap: "wrap"}}>
                                    <AercRadar deck={deck}/>
                                    <CardTypeRadar deck={deck}/>
                                </div>
                            )}
                        </div>
                    )
                })}
            </>
        )
    }
}
