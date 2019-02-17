import { AppBar, Grid, Tabs } from "@material-ui/core"
import { GridProps } from "@material-ui/core/Grid"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, Switch } from "react-router"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths } from "../config/Routes"
import { LinkTab } from "../generic/LinkTab"
import { screenStore } from "../ui/ScreenStore"
import { UiStore } from "../ui/UiStore"
import { ContactMe } from "./ContactMe"
import { ForDevs } from "./ForDevs"
import { ForSellers } from "./ForSellers"
import { ReleaseNotes } from "./ReleaseNotes"
import { SasAndAerc } from "./SasAndAerc"

type TabValues = "SAS" | "Contact" | "Notes" | "Sellers" | "Devs"

@observer
export class AboutPage extends React.Component {

    @observable
    currentTab: TabValues = "SAS"

    constructor(props: {}) {
        super(props)
        UiStore.instance.setTopbarValues("About", "About", "What it's for and how it works")
    }

    handleTabChange = (event: React.ChangeEvent<{}>, value: TabValues) => {
        this.currentTab = value
    }

    render() {
        const tab = this.currentTab
        return (
            <div style={{margin: spacing(4), backgroundColor: "#FFF"}}>
                <AppBar position={"static"} color={"default"}>
                    <Tabs
                        value={this.currentTab}
                        onChange={this.handleTabChange}
                        centered={screenStore.screenSizeMdPlus()}
                        variant={screenStore.screenSizeSm() ? "fullWidth" : undefined}
                    >
                        <LinkTab label="SAS and AERC" to={AboutSubPaths.sas}/>
                        <LinkTab label="Contact Me" to={AboutSubPaths.contact}/>
                        <LinkTab label="Release Notes" to={AboutSubPaths.releaseNotes}/>
                        <LinkTab label="For Sellers" to={AboutSubPaths.sellers}/>
                        <LinkTab label="For Devs" to={AboutSubPaths.devs}/>
                    </Tabs>
                </AppBar>
                <div style={{padding: spacing(4)}}>
                    <Grid container={true} spacing={32} style={{maxWidth: 1920}} justify={"center"}>
                        <Switch>
                            <Route path={AboutSubPaths.sas} component={SasAndAerc} />
                            <Route path={AboutSubPaths.contact} component={ContactMe} />
                            <Route path={AboutSubPaths.releaseNotes} component={ReleaseNotes} />
                            <Route path={AboutSubPaths.sellers} component={ForSellers} />
                            <Route path={AboutSubPaths.devs} component={ForDevs} />
                        </Switch>
                    </Grid>
                </div>
            </div>
        )
    }
}

export const AboutGridItem = (props: GridProps) => (<Grid item={true} xs={12} md={6} xl={4} style={{maxWidth: 608}} {...props} />)
