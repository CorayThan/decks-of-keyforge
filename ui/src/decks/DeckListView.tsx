import { Button, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TextField, Typography } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"
import { ChevronLeft, ChevronRight } from "@material-ui/icons"
import { sortBy } from "lodash"
import { IObservableArray, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { AercRadar } from "../aerc/AercRadar"
import { auctionStore } from "../auctions/DeckListingStore"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, roundToTens, SortOrder } from "../config/Utils"
import { CsvDownloadButton } from "../generic/CsvDownloadButton"
import { AercIcon, AercType } from "../generic/icons/aerc/AercIcon"
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
import { userDeckStore } from "../userdeck/UserDeckStore"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { Deck, DeckUtils } from "./Deck"
import { SaStars } from "./DeckScoreView"
import { deckStore } from "./DeckStore"
import { DeckViewSmall, MoreDeckActions } from "./DeckViewSmall"
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
        log.debug("Seller version by props? " + this.props.sellerView)
        const {decks, sellerView} = this.props
        const displayPrices = !!decks[0].deckSaleInfo
        if (sellerView && userStore.username == null && !userStore.loginInProgress) {
            return <Typography>Please login to use the sellers view.</Typography>
        } else if (sellerView && userStore.username == null) {
            return <Loader/>
        }
        return (
            <div>
                <Paper style={{marginBottom: spacing(2), marginRight: spacing(2)}}>
                    <Table size={"small"}>
                        <TableHead>
                            <TableRow>
                                <DeckHeader title={"Name"} property={"name"} minWidth={144}/>
                                <TableCell>Houses</TableCell>
                                {displayPrices ? (
                                    <>
                                        <DeckHeader title={"Price"} property={"price"}/>
                                        <DeckHeader title={"Bid"} property={"buyItNow"}/>
                                    </>
                                ) : null}
                                {sellerView ? <TableCell>Seller Tools</TableCell> : null}
                                <DeckHeader title={"SAS"} property={"sasRating"}/>
                                <DeckHeader title={"SAStars"} property={"sasPercentile"}/>
                                <DeckHeader title={"SAS%"} property={"sasPercentile"}/>
                                <DeckHeader title={"Synergy"} property={"synergyRating"}/>
                                <DeckHeader title={"Antisyn"} property={"antisynergyRating"}/>
                                <DeckHeader title={"Raw AERC"} property={"aercScore"}/>
                                {userDeckStore.viewNotes && (
                                    <TableCell>Notes</TableCell>
                                )}
                                <DeckHeader title={"A"} property={"amberControl"} tooltip={"Aember Control"}/>
                                <DeckHeader title={"E"} property={"expectedAmber"} tooltip={"Expected Aember"}/>
                                <DeckHeader title={"R"} property={"artifactControl"} tooltip={"Artifact Control"}/>
                                <DeckHeader title={"C"} property={"creatureControl"} tooltip={"Creature Control"}/>
                                <DeckHeader title={"P"} property={"effectivePower"} tooltip={"Effective Power"}/>
                                <DeckHeader title={"F"} property={"efficiency"} tooltip={"Efficiency"}/>
                                <DeckHeader title={"D"} property={"disruption"} tooltip={"Disruption"}/>
                                <DeckHeader title={<AercIcon type={AercType.S}/>} property={"amberProtection"} tooltip={"Aember Protection"}/>
                                <DeckHeader title={<AercIcon type={AercType.H}/>} property={"houseCheating"} tooltip={"House Cheating"}/>
                                {keyLocalStorage.smallTableView ? null : (
                                    <>
                                        <DeckHeader title={"Bonus Aember"} property={"rawAmber"}/>
                                        <DeckHeader title={"Key Cheats"} property={"keyCheatCount"}/>
                                        <DeckHeader title={"Draw Cards"} property={"cardDrawCount"}/>
                                        <DeckHeader title={"Archive Cards"} property={"cardArchiveCount"}/>
                                        <DeckHeader title={"Creature Power"} property={"totalPower"}/>
                                        <DeckHeader title={"Total Armor"} property={"totalArmor"}/>
                                        <DeckHeader title={"Power"} property={"powerLevel"}/>
                                        <DeckHeader title={"Chains"} property={"chains"}/>
                                        <DeckHeader title={"Wins"} property={"wins"}/>
                                        <DeckHeader title={"Losses"} property={"losses"}/>
                                    </>
                                )}
                                <TableCell>
                                    <div style={{display: "flex"}}>
                                        <CsvDownloadButton name={"decks"} data={DeckUtils.arrayToCSV(decks)}/>
                                        <IconButton
                                            onClick={keyLocalStorage.toggleSmallTableView}
                                            style={{marginLeft: spacing(2)}}
                                        >
                                            {keyLocalStorage.smallTableView ? <ChevronRight/> : <ChevronLeft/>}
                                        </IconButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {decks.map((deck) => {
                                const synergies = DeckUtils.synergiesRounded(deck.synergies!)
                                return (
                                    <TableRow key={deck.id}>
                                        <TableCell>
                                            <KeyLink style={{color: themeStore.defaultTextColor}} noStyle={true} to={Routes.deckPage(deck.keyforgeId)}>
                                                {deck.name}
                                            </KeyLink>
                                        </TableCell>
                                        <TableCell><HouseBanner houses={deck.houses} size={36}/></TableCell>
                                        {displayPrices || sellerView ? (
                                            <>
                                                <DeckPriceCell deck={deck} sellerVersion={sellerView}/>
                                                <TableCell>{DeckUtils.findHighestBid(deck)}</TableCell>
                                            </>
                                        ) : null}
                                        {sellerView ? (
                                            <TableCell style={{minWidth: 200}}>
                                                <MyDecksButton deck={deck}/>
                                            </TableCell>
                                        ) : null}
                                        <TableCell>{synergies.sasRating}</TableCell>
                                        <TableCell>
                                            {deck.sasPercentile && (
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
                                            )}
                                        </TableCell>
                                        <TableCell>{deck.sasPercentile && roundToTens(deck.sasPercentile)}</TableCell>
                                        <TableCell>{synergies.synergyRating}</TableCell>
                                        <TableCell>{synergies.antisynergyRating}</TableCell>
                                        <TableCell>{synergies.rawAerc}</TableCell>
                                        {userDeckStore.viewNotes && (
                                            <TableCell>
                                                <div style={{width: 280}}>
                                                    <InlineDeckNote id={deck.id}/>
                                                </div>
                                            </TableCell>
                                        )}
                                        <TableCell>{synergies.amberControl}</TableCell>
                                        <TableCell>{synergies.expectedAmber}</TableCell>
                                        <TableCell>{synergies.artifactControl}</TableCell>
                                        <TableCell>{synergies.creatureControl}</TableCell>
                                        <TableCell>{synergies.effectivePower}</TableCell>
                                        <TableCell>{synergies.efficiency}</TableCell>
                                        <TableCell>{synergies.disruption}</TableCell>
                                        <TableCell>{synergies.amberProtection}</TableCell>
                                        <TableCell>{synergies.houseCheating}</TableCell>
                                        {keyLocalStorage.smallTableView ? null : (
                                            <>
                                                <TableCell>{deck.rawAmber}</TableCell>
                                                <TableCell>{deck.keyCheatCount}</TableCell>
                                                <TableCell>{deck.cardDrawCount}</TableCell>
                                                <TableCell>{deck.cardArchiveCount}</TableCell>
                                                <TableCell>{deck.totalPower}</TableCell>
                                                <TableCell>{deck.totalArmor}</TableCell>
                                                <TableCell>{deck.powerLevel}</TableCell>
                                                <TableCell>{deck.chains}</TableCell>
                                                <TableCell>{deck.wins}</TableCell>
                                                <TableCell>{deck.losses}</TableCell>
                                            </>
                                        )}
                                        <TableCell>
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
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
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
    priceForSeller?: string

    componentDidMount() {
        this.setPriceForSeller(this.props)
    }

    setPriceForSeller = (props: SellerViewCellProps) => {
        const {deck, sellerVersion} = props
        this.priceForSeller = DeckUtils.findPrice(deck, sellerVersion)?.toString()
    }

    render() {
        const {deck, sellerVersion} = this.props
        const auctionInfo = auctionStore.listingInfoForDeck(deck.id)
        if (auctionInfo != null && this.priceForSeller != null && sellerVersion) {
            return (
                <TableCell>
                    <TextField
                        label={"Price"}
                        value={this.priceForSeller}
                        type={"number"}
                        onChange={(event) => {
                            this.priceForSeller = event.target.value
                            log.debug(`Price for seller is ${this.priceForSeller}`)
                            const asNumber = Number(this.priceForSeller)
                            const realPrice = asNumber < 1 ? undefined : asNumber
                            deckTableViewStore.addPriceChange(auctionInfo.id, realPrice)
                        }}
                        style={{width: 64}}
                    />
                </TableCell>
            )
        }
        const price = DeckUtils.findPrice(deck)
        return (
            <TableCell>
                {price == null ? "" : price}
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
        if (this.props.sellerView) {
            return <DeckTableView {...this.props}/>
        }
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
