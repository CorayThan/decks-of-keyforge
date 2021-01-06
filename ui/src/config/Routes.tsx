import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { AboutPage } from "../about/AboutPage"
import { PrivacyPolicy } from "../about/PrivacyPolicy"
import { AdminPanelView } from "../admin/AdminPanelView"
import { ArticlesPage } from "../articles/ArticlesPage"
import { CardFilters, prepareCardFiltersForQueryString } from "../cards/CardFilters"
import { CardSearchPage } from "../cards/CardSearchPage"
import { cardNameToCardNameKey } from "../cards/KCard"
import { CardPage } from "../cards/views/CardPage"
import { ChangePasswordPage } from "../components/ChangePasswordPage"
import { ForgotPasswordPage } from "../components/ForgotPasswordPage"
import { KeyTopbar } from "../components/KeyTopbar"
import { VerifyEmailPage } from "../components/VerifyEmailPage"
import { DeckComparisonView } from "../decks/comparison/DeckComparisonView"
import { DeckViewPage } from "../decks/DeckViewFull"
import { prepareForSaleQueryForQueryString } from "../decks/salenotifications/ForSaleNotificationsStore"
import { CollectionStatsSearchPage } from "../decks/search/CollectionStatsSearchPage"
import { DeckFilters, prepareDeckFiltersForQueryString } from "../decks/search/DeckFilters"
import { DeckSearchPage } from "../decks/search/DeckSearchPage"
import { UpdateExtraCardInfoPage } from "../extracardinfo/UpdateExtraCardInfoPage"
import { UpdateSpoilerAerc } from "../extracardinfo/UpdateSpoilerAerc"
import { SaleNotificationQueryDto } from "../generated-src/SaleNotificationQueryDto"
import { DokIcon } from "../generic/icons/DokIcon"
import { CreateTheoreticalDeck } from "../importdeck/theoretical/CreateTheoreticalDeck"
import { ViewMyTheoreticalDecks } from "../importdeck/theoretical/ViewMyTheoreticalDecks"
import { ViewTheoreticalDeck } from "../importdeck/theoretical/ViewTheoreticalDeck"
import { LandingPage } from "../landing/LandingPage"
import { MyDokPage } from "../my-dok/MyDokPage"
import { AddSpoilerPage, EditSpoilerPage } from "../spoilers/AddSpoilerPage"
import { SpoilerPage } from "../spoilers/SpoilerPage"
import { SpoilersPage } from "../spoilers/SpoilersPage"
import { StatsPage } from "../stats/StatsPage"
import { TagSearchPage } from "../tags/TagSearchPage"
import { SnackMessage } from "../ui/MessageStore"
import { CodeOfConduct } from "../user/CodeOfConduct"
import { ProfilePage } from "../user/ProfilePage"
import { RegistrationPage } from "../user/RegistrationPage"
import { UserSearchPage } from "../user/search/UserSearchPage"
import { AgreeToTerms, TermsOfUse } from "../user/TermsOfUse"
import { userStore } from "../user/UserStore"
import { KeyLoaderBar } from "./KeyLoaderBar"
import { LoggedInRoute } from "./LoggedInRoute"
import { spacing } from "./MuiConfig"
import { serverStatusStore } from "./ServerStatusStore"

export class MyDokSubPaths {
    static base = "/my-dok"
    static profile = MyDokSubPaths.base + "/my-profile"
    static notifications = MyDokSubPaths.base + "/notifications"
    static offers = MyDokSubPaths.base + "/offers"
    static purchases = MyDokSubPaths.base + "/bought-and-sold"
    static team = MyDokSubPaths.base + "/my-team"
}

class Routes {

