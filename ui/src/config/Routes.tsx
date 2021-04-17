import { Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as QueryString from "query-string"
import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { AboutPage } from "../about/AboutPage"
import { CommunityPage } from "../about/CommunityPage"
import { PrivacyPolicy } from "../about/PrivacyPolicy"
import { ThirdPartyIntegrations } from "../about/ThirdPartyIntegrations"
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
import { ExpansionNumber } from "../expansions/Expansions"
import { UpdateExtraCardInfoPage } from "../extracardinfo/UpdateExtraCardInfoPage"
import { SaleNotificationQueryDto } from "../generated-src/SaleNotificationQueryDto"
import { DokIcon } from "../generic/icons/DokIcon"
import { CreateTheoreticalDeck } from "../importdeck/theoretical/CreateTheoreticalDeck"
import { ViewMyTheoreticalDecks } from "../importdeck/theoretical/ViewMyTheoreticalDecks"
import { ViewTheoreticalDeck } from "../importdeck/theoretical/ViewTheoreticalDeck"
import { KeyForgeEventsPage } from "../keyforgeevents/KeyForgeEventsPage"
import { TournamentPage } from "../keyforgeevents/tournaments/TournamentPage"
import { TournamentSearchPage } from "../keyforgeevents/tournaments/TournamentSearchPage"
import { LandingPage } from "../landing/LandingPage"
import { ViewMessagePage } from "../messages/ViewMessage"
import { MyDokPage } from "../my-dok/MyDokPage"
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

class Routes {

    static landing = ""
    static users = "/users"
    static community = "/community"
    static events = "/events"
    static myDok = "/my-dok"
    static tournaments = "/tournaments"
    static messages = "/messages"
    static adminPanel = "/admin-panel"
    static cards = "/cards"
    static extraCardInfo = "/extra-card-infos"
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
    static thirdPartyTools = "/third-party-tools"
    static editExtraCardInfo = (infoId?: string | number) => `${Routes.extraCardInfo}/edit/${infoId == null ? ":infoId" : infoId}`
    static theoreticalDeckPage = (id?: string) => `${Routes.theoreticalDecks}/${id == null ? ":id" : id}`
    static messagePage = (id?: number) => `${Routes.messages}/${id == null ? ":id" : id}`
    static deckPage = (keyforgeDeckId?: string) => `${Routes.decks}/${keyforgeDeckId == null ? ":keyforgeDeckId" : keyforgeDeckId}`
    static cardPage = (cardName?: string) => `${Routes.cards}/${cardName == null ? ":cardName" : cardNameToCardNameKey(cardName)}`
    static tournamentPage = (id?: number) => `${Routes.tournaments}/${id == null ? ":id" : id}`
    static changePasswordPage = (resetCode?: string) => `/reset-password/${resetCode == null ? ":resetCode" : resetCode}`
    static verifyEmailPage = (verificationCode?: string) => `/verify-email/${verificationCode == null ? ":verificationCode" : verificationCode}`
    static userProfilePage = (username?: string) => `${Routes.users}/${username == null ? ":username" : username}`
    static usersDecks = () => `/decks?owner=${userStore.username}`
    static analyzeUsersDecks = () => `/analyze-collection?owner=${userStore.username}`
    static teamDecks = () => `/decks?teamDecks=true`
    static usersDecksNotForSale = () => `/decks?owner=${userStore.username}&forSale=false`
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

    static tournamentDecksSearch = (tournamentId: number) => {
        const filters = new DeckFilters()
        filters.tournamentIds = [tournamentId]
        return Routes.deckSearch(filters)
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

    static cardsForExpansion = (expansion: ExpansionNumber) => {
        const filters = new CardFilters()
        filters.expansions = [expansion]
        return Routes.cardSearch(filters)
    }

    static decksForExpansion = (expansion: ExpansionNumber, mine?: boolean) => {
        const filters = new DeckFilters()
        filters.expansions = [expansion]
        if (mine && userStore.username != null) {
            filters.owner = userStore.username
        }
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
                        path={Routes.tournaments}
                        component={TournamentSearchPage}
                    />
                    <Route
                        exact={true}
                        path={Routes.tournamentPage()}
                        component={TournamentPage}
                    />
                    <Route
                        exact={true}
                        path={Routes.messagePage()}
                        component={ViewMessagePage}
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
                        path={Routes.myDok}
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
                        path={Routes.community}
                        component={CommunityPage}
                    />
                    <Route
                        path={Routes.users}
                        component={UserSearchPage}
                    />
                    <Route
                        path={Routes.events}
                        component={KeyForgeEventsPage}
                    />
                    <Route
                        path={Routes.thirdPartyTools}
                        component={ThirdPartyIntegrations}
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
                        path={Routes.editExtraCardInfo()}
                        component={UpdateExtraCardInfoPage}
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
}

export class StatsSubPaths {
    static winRates = Routes.stats + "/win-rates"
    static deckStats = Routes.stats + "/deck-stats"
    static aercStats = Routes.stats + "/aerc-stats"
    static purchaseStats = Routes.stats + "/purchase-stats"
}

export class MyDokSubPaths {
    static messages = Routes.myDok + "/messages"
    static profile = Routes.myDok + "/my-profile"
    static notifications = Routes.myDok + "/notifications"
    static offers = Routes.myDok + "/offers"
    static purchases = Routes.myDok + "/bought-and-sold"
    static team = Routes.myDok + "/my-team"
}

export {
    Routes,
    KeyRouter,
}
