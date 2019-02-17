import Typography from "@material-ui/core/Typography"
import * as History from "history"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { Loader } from "../../mui-restyled/Loader"
import { screenStore } from "../../ui/ScreenStore"
import { UiStore } from "../../ui/UiStore"
import { UserStore } from "../../user/UserStore"
import { DeckListView, DeckTableView } from "../DeckListView"
import { DeckStore } from "../DeckStore"
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
        DeckStore.instance.searchDecks(this.makeFilters(props).cleaned())
    }

    render() {
        const filters = this.makeFilters(this.props)
        return (
            <DeckSearchContainer history={this.props.history} filters={filters}/>
        )
    }
}

interface DeckSearchContainerProps {
    history: History.History
    filters: DeckFilters
}

@observer
class DeckSearchContainer extends React.Component<DeckSearchContainerProps> {

    constructor(props: DeckSearchContainerProps) {
        super(props)
        if (props.filters.owner && props.filters.owner === UserStore.instance.username) {
            UiStore.instance.setTopbarValues("Decks of Keyforge", "Decks", "Search, evaluate, sell and trade")
        } else {
            UiStore.instance.setTopbarValues("My Decks", "My Decks", "Search, evaluate, sell and trade")
        }
    }

    render() {
        const {deckPage, addingMoreDecks, searchingForDecks, moreDecksAvailable, showMoreDecks, countingDecks} = DeckStore.instance

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