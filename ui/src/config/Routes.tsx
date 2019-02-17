import * as QueryString from "query-string"
import * as React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { AboutPage } from "../about/AboutPage"
import { PrivacyPolicy } from "../about/PrivacyPolicy"
import { CardsPage } from "../cards/CardsPage"
import { ChangePasswordPage } from "../components/ChangePasswordPage"
import { ForgotPasswordPage } from "../components/ForgotPasswordPage"
import { KeyTopbar } from "../components/KeyTopbar"
import { DeckViewPage } from "../decks/DeckViewFull"
import { DeckFilters } from "../decks/search/DeckFilters"
import { DeckSearchPage } from "../decks/search/DeckSearchPage"
import { DeckImportView } from "../importdeck/DeckImportView"
import { ProfilePage } from "../user/ProfilePage"
import { RegistrationPage } from "../user/RegistrationPage"
import { UserStore } from "../user/UserStore"
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
    static importUnregisteredDeck = `${Routes.decks}/import`
    static registration = "/registration"
    static forgotPassword = "/forgot-password"
    static privacyPolicy = "/privacy-policy"
    static deckPage = (keyforgeDeckId?: string) => `${Routes.decks}/${keyforgeDeckId == null ? ":keyforgeDeckId" : keyforgeDeckId}`
    static changePasswordPage = (resetCode?: string) => `/reset-password/${resetCode == null ? ":resetCode" : resetCode}`
    static userProfilePage = (username?: string) => `${Routes.users}/${username == null ? ":username" : username}`
    static usersDecks = () => `/decks?owner=${UserStore.instance.username}&includeUnregistered=true`

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
                            path={Routes.importUnregisteredDeck}
                            component={DeckImportView}
                        />
                        <Route
                            exact={true}
                            path={Routes.deckPage()}
                            component={DeckViewPage}
                        />
                        <Route
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
                            path={Routes.forgotPassword}
                            component={ForgotPasswordPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.privacyPolicy}
                            component={PrivacyPolicy}
                        />
                        <Route
                            exact={true}
                            path={Routes.changePasswordPage()}
                            component={ChangePasswordPage}
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

export class AboutSubPaths {
    static sas = Routes.about + "/sas"
    static contact = Routes.about + "/contact"
    static releaseNotes = Routes.about + "/release-notes"
    static sellers = Routes.about + "/sellers"
    static devs = Routes.about + "/devs"
}
