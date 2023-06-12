import { Box } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as History from "history"
import { isEqual } from "lodash"
import { autorun, IReactionDisposer } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { log, Utils } from "../../config/Utils"
import { SellerDetails } from "../../generated-src/SellerDetails"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { Loader } from "../../mui-restyled/Loader"
import { SellerBanner } from "../../sellers/imgs/SellerImgs"
import { sellerStore } from "../../sellers/SellerStore"
import { tagStore } from "../../tags/TagStore"
import { screenStore } from "../../ui/ScreenStore"
import { uiStore } from "../../ui/UiStore"
import { userStore } from "../../user/UserStore"
import { ComparisonPopover } from "../comparison/ComparisonPopover"
import { DeckListView } from "../DeckListView"
import { deckStore } from "../DeckStore"
import { DeckTableView } from "../DeckTableView"
import { DeckFilters } from "./DeckFilters"
import { DecksSearchDrawer } from "./decksearchdrawer/DecksSearchDrawer"
import { AllianceDecksSearchDrawer } from "../../alliancedecks/AllianceDecksSearchDrawer";
import { allianceDeckStore } from "../../alliancedecks/AllianceDeckStore";
import { AllianceDeckPopover } from "../../alliancedecks/AllianceDeckPopover";
import { Routes } from "../../config/Routes";
import { DeckSearchResult } from "../models/DeckSearchResult";

export class DeckSearchPage extends React.Component<RouteComponentProps<{}>> {

    componentDidMount(): void {
        if (this.props.location.search !== "") {
            this.search(this.makeFilters(this.props).cleaned())
        }
    }

    componentDidUpdate(prevProps: RouteComponentProps<{}>): void {
        const filters = this.makeFilters(this.props).cleaned()
        const prevFilters = this.makeFilters(prevProps).cleaned()
        if (!isEqual(filters, prevFilters)) {
            this.search(filters)
        }
    }

    componentWillUnmount(): void {
        deckStore.reset()
    }

    makeFilters = (props: Readonly<RouteComponentProps<{}>>): DeckFilters => {
        return DeckFilters.rehydrateFromQuery(props.location.search)
    }

    search = (filters: DeckFilters) => {
        // log.debug(`Search with filters ${prettyJson(this.makeFilters(props).cleaned())}`)
        const defaultForSaleSearch = new DeckFilters()
        defaultForSaleSearch.forSale = true
        const defaultSearch = new DeckFilters()
        defaultSearch.reset()
        deckStore.searchDecks(filters)

        if (keyLocalStorage.hasAuthKey() && filters.tags.length === 1) {
            const filtersOnlyTag = new DeckFilters()
            filtersOnlyTag.tags = filters.tags
            if (Utils.equals(filters, filtersOnlyTag)) {
                log.info("Tag viewed")
                tagStore.viewedTag(filters.tags[0])
            }
        }
    }

    render() {
        const filters = this.makeFilters(this.props)
        return (
            <DeckSearchContainer history={this.props.history} location={this.props.location} filters={filters}
                                 queryParams={this.props.location.search}/>
        )
    }
}

export interface DeckSearchContainerProps {
    history: History.History
    location: History.Location
    filters?: DeckFilters
    queryParams: string
}

@observer
export class DeckSearchContainer extends React.Component<DeckSearchContainerProps> {

    titleUpdateDisposer?: IReactionDisposer

    componentDidMount(): void {
        this.setTitle()
        this.titleUpdateDisposer = autorun(() => {
            this.setTitle()
        })
    }

    componentWillUnmount(): void {
        if (this.titleUpdateDisposer) {
            this.titleUpdateDisposer()
        }
    }

    setTitle = () => {
        const {location, filters, queryParams} = this.props

        let owner: string | undefined
        let sellerDetails: SellerDetails | undefined
        if (queryParams) {
            const queryValues = new URLSearchParams(queryParams)
            owner = queryValues.get("owner") ?? undefined
            if (owner) {
                sellerDetails = sellerStore.findSellerWithUsername(owner)
            }
        }

        const decksOrAlliances = location.pathname.includes(Routes.allianceDecks) ? "Alliances" : "Decks"

        if (userStore.username != null && owner === userStore.username) {
            const mine = `My ${decksOrAlliances}`
            uiStore.setTopbarValues(mine, mine, "Manage your collection")
        } else if (sellerDetails && (filters?.forSale || filters?.forTrade)) {
            uiStore.setTopbarValues(sellerDetails.storeName, sellerDetails.storeName, "")
        } else {
            uiStore.setTopbarValues(`${decksOrAlliances} of KeyForge`, decksOrAlliances, "Search, evaluate, buy and sell")
        }
    }

    render() {
        const {filters, history, location} = this.props
        const alliancePage = location.pathname.includes(Routes.allianceDecks)
        const {
            addingMoreDecks,
            searchingForDecks,
            moreDecksAvailable,
            showMoreDecks,
            countingDecks,
            displayDecks,
        } = alliancePage ? allianceDeckStore : deckStore

        let decksView

        const decks: DeckSearchResult[] | undefined = displayDecks()

        if (decks != null) {
            if (!searchingForDecks && decks.length === 0) {
                decksView = (
                    <Typography variant={"h6"} color={"secondary"} style={{marginTop: spacing(4)}}>
                        Sorry, no decks match your search criteria.
                    </Typography>
                )
            } else {
                const decks = displayDecks()
                if (keyLocalStorage.deckListViewType === "table") {
                    decksView = <DeckTableView decks={decks!}/>
                } else {
                    decksView = <DeckListView decks={decks!}/>
                }
            }
        }

        let showMoreButton = null
        if (moreDecksAvailable()) {
            showMoreButton = (
                <Box mx={2} mb={2}>
                    <KeyButton
                        disabled={addingMoreDecks || countingDecks}
                        loading={addingMoreDecks || countingDecks}
                        onClick={showMoreDecks}
                    >
                        Show more
                    </KeyButton>
                </Box>
            )
        }

        return (
            <div style={{display: "flex"}}>
                {filters != null ? (
                    <DecksSearchDrawer history={history} filters={filters} location={location}/>
                ) : (
                    <AllianceDecksSearchDrawer location={location} history={history}/>
                )}
                <ComparisonPopover/>
                <AllianceDeckPopover/>
                <div
                    style={{
                        flexGrow: 1,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: keyLocalStorage.deckListViewType === "table" ? undefined : "center",
                            justifyContent: "center",
                        }}
                    >
                        {screenStore.screenSizeXs() ? <Loader show={searchingForDecks}/> : null}
                        {filters?.isForSaleOrTrade && filters.owner != null &&
                            <SellerBanner sellerUsername={filters.owner}/>}
                        {decksView}
                        {showMoreButton}
                    </div>
                </div>
            </div>
        )
    }
}
