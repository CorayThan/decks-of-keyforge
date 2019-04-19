import Typography from "@material-ui/core/Typography"
import * as History from "history"
import { autorun, IReactionDisposer } from "mobx"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { Loader } from "../../mui-restyled/Loader"
import { SellerDetails } from "../../sellers/SellerDetails"
import { sellerStore } from "../../sellers/SellerStore"
import { screenStore } from "../../ui/ScreenStore"
import { uiStore } from "../../ui/UiStore"
import { userStore } from "../../user/UserStore"
import { DeckListView, DeckTableView } from "../DeckListView"
import { deckStore } from "../DeckStore"
import { DeckFilters } from "./DeckFilters"
import { DecksSearchDrawer } from "./DecksSearchDrawer"

export class DeckSearchPage extends React.Component<RouteComponentProps<{}>> {

    componentDidMount(): void {
        this.search(this.props)
    }

    componentWillReceiveProps(nextProps: Readonly<RouteComponentProps<{}>>): void {
        this.search(nextProps)
    }

    componentWillUnmount(): void {
        deckStore.reset()
    }

    makeFilters = (props: Readonly<RouteComponentProps<{}>>): DeckFilters => {
        const queryValues = QueryString.parse(props.location.search)
        return DeckFilters.rehydrateFromQuery(queryValues)
    }

    search = (props: RouteComponentProps<{}>) => {
        // log.debug(`Search with filters ${prettyJson(this.makeFilters(props).cleaned())}`)
        if (deckStore.autoSearch) {
            deckStore.searchDecks(this.makeFilters(props).cleaned())
        } else {
            deckStore.autoSearch = true
        }
    }

    render() {
        const filters = this.makeFilters(this.props)
        return (
            <DeckSearchContainer history={this.props.history} filters={filters} queryParams={this.props.location.search}/>
        )
    }
}

interface DeckSearchContainerProps {
    history: History.History
    filters: DeckFilters
    queryParams: string
}

@observer
class DeckSearchContainer extends React.Component<DeckSearchContainerProps> {

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
        const {filters, queryParams} = this.props

        let owner: string | undefined
        let sellerDetails: SellerDetails | undefined
        if (queryParams) {
            const queryValues = QueryString.parse(queryParams)
            owner = queryValues.owner as (string | undefined)
            if (owner) {
                sellerDetails = sellerStore.findSellerWithUsername(owner)
            }
        }

        if (userStore.username != null && owner === userStore.username) {
            uiStore.setTopbarValues("My Decks", "My Decks", "Search, evaluate, sell and trade")
        } else if (sellerDetails && (filters.forSale || filters.forTrade)) {
            uiStore.setTopbarValues(sellerDetails.storeName, sellerDetails.storeName, "A featured seller store")
        } else {
            uiStore.setTopbarValues("Decks of Keyforge", "Decks", "Search, evaluate, sell and trade")
        }
    }

    render() {
        const {deckPage, addingMoreDecks, searchingForDecks, moreDecksAvailable, showMoreDecks, countingDecks} = deckStore
        const {filters, history} = this.props

        let decksToDisplay = null
        if (deckPage != null) {
            if (deckPage.decks.length === 0) {
                decksToDisplay = (
                    <Typography variant={"h6"} color={"secondary"} style={{marginTop: spacing(4)}}>
                        Sorry, no decks match your search criteria.
                    </Typography>
                )
            } else {
                decksToDisplay = (
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        {keyLocalStorage.showTableView ? <DeckTableView decks={deckPage.decks}/> : <DeckListView decks={deckPage.decks}/>}
                    </div>
                )
            }
        }

        let showMoreButton = null
        if (moreDecksAvailable()) {
            showMoreButton = (
                <KeyButton
                    disabled={addingMoreDecks || countingDecks}
                    loading={addingMoreDecks || countingDecks}
                    onClick={showMoreDecks}
                >
                    Show more
                </KeyButton>
            )
        }

        return (
            <div style={{display: "flex"}}>
                <DecksSearchDrawer history={history} filters={filters}/>
                <div
                    style={{
                        flexGrow: 1,
                        margin: spacing(2),
                    }}
                >
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        {screenStore.screenSizeXs() ? <Loader show={searchingForDecks}/> : null}
                        {decksToDisplay}
                        {showMoreButton}
                    </div>
                </div>
            </div>
        )
    }
}