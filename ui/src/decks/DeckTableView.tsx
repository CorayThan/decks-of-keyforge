import { Box, Button, Checkbox, IconButton, Paper, TextField } from "@material-ui/core"
import { ChevronLeft, ChevronRight } from "@material-ui/icons"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { deckListingStore } from "../auctions/DeckListingStore"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, roundToHundreds, roundToTens } from "../config/Utils"
import { SortableTable, SortableTableHeaderInfo } from "../generic/SortableTable"
import { HouseBanner } from "../houses/HouseBanner"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyLink } from "../mui-restyled/KeyLink"
import { Loader } from "../mui-restyled/Loader"
import { InlineDeckNote } from "../notes/DeckNote"
import { sellerStore } from "../sellers/SellerStore"
import { userStore } from "../user/UserStore"
import { MoreDeckActions } from "./buttons/MoreDeckActions"
import { MyDecksButton } from "./buttons/MyDecksButton"
import { DeckListViewProps } from "./DeckListView"
import { SaStars } from "./DeckScoreView"
import { deckStore } from "./DeckStore"
import { deckTableViewStore } from "./DeckTableViewStore"
import { DeckSearchResult } from "./models/DeckSearchResult"
import { ListForSaleView } from "./sales/ListForSaleView"
import { DeckType } from "../generated-src/DeckType";
import {DeckUtils} from "./DeckUtils";

@observer
export class DeckTableView extends React.Component<DeckListViewProps> {

    componentDidMount(): void {
        deckTableViewStore.reset()
    }

