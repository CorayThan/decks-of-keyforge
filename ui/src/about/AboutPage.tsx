import { Box, Grid } from "@material-ui/core"
import { GridProps } from "@material-ui/core/Grid"
import { observer } from "mobx-react"
import * as React from "react"
import { Route, RouteComponentProps, Switch } from "react-router"
import { AboutSubPaths } from "../config/Routes"
import { uiStore } from "../ui/UiStore"
import { ContactMe } from "./ContactMe"
import { PatreonRewards } from "./PatreonRewards"
import { ReleaseNotes } from "./ReleaseNotes"
import { SasAndAerc } from "./SasAndAerc"
import { SellersAndDevs } from "./SellersAndDevs"

@observer
export class AboutPage extends React.Component<RouteComponentProps<{}>> {

    constructor(props: RouteComponentProps<{}>) {
        super(props)
        uiStore.setTopbarValues("About", "About", "What it's for and how it works")
    }

    render() {
        return (
            <Box m={4} mt={10}>
                <Grid container={true} spacing={4} justify={"center"}>
                    <Switch>
                        <Route path={AboutSubPaths.sas} component={SasAndAerc}/>
                        <Route path={AboutSubPaths.patreon} component={PatreonRewards}/>
                        <Route path={AboutSubPaths.contact} component={ContactMe}/>
                        <Route path={AboutSubPaths.releaseNotes} component={ReleaseNotes}/>
                        <Route path={AboutSubPaths.sellersAndDevs} component={SellersAndDevs}/>
                    </Switch>
                </Grid>
            </Box>
        )
    }
}

export const AboutGridItem = (props: GridProps) => (
    <Grid item={true} xs={12} md={6} xl={6} style={{maxWidth: 624}} {...props} />)
