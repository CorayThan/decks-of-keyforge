import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { CardsPage } from "../cards/CardsPage"
import { DecksPageComponent } from "../decks/DecksPageComponent"
import { RegistrationPage } from "../user/RegistrationPage"

export {
    Routes,
    KeyRouter,
}

class Routes {
    static cards = "/cards"
    static decks = "/decks"
    static registration = "/registration"
    static login = "/login"
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
                            component={DecksPageComponent}
                        />
                        <Route
                            path={Routes.registration}
                            component={RegistrationPage}
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
