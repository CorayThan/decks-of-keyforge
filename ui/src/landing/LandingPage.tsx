import { Divider, List, ListSubheader, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { Article } from "../articles/Article"
import { latestTwoArticles } from "../articles/ArticlesPage"
import { ArticleView } from "../articles/ArticleView"
import { KeyDrawer } from "../components/KeyDrawer"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { DeckSorts } from "../decks/selects/DeckSortSelect"
import { UnstyledLink } from "../generic/UnstyledLink"
import { Loader } from "../mui-restyled/Loader"
import { FeaturedSellersView } from "../sellers/FeaturedSellersView"
import { statsStore } from "../stats/StatsStore"
import { WinRateBar } from "../stats/WinRateStatsView"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { DeckSearchLink } from "./DeckSearchLink"

const topSas = new DeckFilters()
const topAerc = new DeckFilters()
topAerc.sort = DeckSorts.aerc
const topChains = new DeckFilters()
topChains.sort = DeckSorts.chains
const topFunny = new DeckFilters()
topFunny.sort = DeckSorts.funniest
const topWishlisted = new DeckFilters()
topWishlisted.sort = DeckSorts.wishlisted

const saleOrTrade = new DeckFilters()
saleOrTrade.forSale = true
saleOrTrade.forTrade = true
saleOrTrade.includeUnregistered = true

const saleOrTradeAERC = new DeckFilters()
saleOrTradeAERC.forSale = true
saleOrTradeAERC.forTrade = true
saleOrTradeAERC.sort = DeckSorts.aerc
saleOrTradeAERC.includeUnregistered = true

const saleOrTradeRecent = new DeckFilters()
saleOrTradeRecent.forSale = true
saleOrTradeRecent.forTrade = true
saleOrTradeRecent.sort = DeckSorts.recentlyListed
saleOrTradeRecent.includeUnregistered = true

const worstSas = new DeckFilters()
worstSas.sortDirection = "ASC"

@observer
export class LandingPage extends React.Component<{}> {

    componentDidMount(): void {
        uiStore.setTopbarValues("Decks of Keyforge", "DoK", "Search, evaluate, sell and trade")
    }

    render() {

        const stats = statsStore.stats

        return (
            <div>
                <div style={{display: "flex"}}>
                    <KeyDrawer width={240} hamburgerMenu={true}>
                        <List>
                            <DeckSearchLink name={"Search Decks"} filters={topSas} dontSearch={true} style={{marginTop: spacing(2)}}/>
                            <Divider style={{marginTop: spacing(2)}}/>
                            <ListSubheader>
                                Top Decks
                            </ListSubheader>
                            <DeckSearchLink name={"SAS"} filters={topSas} color={"secondary"}/>
                            <DeckSearchLink name={"AERC"} filters={topAerc} color={"secondary"} style={{marginTop: spacing(2)}}/>
                            <DeckSearchLink name={"Chains"} filters={topChains} color={"secondary"} style={{marginTop: spacing(2)}}/>
                            <Divider style={{marginTop: spacing(2)}}/>
                            <ListSubheader>
                                Decks for Sale
                            </ListSubheader>
                            <DeckSearchLink name={"For Sale or Trade"} filters={saleOrTrade}/>
                            <DeckSearchLink name={"By AERC"} filters={saleOrTradeAERC} style={{marginTop: spacing(2)}}/>
                            <DeckSearchLink name={"Recently Listed"} filters={saleOrTradeRecent} style={{marginTop: spacing(2)}}/>

                            <Divider style={{marginTop: spacing(2)}}/>
                            <ListSubheader>
                                Fun Searches
                            </ListSubheader>
                            <DeckSearchLink name={"Funniest"} filters={topFunny} color={"secondary"}/>
                            <DeckSearchLink name={"Most Favorited"} filters={topWishlisted} color={"secondary"} style={{marginTop: spacing(2)}}/>
                            <DeckSearchLink name={"Worst by SAS"} filters={worstSas} color={"secondary"} style={{marginTop: spacing(2)}}/>
                        </List>
                    </KeyDrawer>
                    <div style={{flexGrow: 1}}>
                        {screenStore.screenSizeSm() ? (
                            <div style={{marginTop: spacing(4), display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                                <DeckSearchLink name={"Search Decks"} filters={topSas} dontSearch={true} style={{margin: spacing(2)}}/>
                                <DeckSearchLink name={"Decks For Sale"} filters={saleOrTrade} style={{margin: spacing(2)}}/>
                            </div>
                        ) : null}
                        <FeaturedSellersView/>
                        <div style={{margin: spacing(4)}}>
                            <UnstyledLink to={Routes.articles}>
                                <Typography
                                    variant={"h4"}
                                    color={"primary"}
                                    style={{marginBottom: spacing(4), marginTop: spacing(4)}}
                                >
                                    Articles
                                </Typography>
                            </UnstyledLink>
                            {latestTwoArticles.map((article: Article, idx: number) => <ArticleView article={article} key={idx} snippet={true}/>)}
                            <UnstyledLink to={Routes.stats}>
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
