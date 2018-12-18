import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { CardsPage } from "../cards/CardsPage"
import { DecksPage } from "../decks/DecksPage"

export {
    Routes,
    KeyRouter,
}

class Routes {
    static cards = "/cards"
    static decks = "/decks"
}

class KeyRouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route
                            path={Routes.cards}
                            component={CardsPage}
                        />
                        <Route
                            path={Routes.decks}
                            component={DecksPage}
                        />
                        <Route
                            component={DecksPage}
                        />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}
