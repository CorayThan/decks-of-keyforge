import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { AboutPage } from "../about/AboutPage"
import { PrivacyPolicy } from "../about/PrivacyPolicy"
import { ArticlesPage } from "../articles/ArticlesPage"
import { CardFilters, prepareCardFiltersForQueryString } from "../cards/CardFilters"
import { CardPage } from "../cards/CardPage"
import { CardSearchPage } from "../cards/CardSearchPage"
import { cardNameToCardNameKey } from "../cards/KCard"
import { ChangePasswordPage } from "../components/ChangePasswordPage"
import { ForgotPasswordPage } from "../components/ForgotPasswordPage"
import { KeyTopbar } from "../components/KeyTopbar"
import { VerifyEmailPage } from "../components/VerifyEmailPage"
import { DeckViewPage } from "../decks/DeckViewFull"
import { ForSaleQuery, prepareForSaleQueryForQueryString } from "../decks/salenotifications/ForSaleQuery"
import { DeckFilters, prepareDeckFiltersForQueryString } from "../decks/search/DeckFilters"
import { DeckSearchPage } from "../decks/search/DeckSearchPage"
import { UpdateExtraCardInfoPage } from "../extracardinfo/UpdateExtraCardInfoPage"
import { DokIcon } from "../generic/icons/DokIcon"
import { DeckImportView } from "../importdeck/DeckImportView"
import { CreateTheoreticalDeck } from "../importdeck/theoretical/CreateTheoreticalDeck"
import { ViewTheoreticalDeck } from "../importdeck/theoretical/ViewTheoreticalDeck"
import { LandingPage } from "../landing/LandingPage"
import { MyDokPage } from "../my-dok/MyDokPage"
import { AddSpoilerPage, EditSpoilerPage } from "../spoilers/AddSpoilerPage"
import { SpoilerPage } from "../spoilers/SpoilerPage"
import { SpoilersPage } from "../spoilers/SpoilersPage"
import { StatsPage } from "../stats/StatsPage"
import { SnackMessage } from "../ui/MessageStore"
import { ProfilePage } from "../user/ProfilePage"
import { RegistrationPage } from "../user/RegistrationPage"
import { UserSearchPage } from "../user/search/UserSearchPage"
import { userStore } from "../user/UserStore"
import { LoggedInRoute } from "./LoggedInRoute"
import { spacing } from "./MuiConfig"
import { serverStatusStore } from "./ServerStatusStore"

export class MyDokSubPaths {
    static base = "/my-dok"
    static profile = MyDokSubPaths.base + "/my-profile"
    static notifications = MyDokSubPaths.base + "/notifications"
    static offers = MyDokSubPaths.base + "/offers"
}

class Routes {

    static landing = ""
    static users = "/users"
    static myProfile = MyDokSubPaths.profile
    static cards = "/cards"
    static cotaCards = "/cards?expansion=CALL_OF_THE_ARCHONS"
    static aoaCards = "/cards?expansion=AGE_OF_ASCENSION"
    static wcCards = "/cards?expansion=WORLDS_COLLIDE"
    static spoilers = "/spoilers"
    static extraCardInfo = "/extra-card-infos"
    static createSpoiler = `/spoilers/create`
    static editSpoiler = (spoilerId?: string | number) => `${Routes.spoilers}/edit/${spoilerId == null ? ":spoilerId" : spoilerId}`
    static editExtraCardInfo = (infoId?: string | number) => `${Routes.extraCardInfo}/edit/${infoId == null ? ":infoId" : infoId}`
    static about = "/about"
    static decks = "/decks"
    static theoreticalDecks = "/theoretical-decks"
    static createTheoreticalDeck = `${Routes.theoreticalDecks}/create`
    static stats = "/stats"
    static articles = "/articles"
    static importUnregisteredDeck = `${Routes.decks}/import`
    static registration = "/registration"
    static forgotPassword = "/forgot-password"
    static privacyPolicy = "/privacy-policy"
    static theoreticalDeckPage = (uriEncodedDeck?: string) => `${Routes.theoreticalDecks}/${uriEncodedDeck == null ? ":uriEncodedDeck" : uriEncodedDeck}`
    static deckPage = (keyforgeDeckId?: string) => `${Routes.decks}/${keyforgeDeckId == null ? ":keyforgeDeckId" : keyforgeDeckId}`
    static cardPage = (cardName?: string) => `${Routes.cards}/${cardName == null ? ":cardName" : cardNameToCardNameKey(cardName)}`
    static spoilerPage = (spoilerId?: string | number) => `${Routes.spoilers}/${spoilerId == null ? ":spoilerId" : spoilerId}`
    static changePasswordPage = (resetCode?: string) => `/reset-password/${resetCode == null ? ":resetCode" : resetCode}`
    static verifyEmailPage = (verificationCode?: string) => `/verify-email/${verificationCode == null ? ":verificationCode" : verificationCode}`
    static userProfilePage = (username?: string) => `${Routes.users}/${username == null ? ":username" : username}`
    static usersDecks = () => `/decks?owner=${userStore.username}`
    static usersDecksNotForSale = () => `/decks?owner=${userStore.username}&forSale=false`
    static usersFavorites = () => `/decks?myFavorites=true`
    static usersCota = () => `/decks?owner=${userStore.username}&expansions=341`
    static usersAoa = () => `/decks?owner=${userStore.username}&expansions=435`
    static usersWc = () => `/decks?owner=${userStore.username}&expansions=452`
    static articlePage = (urlTitle?: string) => `${Routes.articles}/${urlTitle == null ? ":urlTitle" : urlTitle}`

