import * as QueryString from "query-string"
import * as React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { CardsPage } from "../cards/CardsPage"
import { AboutPage } from "../components/AboutPage"
import { KeyTopbar } from "../components/KeyTopbar"
import { DeckViewPage } from "../decks/DeckViewFull"
import { DeckFilters } from "../decks/search/DeckFilters"
import { DeckSearchPage } from "../decks/search/DeckSearchPage"
import { ProfilePage } from "../user/ProfilePage"
import { RegistrationPage } from "../user/RegistrationPage"
import { spacing } from "./MuiConfig"

export {
    Routes,
    KeyRouter,
}

class Routes {
    static users = "/users"
    static cards = "/cards"
    static about = "/about"
    static decks = "/decks"
    static usersDecks = "/decks?myDecks=true"
    static registration = "/registration"
    static deckPage = (keyforgeDeckId?: string) => `${Routes.decks}/${keyforgeDeckId == null ? ":keyforgeDeckId" : keyforgeDeckId}`
    static userProfilePage = (username?: string) => `${Routes.users}/${username == null ? ":username" : username}`

    /**
     * Deck filters should be cleaned.
     * @param filters
     */
    static deckSearch = (filters: DeckFilters) => {
        return `${Routes.decks}?${QueryString.stringify(filters)}`
    }
}

class KeyRouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <KeyTopbar/>
                    <div style={{marginBottom: spacing(2)}}/>
                    <Switch>
                        <Route
                            exact={true}
                            path={Routes.deckPage()}
                            component={DeckViewPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.about}
                            component={AboutPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.cards}
                            component={CardsPage}
                        />
                        <Route
                            path={Routes.decks}
                            component={DeckSearchPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.registration}
                            component={RegistrationPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.userProfilePage()}
                            component={ProfilePage}
                        />
                        <Route render={() => <Redirect to={Routes.decks}/>}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}
