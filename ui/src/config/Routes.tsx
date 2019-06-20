import * as QueryString from "query-string"
import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { AboutPage } from "../about/AboutPage"
import { PrivacyPolicy } from "../about/PrivacyPolicy"
import { ArticlesPage } from "../articles/ArticlesPage"
import { CardsPage } from "../cards/CardsPage"
import { ChangePasswordPage } from "../components/ChangePasswordPage"
import { ForgotPasswordPage } from "../components/ForgotPasswordPage"
import { KeyTopbar } from "../components/KeyTopbar"
import { VerifyEmailPage } from "../components/VerifyEmailPage"
import { DeckViewPage } from "../decks/DeckViewFull"
import { ForSaleQuery, prepareForSaleQueryForQueryString } from "../decks/salenotifications/ForSaleQuery"
import { DeckFilters, prepareDeckFiltersForQueryString } from "../decks/search/DeckFilters"
import { DeckSearchPage } from "../decks/search/DeckSearchPage"
import { DeckImportView } from "../importdeck/DeckImportView"
import { LandingPage } from "../landing/LandingPage"
import { StatsPage } from "../stats/StatsPage"
import { SnackMessage } from "../ui/MessageStore"
import { MyProfile } from "../user/MyProfile"
import { ProfilePage } from "../user/ProfilePage"
import { RegistrationPage } from "../user/RegistrationPage"
import { userStore } from "../user/UserStore"
import { LoggedInRoute } from "./LoggedInRoute"
import { spacing } from "./MuiConfig"

export {
    Routes,
    KeyRouter,
}

class Routes {
    static readonly saleViewParam = "sellersView=true"

    static landing = ""
    static users = "/users"
    static myProfile = "/my-profile"
    static cards = "/cards"
    static about = "/about"
    static decks = "/decks"
    static stats = "/stats"
    static articles = "/articles"
    static importUnregisteredDeck = `${Routes.decks}/import`
    static registration = "/registration"
    static forgotPassword = "/forgot-password"
    static privacyPolicy = "/privacy-policy"
    static deckPage = (keyforgeDeckId?: string) => `${Routes.decks}/${keyforgeDeckId == null ? ":keyforgeDeckId" : keyforgeDeckId}`
    static changePasswordPage = (resetCode?: string) => `/reset-password/${resetCode == null ? ":resetCode" : resetCode}`
    static verifyEmailPage = (verificationCode?: string) => `/verify-email/${verificationCode == null ? ":verificationCode" : verificationCode}`
    static userProfilePage = (username?: string) => `${Routes.users}/${username == null ? ":username" : username}`
    static usersDecks = () => `/decks?owner=${userStore.username}&includeUnregistered=true`
    static usersDecksNotForSale = () => `/decks?owner=${userStore.username}&includeUnregistered=true&notForSale=true`
    static usersFavorites = () => `/decks?myFavorites=true&includeUnregistered=true`
    static articlePage = (urlTitle?: string) => `${Routes.articles}/${urlTitle == null ? ":urlTitle" : urlTitle}`

    /**
     * Deck filters should be cleaned.
     * @param filters
     * @param removeAuto
     */
    static deckSearch = (filters: DeckFilters) => {
        const cleaned = prepareDeckFiltersForQueryString(filters)
        return `${Routes.decks}?${QueryString.stringify(cleaned)}`
    }

    static deckSearchForSaleQuery = (filters: ForSaleQuery) => {
        const cleaned = prepareForSaleQueryForQueryString(filters)
        return `${Routes.decks}?${QueryString.stringify(cleaned)}`
    }

    static userDecksForSale = (username: string) => {
        const filters = DeckFilters.forSaleOrTrade()
        filters.owner = username
        return Routes.deckSearch(filters)
    }

    static sellersView = () => {
        const filters = DeckFilters.forSaleOrTrade()
        filters.owner = userStore.username!
        return Routes.deckSearch(filters) + "&" + Routes.saleViewParam
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
                        <LoggedInRoute
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
                            path={Routes.stats}
                            component={StatsPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.articles}
                            component={ArticlesPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.articlePage()}
                            component={ArticlesPage}
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
                            path={Routes.verifyEmailPage()}
                            component={VerifyEmailPage}
                        />
                        <Route
                            exact={true}
                            path={Routes.userProfilePage()}
                            component={ProfilePage}
                        />
                        <LoggedInRoute
                            exact={true}
                            path={Routes.myProfile}
                            component={MyProfile}
                        />
                        <Route
                            path={Routes.landing}
                            component={LandingPage}
                        />
                    </Switch>
                    <SnackMessage/>
                </div>
            </BrowserRouter>
        )
    }
}

export class AboutSubPaths {
    static sas = Routes.about + "/sas"
    static patreon = Routes.about + "/patreon"
    static contact = Routes.about + "/contact"
    static releaseNotes = Routes.about + "/release-notes"
    static sellersAndDevs = Routes.about + "/sellers-and-devs"
}

export class StatsSubPaths {
    static winRates = Routes.stats + "/win-rates"
    static deckStats = Routes.stats + "/deck-stats"
}
