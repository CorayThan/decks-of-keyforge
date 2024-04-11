import { Box, Divider, Link, List, ListSubheader, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyDrawer } from "../components/KeyDrawer"
import { spacing, themeStore } from "../config/MuiConfig"
import { AboutSubPaths, Routes, StatsSubPaths } from "../config/Routes"
import { DeckFilters } from "../decks/search/DeckFilters"
import { ExpansionIcon } from "../expansions/ExpansionIcon"
import { activeCardLinksExpansions, displayMyDecksLinksFor, expansionInfoMap } from "../expansions/Expansions"
import { UnstyledLink } from "../generic/UnstyledLink"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { FeaturedSellersView } from "../sellers/FeaturedSellersView"
import { statsStore } from "../stats/StatsStore"
import { WinRateBar } from "../stats/WinRateStatsView"
import { DiscordButton } from "../thirdpartysites/discord/DiscordButton"
import { GithubTicketsButton } from "../thirdpartysites/github/GithubTicketsButton"
import { PatronButton } from "../thirdpartysites/patreon/PatronButton"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { AlliancesSearchLink, DeckSearchLink, LandingPageLink } from "./DeckSearchLink"
import { AllianceDeckFiltersUtils } from "../alliancedecks/AllianceDeckFiltersUtils"
import { SortDirection } from "../generated-src/SortDirection"
import { AnnouncementPaper } from "../generic/AnnouncementPaper"

const topSas = new DeckFilters()

const forSale = DeckFilters.forSale()
const forTrade = new DeckFilters()
forTrade.forSale = true

const worstSas = new DeckFilters()
worstSas.sortDirection = SortDirection.ASC