    render() {

        const {decks} = this.props

        const firstDeck = decks[0]

        if (firstDeck == null) {
            log.info("First deck null in table view")
            return null
        }

        const sellerView = !keyLocalStorage.smallTableView && userStore.username != null && deckStore.currentFilters?.owner === userStore.username
        const displayPrices = !!firstDeck.deckSaleInfo
        if (sellerView && userStore.username == null) {
            return <Loader/>
        }

        const deckTableHeaders: SortableTableHeaderInfo<DeckSearchResult>[] = [
            {
                titleNode: (
                    <Box display={"flex"} justifyContent={"center"}>
                        <BulkModificationSelectAll deckIds={decks.map(deck => deck.id)}/>
                    </Box>
                ),
                transform: deck => (
                    <BulkModificationSelect deckId={deck.id}/>
                ),
                sortable: false,
                hide: !sellerView,
                padding: "checkbox",
                key: "Select"
            },
            {
                property: "name",
                width: 240,
                transform: deck => (
                    <KeyLink
                        style={{color: themeStore.defaultTextColor}}
                        noStyle={true}
                        to={deck.deckType === DeckType.STANDARD ? Routes.deckPage(deck.keyforgeId) : Routes.allianceDeckPage(deck.keyforgeId)}
                    >
                        {deck.name}
                    </KeyLink>
                )
            },
            {
                title: "Houses",
                sortable: false,
                transform: deck => (
                    <HouseBanner houses={deck.housesAndCards.map(house => house.house)} size={36} allianceHouses={deck.allianceHouses}/>
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
                hide: !sellerView,
            },

            {
                title: "SAS",
                transform: deck => deck.sasRating,
                sortFunction: deck => deck.sasRating
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
                sortFunction: deck => deck.sasRating,
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "SAS%",
                transform: deck => roundToTens(deck.sasPercentile),
                sortFunction: deck => roundToTens(deck.sasPercentile),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "Synergy",
                transform: deck => roundToHundreds(deck.synergyRating),
                sortFunction: deck => roundToHundreds(deck.synergyRating),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "Antisyn",
                transform: deck => roundToHundreds(deck.antisynergyRating),
                sortFunction: deck => roundToHundreds(deck.antisynergyRating),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "Raw AERC",
                transform: deck => roundToHundreds(deck.aercScore),
                sortFunction: deck => roundToHundreds(deck.aercScore),
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
                transform: deck => roundToHundreds(deck.amberControl),
                sortFunction: deck => roundToHundreds(deck.amberControl)
            },
            {
                title: "E",
                transform: deck => roundToHundreds(deck.expectedAmber),
                sortFunction: deck => roundToHundreds(deck.expectedAmber)
            },
            {
                title: "R",
                transform: deck => roundToHundreds(deck.artifactControl),
                sortFunction: deck => roundToHundreds(deck.artifactControl)
            },
            {
                title: "C",
                transform: deck => roundToHundreds(deck.creatureControl),
                sortFunction: deck => roundToHundreds(deck.creatureControl)
            },
            {
                title: "P",
                transform: deck => roundToHundreds(deck.effectivePower),
                sortFunction: deck => roundToHundreds(deck.effectivePower)
            },
            {
                title: "F",
                transform: deck => roundToHundreds(deck.efficiency),
                sortFunction: deck => roundToHundreds(deck.efficiency)
            },
            {
                title: "U",
                transform: deck => roundToHundreds(deck.recursion),
                sortFunction: deck => roundToHundreds(deck.recursion)
            },
            {
                title: "D",
                transform: deck => roundToHundreds(deck.disruption),
                sortFunction: deck => roundToHundreds(deck.disruption)
            },
            {
                title: "CP",
                transform: deck => roundToHundreds(deck.creatureProtection),
                sortFunction: deck => roundToHundreds(deck.creatureProtection),
                hide: keyLocalStorage.smallTableView
            },
            {
                title: "O",
                transform: deck => roundToHundreds(deck.other),
                sortFunction: deck => roundToHundreds(deck.other),
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
                    <IconButton
                        onClick={keyLocalStorage.toggleSmallTableView}
                    >
                        {keyLocalStorage.smallTableView ? <ChevronRight/> : <ChevronLeft/>}
                    </IconButton>
                ),
                transform: deck => (
                    <div style={{display: "flex"}}>
                        <KeyLink
                            to={Routes.deckPage(deck.keyforgeId)}
                            noStyle={true}
                            style={{marginRight: spacing(2)}}
                        >
                            <KeyButton size={"small"}>View Deck</KeyButton>
                        </KeyLink>
                        <MoreDeckActions deck={deck} compact={true}/>
                    </div>
                ),
                sortable: false
            }
        ]

        return (
            <div>
                <Paper style={{margin: spacing(2)}}>
                    <SortableTable
                        headers={deckTableHeaders}
                        data={decks}
                        defaultSort={"SAS"}
                        noInitialSort={true}
                    />
                </Paper>
                {sellerView ? (
                    <Box display={"flex"} mb={2}>
                        <Button
                            disabled={deckTableViewStore.priceChanges.length === 0}
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => {
                                sellerStore.updatePrices(deckTableViewStore.priceChanges)
                                deckTableViewStore.priceChanges = []
                            }}
                            style={{marginLeft: spacing(2)}}
                        >
                            Save All Price Changes
                        </Button>
                        <KeyButton
                            disabled={deckTableViewStore.selectedDecks.length === 0}
                            variant={"contained"}
                            color={"primary"}
                            onClick={async () => {
                                await deckListingStore.bulkCancel(deckTableViewStore.selectedDecks)
                                deckTableViewStore.selectedDecks = []
                            }}
                            style={{marginLeft: spacing(2)}}
                            loading={deckListingStore.performingBulkUpdate}
                        >
                            Unlist Selected Decks
                        </KeyButton>
                        <KeyButton
                            disabled={deckTableViewStore.selectedDecks.length === 0}
                            variant={"contained"}
                            color={"primary"}
                            onClick={async () => {
                                await deckListingStore.bulkSold(deckTableViewStore.selectedDecks)
                                deckTableViewStore.selectedDecks = []
                            }}
                            style={{marginLeft: spacing(2)}}
                            loading={deckListingStore.performingBulkUpdate}
                        >
                            Unlist and Remove Selected Decks
                        </KeyButton>
                        <ListForSaleView
                            deckIds={deckTableViewStore.selectedDecks}
                        />
                    </Box>
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

    constructor(props: SellerViewCellProps) {
        super(props)
        makeObservable(this)
    }

    componentDidMount() {
        this.setPriceForSeller(this.props)
    }

    componentDidUpdate(prevProps: Readonly<SellerViewCellProps>) {
        if (this.props.deck.keyforgeId !== prevProps.deck.keyforgeId) {
            this.setPriceForSeller(this.props)
        }
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
            )
        }
        if (sellerVersion) {
            return <div/>
        }
        return (
            <div>
                {this.price == null ? "" : this.price}
            </div>
        )
    }
}

const BulkModificationSelect = observer((props: { deckId: number }) => {
    const {deckId} = props
    return (
        <Checkbox
            checked={deckTableViewStore.selectedDecks.includes(deckId)}
            onChange={() => deckTableViewStore.toggleDeckSelected(deckId)}
            inputProps={{"aria-label": "primary checkbox"}}
        />
    )
})

const BulkModificationSelectAll = observer((props: { deckIds: number[] }) => {
    const {deckIds} = props
    const checked = deckTableViewStore.selectedDecks.length === deckIds.length
    return (
        <Checkbox
            checked={checked}
            onChange={() => {
                if (checked) {
                    deckTableViewStore.selectedDecks = []
                } else {
                    deckTableViewStore.selectedDecks = deckIds.slice()
                }
            }}
            inputProps={{"aria-label": "primary checkbox"}}
        />
    )
})
