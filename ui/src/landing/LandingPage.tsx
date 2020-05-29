import { Divider, List, ListSubheader, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { Link } from "react-router-dom"
import { KeyDrawer } from "../components/KeyDrawer"
import { spacing, themeStore } from "../config/MuiConfig"
import { AboutSubPaths, Routes, StatsSubPaths } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { DeckSorts } from "../decks/selects/DeckSortSelect"
import { ExpansionIcon } from "../expansions/ExpansionIcon"
import { BackendExpansion, Expansion } from "../expansions/Expansions"
import { UnstyledLink } from "../generic/UnstyledLink"
import { Loader } from "../mui-restyled/Loader"
import { FeaturedSellersView } from "../sellers/FeaturedSellersView"
import { statsStore } from "../stats/StatsStore"
import { WinRateBar } from "../stats/WinRateStatsView"
import { DiscordButton } from "../thirdpartysites/discord/DiscordButton"
import { PatronButton } from "../thirdpartysites/patreon/PatronButton"
import { TwitterButton } from "../thirdpartysites/twitter/TwitterButton"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { CardSearchLink, DeckSearchLink } from "./DeckSearchLink"

const topSas = new DeckFilters()
const cota = new DeckFilters()
cota.expansions = [Expansion.COTA]
const aoa = new DeckFilters()
aoa.expansions = [Expansion.AOA]
const wc = new DeckFilters()
wc.expansions = [Expansion.WC]
const mm = new DeckFilters()
mm.expansions = [Expansion.MM]
const topAerc = new DeckFilters()
topAerc.sort = DeckSorts.aerc
const topChains = new DeckFilters()
topChains.sort = DeckSorts.chains
const topPowerLevel = new DeckFilters()
topPowerLevel.sort = DeckSorts.powerLevel
const topFunny = new DeckFilters()
topFunny.sort = DeckSorts.funniest
const topWishlisted = new DeckFilters()
topWishlisted.sort = DeckSorts.wishlisted

const forSale = DeckFilters.forSale()

const auctions = new DeckFilters()
auctions.forAuction = true
auctions.sort = DeckSorts.endingSoonest

const completedAuctions = new DeckFilters()
completedAuctions.completedAuctions = true
completedAuctions.sort = DeckSorts.completedRecently

const worstSas = new DeckFilters()
worstSas.sortDirection = "ASC"

export const landingPageDrawerWidth = 280

@observer
export class LandingPage extends React.Component<{}> {

    componentDidMount(): void {
        uiStore.setTopbarValues("DoK", "DoK", "Search, evaluate and buy KeyForge decks")
    }

    render() {

        const stats = statsStore.stats

        return (
            <div>
                <div style={{display: "flex"}}>
                    <KeyDrawer width={landingPageDrawerWidth} hamburgerMenu={true}>
                        <List>
                            <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(2)}}>
                                <DeckSearchLink name={"Search Decks"} filters={topSas} dontSearch={true}/>
                                <DeckSearchLink
                                    name={<ExpansionIcon expansion={BackendExpansion.MASS_MUTATION} white={true}/>} filters={mm}
                                />
                            </div>
                            <div style={{paddingRight: spacing(2)}}>
                                <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(2)}}>
                                    <DeckSearchLink
                                        name={<ExpansionIcon expansion={BackendExpansion.CALL_OF_THE_ARCHONS} white={true}/>} filters={cota}
                                        style={{marginBottom: spacing(2)}}
                                    />
                                    <DeckSearchLink
                                        name={<ExpansionIcon expansion={BackendExpansion.AGE_OF_ASCENSION} white={true}/>} filters={aoa}
                                        style={{marginBottom: spacing(2)}}
                                    />
                                    <DeckSearchLink
                                        name={<ExpansionIcon expansion={BackendExpansion.WORLDS_COLLIDE} white={true}/>} filters={wc}
                                        style={{marginBottom: spacing(2)}}
                                    />
                                </div>
                            </div>
                            <Divider/>
                            <ListSubheader>
                                Top Decks
                            </ListSubheader>
                            <div style={{paddingRight: spacing(2)}}>
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    <DeckSearchLink name={"SAS"} filters={topSas} color={"secondary"} style={{marginBottom: spacing(2)}}/>
                                    <DeckSearchLink name={"Chains"} filters={topChains} color={"secondary"} style={{marginBottom: spacing(2)}}/>
                                    <DeckSearchLink name={"Power Level"} filters={topPowerLevel} color={"secondary"} style={{marginBottom: spacing(2)}}/>
                                </div>
                            </div>
                            <Divider/>
                            <ListSubheader>
                                Decks for Sale
                            </ListSubheader>
                            <DeckSearchLink name={"For Sale"} filters={forSale}/>
                            {/*<DeckSearchLink name={"Recently Listed"} filters={saleOrTradeRecent} style={{marginTop: spacing(2)}}/>*/}
                            <DeckSearchLink name={"Auctions"} filters={auctions} style={{marginTop: spacing(2)}}/>

                            <Divider style={{marginTop: spacing(2)}}/>
                            <ListSubheader>
                                Cards
                            </ListSubheader>
                            <div style={{paddingRight: spacing(2)}}>
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    <CardSearchLink name={"Search Cards"} color={"secondary"} style={{marginBottom: spacing(2)}}/>
                                    <CardSearchLink
                                        name={<ExpansionIcon expansion={BackendExpansion.MASS_MUTATION} white={false}/>} color={"secondary"}
                                        to={Routes.mmCards} style={{marginBottom: spacing(2)}}
                                    />
                                </div>
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    <CardSearchLink
                                        name={<ExpansionIcon expansion={BackendExpansion.CALL_OF_THE_ARCHONS} white={false}/>} color={"secondary"}
                                        to={Routes.cotaCards} style={{marginBottom: spacing(2)}}
                                    />
                                    <CardSearchLink
                                        name={<ExpansionIcon expansion={BackendExpansion.AGE_OF_ASCENSION} white={false}/>} color={"secondary"}
                                        to={Routes.aoaCards} style={{marginBottom: spacing(2)}}
                                    />
                                    <CardSearchLink
                                        name={<ExpansionIcon expansion={BackendExpansion.WORLDS_COLLIDE} white={false}/>} color={"secondary"}
                                        to={Routes.wcCards} style={{marginBottom: spacing(2)}}
                                    />
                                </div>
                            </div>
                            <Divider/>
                            <ListSubheader>
                                Fun Searches
                            </ListSubheader>
                            <DeckSearchLink name={"Reversal"} filters={worstSas}/>
                            <DeckSearchLink name={"Funniest"} filters={topFunny} style={{marginTop: spacing(2)}}/>
                        </List>
                    </KeyDrawer>
                    <div style={{flexGrow: 1}}>
                        {screenStore.screenSizeSm() ? (
                            <div style={{marginTop: spacing(4), display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                                <DeckSearchLink name={"Search"} filters={topSas} dontSearch={true} style={{margin: spacing(2)}}/>
                                <DeckSearchLink name={"For Sale"} filters={forSale} style={{margin: spacing(2)}}/>
                                <DeckSearchLink name={"Auctions"} filters={auctions} style={{margin: spacing(2)}}/>
                            </div>
                        ) : null}
                        <FeaturedSellersView/>
                        <div style={{marginLeft: spacing(2)}}>
                            <div style={{marginLeft: spacing(2)}}>
                                {/*<LastTwoArticles/>*/}
                                <UnstyledLink to={StatsSubPaths.winRates}>
                                    <LandingPageTitle>
                                        Stats
                                    </LandingPageTitle>
                                </UnstyledLink>
                            </div>
                            {stats == null ? <Loader/> : (
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    <WinRateBar name={"SAS Win Rate"} data={stats.sasWinRate}/>
                                    <WinRateBar name={"AERC Win Rate"} data={stats.aercWinRate} secondary={true}/>
                                </div>
                            )}
                        </div>
                        <div style={{margin: spacing(4)}}>
                            <UnstyledLink to={AboutSubPaths.contact}>
                                <LandingPageTitle>
                                    Join in!
                                </LandingPageTitle>
                            </UnstyledLink>
                            <div>
                                <PatronButton size={"large"}/>
                                <DiscordButton style={{marginLeft: spacing(2)}}/>
                                <TwitterButton style={{marginLeft: spacing(2)}}/>
                            </div>
                            <LandingPageTitle>
                                Disclaimers
                            </LandingPageTitle>
                            <Typography style={{marginBottom: spacing(1)}}>
                                DoK (a.k.a. decksofkeyforge.com) is not associated with or endorsed by Fantasy Flight Games, the producers of KeyForge, in any
                                way.
                            </Typography>
                            <Typography style={{marginBottom: spacing(1)}}>
                                DoK is owned and operated by Graylake LLC. For questions or comments check out the
                                <Link to={AboutSubPaths.contact}>contact me page</Link>!
                            </Typography>
                            <Typography>
                                When using DoK you buy and sell decks entirely at your own risk. We make no guarantees about the safety of
                                any transactions.
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export const LandingPageTitle = observer((props: { children: string }) => {
    return (
        <Typography
            variant={"h4"}
            color={themeStore.darkMode ? "textPrimary" : "primary"}
            style={{marginBottom: spacing(2), marginTop: spacing(4)}}
        >
            {props.children}
        </Typography>
    )
})


// const LastTwoArticles = () => {
//     return (
//         <>
//             <UnstyledLink to={Routes.articles}>
//                 <Typography
//                     variant={"h4"}
//                     color={"primary"}
//                     style={{marginBottom: spacing(4), marginTop: spacing(4)}}
//                 >
//                     Articles
//                 </Typography>
//             </UnstyledLink>
//             {latestTwoArticles.map((article: Article, idx: number) => <ArticleView article={article} key={idx} snippet={true}/>)}
//         </>
//     )
// }