const validAlliances = AllianceDeckFiltersUtils.createEmpty()
validAlliances.validOnly = true
const allAlliances = AllianceDeckFiltersUtils.createEmpty()

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
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                marginTop: spacing(2),
                                paddingRight: spacing(1)
                            }}>
                                <DeckSearchLink
                                    name={"Search Decks"}
                                    filters={topSas}
                                    style={{marginBottom: spacing(2)}}
                                />
                                {displayMyDecksLinksFor.map(expansion => {
                                    const expansionFilters = new DeckFilters()
                                    expansionFilters.expansions = [expansionInfoMap.get(expansion)!.expansionNumber]
                                    return (
                                        <DeckSearchLink
                                            key={expansion}
                                            name={<ExpansionIcon expansion={expansion} white={true}/>}
                                            filters={expansionFilters} style={{marginBottom: spacing(2)}}
                                        />
                                    )
                                })}
                            </div>
                            <Divider/>
                            <ListSubheader>
                                Alliance Decks
                            </ListSubheader>
                            <div style={{display: "flex", flexWrap: "wrap", paddingRight: spacing(1)}}>
                                <AlliancesSearchLink
                                    name={"Valid"}
                                    filters={validAlliances}
                                    style={{marginBottom: spacing(2)}}
                                />
                                <AlliancesSearchLink
                                    name={"All"}
                                    filters={allAlliances}
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
                            <Box display={"flex"} flexWrap={"wrap"}>
                                <DeckSearchLink name={"For Sale"} filters={forSale} style={{marginBottom: spacing(2)}}/>
                                <DeckSearchLink name={"Trades"} filters={forTrade}
                                                style={{marginBottom: spacing(2)}}/>
                            </Box>

                            <Divider/>
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
                                {activeCardLinksExpansions.map(expansion => {
                                    return (
                                        <LandingPageLink
                                            key={expansion}
                                            name={<ExpansionIcon expansion={expansion} white={false}/>}
                                            color={"secondary"}
                                            to={Routes.cardsForExpansion(expansionInfoMap.get(expansion)!.expansionNumber)}
                                            style={{marginBottom: spacing(2)}}
                                        />
                                    )
                                })}
                            </div>
                        </List>
                    </KeyDrawer>
                    <Box style={{flexGrow: 1}}>

                        <AnnouncementPaper maxWidth={800} style={{margin: spacing(4), marginBottom: spacing(2)}}>
                            {/*<Typography variant={"h5"} gutterBottom={true}>*/}
                            {/*    WoE be to those who Seek the SAS*/}
                            {/*</Typography>*/}
                            {/*<Typography variant={"body1"} style={{marginBottom: spacing(1)}}>*/}
                            {/*    The Architects of SAS are hard at work building SAS and AERC scores for Winds of Exchange! You should*/}
                            {/*    expect scores to be released around early July, but no deadline has been set yet.*/}
                            {/*</Typography>*/}
                            {/*<Typography variant={"body1"} style={{marginBottom: spacing(1)}}>*/}
                            {/*    I'm also planning on building a feature for $6+ patrons to preview SAS scores as they are built.*/}
                            {/*</Typography>*/}
                            {/*<Typography variant={"h5"} gutterBottom={true}>*/}
                            {/*    DoKvelopments*/}
                            {/*</Typography>*/}
                            {/*<Typography variant={"body1"} style={{marginBottom: spacing(1)}}>*/}
                            {/*    DoK is now a <LinkNewWindow href={"https://github.com/CorayThan/decks-of-keyforge"}>public*/}
                            {/*    github repository</LinkNewWindow> and an open source code base!*/}
                            {/*</Typography>*/}
                            {/*<Typography variant={"body1"} style={{marginBottom: spacing(1)}}>*/}
                            {/*    If you're a skilled TypeScript + React or Kotlin + Spring Boot developer and want*/}
                            {/*    to donate some time to the KeyForge*/}
                            {/*    community, <LinkNewWindow href={decksOfKeyForgeDiscord}>join the DoK*/}
                            {/*    Discord</LinkNewWindow>!*/}
                            {/*    I'm building a small team to maintain DoK and add new features.*/}
                            {/*</Typography>*/}

                            <Typography variant={"h5"} gutterBottom={true}>
                                Grim Reminders Quick Update
                            </Typography>
                            <Typography variant={"body1"} style={{marginBottom: spacing(1)}}>
                                Most of the planned technical improvements have been made, but I'm still working on
                                fixing up lingering issues from those improvements. Grim Reminders decks can now be
                                imported! But they will not have meaningful SAS scores for another couple weeks while
                                the team that helps build SAS scores works on scoring the new cards.
                            </Typography>
                        </AnnouncementPaper>
                        {screenStore.screenSizeSm() ? (
                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                                <DeckSearchLink name={"Search"} filters={topSas} style={{marginTop: spacing(2)}}/>
                                <DeckSearchLink name={"For Sale"} filters={forSale} style={{marginTop: spacing(2)}}/>
                            </div>
                        ) : null}
                        <FeaturedSellersView/>
                        <div style={{marginLeft: spacing(2)}}>
                            <div style={{marginLeft: spacing(2)}}>
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
                                <PatronButton size={"large"}
                                              style={{marginRight: spacing(2), marginBottom: spacing(2)}}/>
                                <DiscordButton style={{marginRight: spacing(2), marginBottom: spacing(2)}}/>
                                <GithubTicketsButton style={{marginBottom: spacing(2)}}/>
                            </Box>
                            <LandingPageTitle marginTop={2}>
                                Disclaimers
                            </LandingPageTitle>
                            <Typography style={{marginBottom: spacing(1)}} color={"textPrimary"}>
                                DoK (a.k.a. decksofkeyforge.com) is not associated with or endorsed by Ghost Galaxy,
                                the producers of KeyForge, in any way.
                            </Typography>
                            <Typography style={{marginBottom: spacing(1)}} color={"textPrimary"}>
                                DoK is owned and operated by Graylake LLC. For questions or comments check out
                                the <Link href={AboutSubPaths.contact}>contact me page</Link>!
                            </Typography>
                            <Typography style={{marginBottom: spacing(1)}} color={"textPrimary"}>
                                When using DoK you buy and sell decks entirely at your own risk. We make no guarantees
                                about the safety of
                                any transactions.
                            </Typography>
                            <LinkButton size={"small"} href={Routes.codeOfConduct} newWindow={true}
                                        style={{marginRight: spacing(2)}}>
                                Code of Conduct
                            </LinkButton>
                            <LinkButton size={"small"} href={Routes.termsOfUse} newWindow={true}
                                        style={{marginRight: spacing(2)}}>
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

export const LandingPageTitle = observer((props: {
    children: string,
    marginTop?: number,
    linkName?: string,
    link?: string
}) => {
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
