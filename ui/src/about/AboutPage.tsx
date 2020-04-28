import { AppBar, Grid, Tabs } from "@material-ui/core"
import { GridProps } from "@material-ui/core/Grid"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import { spacing, themeStore } from "../config/MuiConfig"
import { AboutSubPaths } from "../config/Routes"
import { LinkTab } from "../generic/LinkTab"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { ContactMe } from "./ContactMe"
import { PatreonRewards } from "./PatreonRewards"
import { ReleaseNotes } from "./ReleaseNotes"
import TeamSasLpBanner from "./sas-lp-banner.png"
import { SasAndAerc } from "./SasAndAerc"
import { SellersAndDevs } from "./SellersAndDevs"
import { TeamSasLp } from "./TeamSasLp"

@observer
export class AboutPage extends React.Component<RouteComponentProps<{}>> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        uiStore.setTopbarValues("About", "About", "What it's for and how it works")
    }

    render() {
        return (
            <div style={{margin: spacing(4), backgroundColor: themeStore.lightBackgroundColor}}>
                {!screenStore.smallScreenTopBar() && (
                    <AppBar position={"static"} color={"default"}>
                        <Tabs
                            value={this.props.location.pathname}
                            centered={screenStore.screenSizeMdPlus()}
                            variant={screenStore.screenSizeSm() ? "fullWidth" : undefined}
                        >
                            <LinkTab label="SAS and AERC" to={AboutSubPaths.sas} value={AboutSubPaths.sas}/>
                            <LinkTab label="Patron Rewards" to={AboutSubPaths.patreon} value={AboutSubPaths.patreon}/>
                            <LinkTab label="Contact Me" to={AboutSubPaths.contact} value={AboutSubPaths.contact}/>
                            <LinkTab label="Release Notes" to={AboutSubPaths.releaseNotes} value={AboutSubPaths.releaseNotes}/>
                            <LinkTab label="API" to={AboutSubPaths.sellersAndDevs} value={AboutSubPaths.sellersAndDevs}/>
                            <LinkTab label="Team SAS" to={AboutSubPaths.teamSas} value={AboutSubPaths.teamSas}/>
                        </Tabs>
                    </AppBar>
                )}
                {this.props.location.pathname.includes(AboutSubPaths.teamSas) && screenStore.screenWidth > 800 ? (
                    <div style={{display: "flex", justifyContent: "center", marginTop: spacing(4)}}>
                        <img alt={"Team Sas LP"} src={TeamSasLpBanner}/>
                    </div>
                ) : null}
                <div style={{padding: spacing(4)}}>
                    <Grid container={true} spacing={4} justify={"center"}>
                        <Switch>
                            <Route path={AboutSubPaths.sas} component={SasAndAerc}/>
                            <Route path={AboutSubPaths.patreon} component={PatreonRewards}/>
                            <Route path={AboutSubPaths.contact} component={ContactMe}/>
                            <Route path={AboutSubPaths.releaseNotes} component={ReleaseNotes}/>
                            <Route path={AboutSubPaths.sellersAndDevs} component={SellersAndDevs}/>
                            <Route path={AboutSubPaths.teamSas} component={TeamSasLp}/>
                        </Switch>
                    </Grid>
                </div>
            </div>
        )
    }
}

export const AboutGridItem = (props: GridProps) => (<Grid item={true} xs={12} md={6} xl={6} style={{maxWidth: 624}} {...props} />)
