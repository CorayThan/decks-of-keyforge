import { isEqual } from "lodash"
import { autorun, IReactionDisposer } from "mobx"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { log } from "../../config/Utils"
import { Loader } from "../../mui-restyled/Loader"
import { screenStore } from "../../ui/ScreenStore"
import { uiStore } from "../../ui/UiStore"
import { userStore } from "../../user/UserStore"
import { CollectionStatsView } from "../collectionstats/CollectionStatsView"
import { deckStore } from "../DeckStore"
import { DeckFilters } from "./DeckFilters"
import { DecksSearchDrawer } from "./decksearchdrawer/DecksSearchDrawer"
import { DeckSearchContainerProps } from "./DeckSearchPage"

export class CollectionStatsSearchPage extends React.Component<RouteComponentProps> {

    componentDidMount(): void {
        if (this.props.location.search !== "") {
            this.search(this.makeFilters(this.props).cleaned())
        }
    }

    componentDidUpdate(prevProps: RouteComponentProps): void {
        const filters = this.makeFilters(this.props).cleaned()
        const prevFilters = this.makeFilters(prevProps).cleaned()
        if (!isEqual(filters, prevFilters)) {
            this.search(filters)
        }
    }

    componentWillUnmount(): void {
        deckStore.reset()
    }

    makeFilters = (props: Readonly<RouteComponentProps>): DeckFilters => {
        log.debug(`Location search is ${props.location.search}`)
        const queryValues = QueryString.parse(props.location.search)
        return DeckFilters.rehydrateFromQuery(queryValues)
    }

    search = (filters: DeckFilters) => {
        // log.debug(`Search with filters ${prettyJson(this.makeFilters(props).cleaned())}`)
        const defaultForSaleSearch = new DeckFilters()
        defaultForSaleSearch.forSale = true
        const defaultSearch = new DeckFilters()
        defaultSearch.reset()
        deckStore.calculateCollectionStats(filters)
    }

    render() {
        const filters = this.makeFilters(this.props)
        return (
            <CollectionStatsSearchContainer history={this.props.history} location={this.props.location} filters={filters}
                                            queryParams={this.props.location.search}/>
        )
    }
}

@observer
class CollectionStatsSearchContainer extends React.Component<DeckSearchContainerProps> {

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
        const {queryParams} = this.props

        let owner: string | undefined
        if (queryParams) {
            const queryValues = QueryString.parse(queryParams)
            owner = queryValues.owner as (string | undefined)
        }

        if (userStore.username != null && owner === userStore.username) {
            uiStore.setTopbarValues("My Stats", "My Stats", "Analyze your collection stats")
        } else {
            uiStore.setTopbarValues("Deck Statistics", "Deck Stats", "Analyze deck statistics")
        }
    }

    render() {
        const {collectionStats, calculatingStats} = deckStore
        const {filters, history, location} = this.props

        return (
            <div style={{display: "flex"}}>
                <DecksSearchDrawer history={history} filters={filters} location={location}/>
                <div
                    style={{
                        flexGrow: 1,
                    }}
                >
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        {screenStore.screenSizeXs() ? <Loader show={collectionStats == null || calculatingStats}/> : null}
                        {collectionStats != null && (
                            <CollectionStatsView stats={collectionStats}/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
