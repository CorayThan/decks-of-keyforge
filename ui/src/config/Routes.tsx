import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { CardsPage } from "../cards/CardsPage"
import { DecksPageComponent } from "../decks/DecksPageComponent"
import { DeckViewPage } from "../decks/DeckViewFull"
import { KeyTopbar } from "../layout-parts/KeyTopbar"
import { RegistrationPage } from "../user/RegistrationPage"

export {
    Routes,
    KeyRouter,
}

class Routes {
    static cards = "/cards"
    static decks = "/decks"
    static registration = "/registration"
    static deckPage = (keyforgeDeckId?: string) => `/decks/${keyforgeDeckId == null ? ":keyforgeDeckId" : keyforgeDeckId}`
}

class KeyRouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <KeyTopbar/>
                    <Switch>
                        <Route
                            exact={true}
                            path={Routes.cards}
                            component={CardsPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.decks}
                            component={DecksPageComponent}
                        />
                        <Route
                            exact={true}
                            path={Routes.registration}
                            component={RegistrationPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.deckPage()}
                            component={DeckViewPage}
                        />
                        <Route
                            component={DecksPageComponent}
                        />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}