    static landing = ""
    static users = "/users"
    static adminPanel = "/admin-panel"
    static myProfile = MyDokSubPaths.profile
    static cards = "/cards"
    static cotaCards = "/cards?expansion=CALL_OF_THE_ARCHONS"
    static aoaCards = "/cards?expansion=AGE_OF_ASCENSION"
    static wcCards = "/cards?expansion=WORLDS_COLLIDE"
    static mmCards = "/cards?expansion=MASS_MUTATION"
    static spoilers = "/spoilers"
    static extraCardInfo = "/extra-card-infos"
    static createSpoiler = `/spoilers/create`
    static editSpoiler = (spoilerId?: string | number) => `${Routes.spoilers}/edit/${spoilerId == null ? ":spoilerId" : spoilerId}`
    static editSpoilerAerc = (spoilerId?: string | number) => `${Routes.spoilers}/edit-aerc/${spoilerId == null ? ":spoilerId" : spoilerId}`
    static editExtraCardInfo = (infoId?: string | number) => `${Routes.extraCardInfo}/edit/${infoId == null ? ":infoId" : infoId}`
    static about = "/about"
    static decks = "/decks"
    static tags = "/tags"
    static collectionStats = `/analyze-collection`
    static theoreticalDecks = "/theoretical-decks"
    static compareDecks = "/compare-decks"
    static myTheoreticalDecks = `${Routes.theoreticalDecks}/mine`
    static createTheoreticalDeck = `${Routes.theoreticalDecks}/create`
    static stats = "/stats"
    static articles = "/articles"
    static registration = "/registration"
    static forgotPassword = "/forgot-password"
    static privacyPolicy = "/privacy-policy"
    static termsOfUse = "/terms-of-use"
    static codeOfConduct = "/code-of-conduct"
    static theoreticalDeckPage = (id?: string) => `${Routes.theoreticalDecks}/${id == null ? ":id" : id}`
    static deckPage = (keyforgeDeckId?: string) => `${Routes.decks}/${keyforgeDeckId == null ? ":keyforgeDeckId" : keyforgeDeckId}`
    static cardPage = (cardName?: string) => `${Routes.cards}/${cardName == null ? ":cardName" : cardNameToCardNameKey(cardName)}`
    static spoilerPage = (spoilerId?: string | number) => `${Routes.spoilers}/${spoilerId == null ? ":spoilerId" : spoilerId}`
    static changePasswordPage = (resetCode?: string) => `/reset-password/${resetCode == null ? ":resetCode" : resetCode}`
    static verifyEmailPage = (verificationCode?: string) => `/verify-email/${verificationCode == null ? ":verificationCode" : verificationCode}`
    static userProfilePage = (username?: string) => `${Routes.users}/${username == null ? ":username" : username}`
    static usersDecks = () => `/decks?owner=${userStore.username}`
    static analyzeUsersDecks = () => `/analyze-collection?owner=${userStore.username}`
    static teamDecks = () => `/decks?teamDecks=true`
    static usersDecksNotForSale = () => `/decks?owner=${userStore.username}&forSale=false`
    static usersFavorites = () => `/decks?myFavorites=true`
    static usersCota = () => `/decks?owner=${userStore.username}&expansions=341`
    static usersAoa = () => `/decks?owner=${userStore.username}&expansions=435`
    static usersWc = () => `/decks?owner=${userStore.username}&expansions=452`
    static usersMm = () => `/decks?owner=${userStore.username}&expansions=479`
    static articlePage = (urlTitle?: string) => `${Routes.articles}/${urlTitle == null ? ":urlTitle" : urlTitle}`
    static userContent = (key: string) => `https://dok-user-content.s3-us-west-2.amazonaws.com/${key}`
    static compareDecksWithIds = (ids: string[]) => `${Routes.compareDecks}?${ids.map(id => `decks=${id}`).join("&")}`

    /**
     * Deck filters should be cleaned.
     * @param filters
     */
    static analyzeDeckSearch = (filters: DeckFilters) => {
        const cleaned = prepareDeckFiltersForQueryString(filters)
        const stringified = QueryString.stringify(cleaned)
        if (stringified === "") {
            return Routes.collectionStats
        }
        return `${Routes.collectionStats}?${stringified}`
    }

    /**
     * Deck filters should be cleaned.
     * @param filters
     */
    static deckSearch = (filters: DeckFilters) => {
        const cleaned = prepareDeckFiltersForQueryString(filters)
        const stringified = QueryString.stringify(cleaned)
        if (stringified === "") {
            return Routes.decks
        }
        return `${Routes.decks}?${stringified}`
    }

    static decksForUser = (username: string) => {
        const filters = new DeckFilters()
        filters.owner = username
        return Routes.deckSearch(filters)
    }

    static decksForUserOnMyTeam = (username: string) => {
        const filters = new DeckFilters()
        filters.owner = username
        filters.teamDecks = true
        return Routes.deckSearch(filters)
    }

    static decksForSale = () => {
        const filters = new DeckFilters()
        filters.forSale = true
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

    static deckSearchForSaleQuery = (filters: SaleNotificationQueryDto) => {
        const cleaned = prepareForSaleQueryForQueryString(filters)
        return `${Routes.decks}?${QueryString.stringify(cleaned)}`
    }

    static userDecksForSale = (username: string) => {
        const filters = DeckFilters.forSale()
        filters.owner = username
        return Routes.deckSearch(filters)
    }

    static sellersView = () => {
        const filters = DeckFilters.forSale()
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
                        path={Routes.adminPanel}
                        component={AdminPanelView}
                    />
                    <Route
                        exact={true}
                        path={Routes.createTheoreticalDeck}
                        component={CreateTheoreticalDeck}
                    />
                    <Route
                        exact={true}
                        path={Routes.myTheoreticalDecks}
                        component={ViewMyTheoreticalDecks}
                    />
                    <Route
                        exact={true}
                        path={Routes.theoreticalDeckPage()}
                        component={ViewTheoreticalDeck}
                    />
                    <Route
                        path={Routes.collectionStats}
                        component={CollectionStatsSearchPage}
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
                        path={Routes.compareDecks}
                        component={DeckComparisonView}
                    />
                    <Route
                        path={Routes.tags}
                        component={TagSearchPage}
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
                        path={Routes.termsOfUse}
                        component={TermsOfUse}
                    />
                    <Route
                        exact={true}
                        path={Routes.codeOfConduct}
                        component={CodeOfConduct}
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
                        path={Routes.editSpoilerAerc()}
                        component={UpdateSpoilerAerc}
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
                <KeyLoaderBar/>
                <AgreeToTerms/>
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
    static thirdPartyIntegrations = Routes.about + "/third-party-integrations"
}

export class StatsSubPaths {
    static winRates = Routes.stats + "/win-rates"
    static deckStats = Routes.stats + "/deck-stats"
    static aercStats = Routes.stats + "/aerc-stats"
    static purchaseStats = Routes.stats + "/purchase-stats"
}

export {
    Routes,
    KeyRouter,
}
