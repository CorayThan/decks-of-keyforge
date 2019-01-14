import Typography from "@material-ui/core/Typography"
import * as History from "history"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../../config/MuiConfig"
import { log, prettyJson } from "../../config/Utils"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { Loader } from "../../mui-restyled/Loader"
import { UiStore } from "../../ui/UiStore"
import { DeckStore } from "../DeckStore"
import { DeckViewSmall } from "../DeckViewSmall"
import { DeckFilters } from "./DeckFilters"
import { DecksSearchDrawer } from "./DecksSearchDrawer"

export class DeckSearchPage extends React.Component<RouteComponentProps<{}>> {

    componentDidMount(): void {
        log.debug("Deck search page component did mount")
        this.search(this.props)
    }

    componentWillReceiveProps(nextProps: Readonly<RouteComponentProps<{}>>): void {
        log.debug("Deck search page component will receive props")
        this.search(nextProps)
    }

    makeFilters = (props: Readonly<RouteComponentProps<{}>>): DeckFilters => {
        const queryValues = QueryString.parse(props.location.search)
        return DeckFilters.rehydrateFromQuery(queryValues)
    }

    search = (props: RouteComponentProps<{}>) => {
        log.debug(`Search with filters ${prettyJson(this.makeFilters(props).cleaned())}`)
        DeckStore.instance.searchDecks(this.makeFilters(props).cleaned())
    }

    render() {
        return (
            <DeckSearchContainer history={this.props.history} filters={this.makeFilters(this.props)}/>
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
        UiStore.instance.setTopbarValues("Decks of Keyforge", "Decks", "Search, evaluate, sell and trade")
    }

    render() {
        const {deckPage, addingMoreDecks, searchingForDecks, moreDecksAvailable, showMoreDecks} = DeckStore.instance

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
                        {deckPage.decks.map((deck) => (
                            <DeckViewSmall key={deck.id} deck={deck}/>
                        ))}
                    </div>
                )
            }
        }

        let showMoreButton = null
        if (moreDecksAvailable()) {
            showMoreButton = (
                <KeyButton
                    disabled={addingMoreDecks}
                    loading={addingMoreDecks}
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
                        <Loader show={searchingForDecks}/>
                        {decksToDisplay}
                        {showMoreButton}
                    </div>
                </div>
            </div>
        )
    }
}