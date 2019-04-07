import Typography from "@material-ui/core/Typography"
import * as History from "history"
import { autorun } from "mobx"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { Loader } from "../../mui-restyled/Loader"
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

    makeFilters = (props: Readonly<RouteComponentProps<{}>>): DeckFilters => {
        const queryValues = QueryString.parse(props.location.search)
        return DeckFilters.rehydrateFromQuery(queryValues)
    }

    search = (props: RouteComponentProps<{}>) => {
        // log.debug(`Search with filters ${prettyJson(this.makeFilters(props).cleaned())}`)
        deckStore.searchDecks(this.makeFilters(props).cleaned())
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

    componentDidMount(): void {
        this.setTitle()
        autorun(() => {
            this.setTitle()
        })
    }

    setTitle = () => {
        if (this.props.queryParams && this.props.queryParams.includes(`owner=${userStore.username}`)) {
            uiStore.setTopbarValues("My Decks", "My Decks", "Search, evaluate, sell and trade")
        } else {
            uiStore.setTopbarValues("Decks of Keyforge", "Decks", "Search, evaluate, sell and trade")
        }
    }

    render() {
        const {deckPage, addingMoreDecks, searchingForDecks, moreDecksAvailable, showMoreDecks, countingDecks} = deckStore

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
                <DecksSearchDrawer history={this.props.history} filters={this.props.filters}/>
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