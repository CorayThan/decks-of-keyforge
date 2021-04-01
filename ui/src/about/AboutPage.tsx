import { Box, Grid } from "@material-ui/core"
import { GridProps } from "@material-ui/core/Grid"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths } from "../config/Routes"
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
            <Box m={4} mt={10}>
                {this.props.location.pathname.includes(AboutSubPaths.teamSas) && screenStore.screenWidth > 800 ? (
                    <div style={{display: "flex", justifyContent: "center", marginTop: spacing(4), marginBottom: spacing(2)}}>
                        <img alt={"Team Sas LP"} src={TeamSasLpBanner}/>
                    </div>
                ) : null}
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
            </Box>
        )
    }
}

export const AboutGridItem = (props: GridProps) => (<Grid item={true} xs={12} md={6} xl={6} style={{maxWidth: 624}} {...props} />)
