import { Box, Divider, List, ListSubheader, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { Link } from "react-router-dom"
import { KeyDrawer } from "../components/KeyDrawer"
import { spacing, themeStore } from "../config/MuiConfig"
import { AboutSubPaths, Routes, StatsSubPaths } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { DeckSorts } from "../decks/selects/DeckSortSelect"
import { ExpansionIcon } from "../expansions/ExpansionIcon"
import { ExpansionNumber } from "../expansions/Expansions"
import { Expansion } from "../generated-src/Expansion"
import { UnstyledLink } from "../generic/UnstyledLink"
import { PromotedKeyForgeEvents } from "../keyforgeevents/PromotedKeyForgeEvents"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { FeaturedSellersView } from "../sellers/FeaturedSellersView"
import { statsStore } from "../stats/StatsStore"
import { WinRateBar } from "../stats/WinRateStatsView"
import { DiscordButton } from "../thirdpartysites/discord/DiscordButton"
import { GithubTicketsButton } from "../thirdpartysites/github/GithubTicketsButton"
import { PatronButton } from "../thirdpartysites/patreon/PatronButton"
import { TwitterButton } from "../thirdpartysites/twitter/TwitterButton"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { DeckSearchLink, LandingPageLink } from "./DeckSearchLink"

const topSas = new DeckFilters()
const cota = new DeckFilters()
cota.expansions = [ExpansionNumber.COTA]
const aoa = new DeckFilters()
aoa.expansions = [ExpansionNumber.AOA]
const wc = new DeckFilters()
wc.expansions = [ExpansionNumber.WC]
const mm = new DeckFilters()
mm.expansions = [ExpansionNumber.MM]
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
            <Box>
                <Box display={"flex"}>
                    <KeyDrawer width={landingPageDrawerWidth} hamburgerMenu={true}>
                        <List>
                            <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(2), paddingRight: spacing(1)}}>
                                <DeckSearchLink
                                    name={"Search Decks"}
                                    filters={topSas}
                                    style={{marginBottom: spacing(2)}}
                                />
                                <DeckSearchLink
                                    name={<ExpansionIcon expansion={Expansion.MASS_MUTATION} white={true}/>} filters={mm}
                                    style={{marginBottom: spacing(2)}}
                                />
                                <DeckSearchLink
                                    name={<ExpansionIcon expansion={Expansion.CALL_OF_THE_ARCHONS} white={true}/>} filters={cota}
                                    style={{marginBottom: spacing(2)}}
                                />
                                <DeckSearchLink
                                    name={<ExpansionIcon expansion={Expansion.AGE_OF_ASCENSION} white={true}/>} filters={aoa}
                                    style={{marginBottom: spacing(2)}}
                                />
                                <DeckSearchLink
                                    name={<ExpansionIcon expansion={Expansion.WORLDS_COLLIDE} white={true}/>} filters={wc}
                                    style={{marginBottom: spacing(2)}}
                                />
                            </div>
                            <Divider/>
                            <ListSubheader>
                                Community
                            </ListSubheader>
                            <div style={{display: "flex", flexWrap: "wrap", paddingRight: spacing(1)}}>
                                <LandingPageLink
                                    name={"Tourneys"}
                                    to={Routes.tournaments}
                                    color={"secondary"}
                                    style={{marginBottom: spacing(2)}}

                                />
                                <LandingPageLink
                                    name={"Users"}
                                    to={Routes.users}
                                    color={"secondary"}
                                    style={{marginBottom: spacing(2)}}
                                />
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
                            <div style={{display: "flex", flexWrap: "wrap", paddingRight: spacing(1)}}>
                                <LandingPageLink
                                    name={"Search Cards"}
                                    to={Routes.cards}
                                    color={"secondary"}
                                    style={{marginBottom: spacing(2)}}
                                />
                                <LandingPageLink
                                    name={<ExpansionIcon expansion={Expansion.MASS_MUTATION} white={false}/>} color={"secondary"}
                                    to={Routes.mmCards} style={{marginBottom: spacing(2)}}
                                />
                                <LandingPageLink
                                    name={<ExpansionIcon expansion={Expansion.CALL_OF_THE_ARCHONS} white={false}/>} color={"secondary"}
                                    to={Routes.cotaCards} style={{marginBottom: spacing(2)}}
                                />
                                <LandingPageLink
                                    name={<ExpansionIcon expansion={Expansion.AGE_OF_ASCENSION} white={false}/>} color={"secondary"}
                                    to={Routes.aoaCards} style={{marginBottom: spacing(2)}}
                                />
                                <LandingPageLink
                                    name={<ExpansionIcon expansion={Expansion.WORLDS_COLLIDE} white={false}/>} color={"secondary"}
                                    to={Routes.wcCards} style={{marginBottom: spacing(2)}}
                                />
                            </div>
                            <Divider/>
                            <ListSubheader>
                                Fun Searches
                            </ListSubheader>
                            <DeckSearchLink name={"Reversal"} filters={worstSas}/>
                            <DeckSearchLink name={"Funny"} filters={topFunny} style={{marginTop: spacing(2)}}/>
                        </List>
                    </KeyDrawer>
                    <Box style={{flexGrow: 1}}>
                        {screenStore.screenSizeSm() ? (
                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                                <DeckSearchLink name={"Search"} filters={topSas} style={{marginTop: spacing(2)}}/>
                                <DeckSearchLink name={"For Sale"} filters={forSale} style={{marginTop: spacing(2)}}/>
                                <DeckSearchLink name={"Auctions"} filters={auctions} style={{marginTop: spacing(2)}}/>
                            </div>
                        ) : null}
                        <FeaturedSellersView/>
                        <Box m={4}>
                            <LandingPageTitle link={Routes.events} linkName={"View All"}>
                                Featured Events
                            </LandingPageTitle>
                            <PromotedKeyForgeEvents/>
                        </Box>
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
                            <Box display={"flex"} flexWrap={"wrap"}>
                                <PatronButton size={"large"} style={{marginRight: spacing(2), marginBottom: spacing(2)}}/>
                                <DiscordButton style={{marginRight: spacing(2), marginBottom: spacing(2)}}/>
                                <TwitterButton style={{marginRight: spacing(2), marginBottom: spacing(2)}}/>
                                <GithubTicketsButton style={{marginBottom: spacing(2)}}/>
                            </Box>
                            <LandingPageTitle marginTop={2}>
                                Disclaimers
                            </LandingPageTitle>
                            <Typography style={{marginBottom: spacing(1)}}>
                                DoK (a.k.a. decksofkeyforge.com) is not associated with or endorsed by Fantasy Flight Games, the producers of KeyForge, in any
                                way.
                            </Typography>
                            <Typography style={{marginBottom: spacing(1)}}>
                                DoK is owned and operated by Graylake LLC. For questions or comments check out
                                the <Link to={AboutSubPaths.contact}>contact me page</Link>!
                            </Typography>
                            <Typography style={{marginBottom: spacing(1)}}>
                                When using DoK you buy and sell decks entirely at your own risk. We make no guarantees about the safety of
                                any transactions.
                            </Typography>
                            <LinkButton size={"small"} href={Routes.codeOfConduct} newWindow={true} style={{marginRight: spacing(2)}}>
                                Code of Conduct
                            </LinkButton>
                            <LinkButton size={"small"} href={Routes.termsOfUse} newWindow={true} style={{marginRight: spacing(2)}}>
                                Terms of Use
                            </LinkButton>
                            <LinkButton size={"small"} href={Routes.privacyPolicy} newWindow={true}>
                                Privacy Policy
                            </LinkButton>
                        </div>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export const LandingPageTitle = observer((props: { children: string, marginTop?: number, linkName?: string, link?: string }) => {
    return (
        <Box display={"flex"} alignItems={"flex-start"} mb={2} mt={props.marginTop ?? 4}>
            <Typography
                variant={"h4"}
                color={themeStore.darkMode ? "textPrimary" : "primary"}
            >
                {props.children}
            </Typography>
            {props.link != null && (
                <LinkButton
                    variant={"outlined"}
                    href={props.link}
                    color={"primary"}
                    style={{marginLeft: spacing(4)}}
                >
                    {props.linkName}
                </LinkButton>
            )}
        </Box>
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
