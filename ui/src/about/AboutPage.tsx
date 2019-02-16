import { AppBar, Grid, Tab, Tabs } from "@material-ui/core"
import { GridProps } from "@material-ui/core/Grid"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
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
                        <Tab label="SAS and AERC" value={"SAS"}/>
                        <Tab label="Contact Me" value={"Contact"}/>
                        <Tab label="Release Notes" value={"Notes"}/>
                        <Tab label="For Sellers" value={"Sellers"}/>
                        <Tab label="For Devs" value={"Devs"}/>
                    </Tabs>
                </AppBar>
                <div style={{padding: spacing(4)}}>
                    <Grid container={true} spacing={32} style={{maxWidth: 1920}} justify={"center"}>
                        {tab === "SAS" ? <SasAndAerc/> : null}
                        {tab === "Contact" ? <ContactMe/> : null}
                        {tab === "Notes" ? <ReleaseNotes/> : null}
                        {tab === "Sellers" ? <ForSellers/> : null}
                        {tab === "Devs" ? <ForDevs/> : null}
                    </Grid>
                </div>
            </div>
        )
    }
}

export const AboutGridItem = (props: GridProps) => (<Grid item={true} xs={12} md={6} xl={4} style={{maxWidth: 608}} {...props} />)