    /**
     * Deck filters should be cleaned.
     * @param filters
     */
    static deckSearch = (filters: DeckFilters) => {
        const cleaned = prepareDeckFiltersForQueryString(filters)
        return `${Routes.decks}?${QueryString.stringify(cleaned)}`
    }

    static decksForUser = (username: string) => {
        const filters = new DeckFilters()
        filters.owner = username
        return Routes.deckSearch(filters)
    }

    /**
     * Card filters should be cleaned.
     * @param filters
     */
    static cardSearch = (filters: CardFilters) => {
        const cleaned = prepareCardFiltersForQueryString(filters)
        return `${Routes.cards}?${QueryString.stringify(cleaned)}`
    }

    static cardsUpdate = (aercHistoryDate: string) => {
        const filters = new CardFilters()
        filters.aercHistory = true
        filters.aercHistoryDate = aercHistoryDate
        return Routes.cardSearch(filters)
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
        filters.forSale = true
        return Routes.deckSearch(filters)
    }

}

const KeyRouter = observer(() => {

    if (serverStatusStore.siteUpdating) {
        return (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: spacing(4)}}>
                <DokIcon height={80} style={{}}/>
                <Typography variant={"h4"} style={{marginTop: spacing(2)}}>Site update in progress</Typography>
                <Typography style={{marginTop: spacing(2)}}>Refresh this page to check if the update is complete.</Typography>
            </div>
        )
    }

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
                        path={Routes.createTheoreticalDeck}
                        component={CreateTheoreticalDeck}
                    />
                    <Route
                        exact={true}
                        path={Routes.theoreticalDeckPage()}
                        component={ViewTheoreticalDeck}
                    />
                    <Route
                        exact={true}
                        path={Routes.deckPage()}
                        component={DeckViewPage}
                    />
                    <Route
                        exact={true}
                        path={Routes.cardPage()}
                        component={CardPage}
                    />
                    <Route
                        exact={true}
                        path={Routes.userProfilePage()}
                        component={ProfilePage}
                    />
                    <Route
                        path={Routes.about}
                        component={AboutPage}
                    />
                    <LoggedInRoute
                        path={MyDokSubPaths.base}
                        component={MyDokPage}
                    />
                    <Route
                        exact={true}
                        path={Routes.cards}
                        component={CardSearchPage}
                    />
                    <Route
                        path={Routes.decks}
                        component={DeckSearchPage}
                    />
                    <Route
                        path={Routes.users}
                        component={UserSearchPage}
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
                    <LoggedInRoute
                        exact={true}
                        path={Routes.editSpoiler()}
                        component={EditSpoilerPage}
                    />
                    <LoggedInRoute
                        exact={true}
                        path={Routes.editExtraCardInfo()}
                        component={UpdateExtraCardInfoPage}
                    />
                    <LoggedInRoute
                        exact={true}
                        path={Routes.createSpoiler}
                        component={AddSpoilerPage}
                    />
                    <Route
                        exact={true}
                        path={Routes.spoilerPage()}
                        component={SpoilerPage}
                    />
                    <Route
                        path={Routes.spoilers}
                        component={SpoilersPage}
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
})

export class AboutSubPaths {
    static sas = Routes.about + "/sas"
    static patreon = Routes.about + "/patreon"
    static contact = Routes.about + "/contact"
    static releaseNotes = Routes.about + "/release-notes"
    static sellersAndDevs = Routes.about + "/sellers-and-devs"
    static teamSas = Routes.about + "/team-sas"
}

export class StatsSubPaths {
    static winRates = Routes.stats + "/win-rates"
    static deckStats = Routes.stats + "/deck-stats"
    static aercStats = Routes.stats + "/aerc-stats"
}

export {
    Routes,
    KeyRouter,
}
