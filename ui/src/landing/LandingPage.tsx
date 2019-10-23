import { Divider, List, ListSubheader, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyDrawer } from "../components/KeyDrawer"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths, Routes, StatsSubPaths } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { DeckSorts } from "../decks/selects/DeckSortSelect"
import { Expansion } from "../expansions/Expansions"
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
const topAerc = new DeckFilters()
topAerc.sort = DeckSorts.aerc
const topChains = new DeckFilters()
topChains.sort = DeckSorts.chains
const topFunny = new DeckFilters()
topFunny.sort = DeckSorts.funniest
const topWishlisted = new DeckFilters()
topWishlisted.sort = DeckSorts.wishlisted

const saleOrTrade = DeckFilters.forSaleOrTrade()

const auctions = new DeckFilters()
auctions.forAuction = true
auctions.includeUnregistered = true
auctions.sort = DeckSorts.endingSoonest

const completedAuctions = new DeckFilters()
completedAuctions.forAuction = true
completedAuctions.includeUnregistered = true
completedAuctions.completedAuctions = true
completedAuctions.sort = DeckSorts.completedRecently

const saleOrTradeAERC = DeckFilters.forSaleOrTrade()
saleOrTradeAERC.sort = DeckSorts.aerc

// const saleOrTradeRecent = DeckFilters.forSaleOrTrade()
// saleOrTradeRecent.sort = DeckSorts.recentlyListed

const worstSas = new DeckFilters()
worstSas.sortDirection = "ASC"

@observer
export class LandingPage extends React.Component<{}> {

    componentDidMount(): void {
        uiStore.setTopbarValues("Decks of KeyForge", "DoK", "Search, evaluate, sell and trade")
    }

    render() {

        const stats = statsStore.stats

        return (
            <div>
                <div style={{display: "flex"}}>
                    <KeyDrawer width={280} hamburgerMenu={true}>
                        <List>
                            <DeckSearchLink name={"Search Decks"} filters={topSas} dontSearch={true} style={{marginTop: spacing(2)}}/>
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                <DeckSearchLink name={"COTA"} filters={cota} style={{marginTop: spacing(2)}}/>
                                <DeckSearchLink name={"AOA"} filters={aoa} style={{marginTop: spacing(2)}}/>
                                <DeckSearchLink name={"WC"} filters={wc} style={{marginTop: spacing(2)}}/>
                            </div>
                            <Divider style={{marginTop: spacing(2)}}/>
                            <ListSubheader>
                                Top Decks
                            </ListSubheader>
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                <DeckSearchLink name={"SAS"} filters={topSas} color={"secondary"}/>
                                <DeckSearchLink name={"Chains"} filters={topChains} color={"secondary"}/>
                            </div>
                            <Divider style={{marginTop: spacing(2)}}/>
                            <ListSubheader>
                                Decks for Sale
                            </ListSubheader>
                            <DeckSearchLink name={"For Sale or Trade"} filters={saleOrTrade}/>
                            {/*<DeckSearchLink name={"Recently Listed"} filters={saleOrTradeRecent} style={{marginTop: spacing(2)}}/>*/}
                            <DeckSearchLink name={"Auctions"} filters={auctions} style={{marginTop: spacing(2)}}/>

                            <Divider style={{marginTop: spacing(2)}}/>
                            <ListSubheader>
                                Cards
                            </ListSubheader>
                            <CardSearchLink name={"Worlds Collide"} color={"secondary"} to={Routes.spoilers}/>
                            <CardSearchLink name={"Cards"} color={"secondary"} style={{marginTop: spacing(2)}}/>
                            <Divider style={{marginTop: spacing(2)}}/>
                            <ListSubheader>
                                Fun Searches
                            </ListSubheader>
                            <DeckSearchLink name={"Reversal"} filters={worstSas}/>
                            <DeckSearchLink name={"Funniest"} filters={topFunny} style={{marginTop: spacing(2)}}/>
                            <DeckSearchLink name={"Favorites"} filters={topWishlisted} style={{marginTop: spacing(2)}}/>
                        </List>
                    </KeyDrawer>
                    <div style={{flexGrow: 1}}>
                        {screenStore.screenSizeSm() ? (
                            <div style={{marginTop: spacing(4), display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                                <DeckSearchLink name={"Search"} filters={topSas} dontSearch={true} style={{margin: spacing(2)}}/>
                                <DeckSearchLink name={"For Sale"} filters={saleOrTrade} style={{margin: spacing(2)}}/>
                                <DeckSearchLink name={"Auctions"} filters={auctions} style={{margin: spacing(2)}}/>
                                <CardSearchLink name={"Worlds Collide"} color={"secondary"} to={Routes.spoilers} style={{margin: spacing(2)}}/>
                            </div>
                        ) : null}
                        <FeaturedSellersView/>
                        <div style={{margin: spacing(4)}}>
                            {/*<LastTwoArticles/>*/}
                            <UnstyledLink to={StatsSubPaths.winRates}>
                                <Typography
                                    variant={"h4"}
                                    color={"primary"}
                                    style={{marginBottom: spacing(4), marginTop: spacing(4)}}
                                >
                                    Stats
                                </Typography>
                            </UnstyledLink>
                            {stats == null ? <Loader/> : (
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    <WinRateBar name={"SAS Win Rate"} data={stats.sasWinRate}/>
                                    <WinRateBar name={"AERC Win Rate"} data={stats.aercWinRate} secondary={true}/>
                                </div>
                            )}
                            <UnstyledLink to={AboutSubPaths.contact}>
                                <Typography
                                    variant={"h4"}
                                    color={"primary"}
                                    style={{marginBottom: spacing(4), marginTop: spacing(4)}}
                                >
                                    Join in!
                                </Typography>
                            </UnstyledLink>
                            <div>
                                <PatronButton size={"large"}/>
                                <DiscordButton style={{marginLeft: spacing(2)}}/>
                                <TwitterButton style={{marginLeft: spacing(2)}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


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
