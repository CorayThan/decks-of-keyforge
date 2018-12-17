import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { CardsPage } from "../cards/CardsPage"
import { DecksPage } from "../decks/DecksPage"
import { KeyTopBar } from "../top-bar/KeyTopBar"

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
                    <KeyTopBar/>
                    <Switch>
                        <Route
                            path={Routes.cards}
                            component={CardsPage}
                        />
                        <Route
                            path={Routes.decks}
                            component={DecksPage}
                        />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}
