import { Grid, Link, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { HelperText } from "../generic/CustomTypographies"
import { InfoListCard } from "../generic/InfoListCard"
import { DiscordUser } from "../thirdpartysites/discord/DiscordUser"
import KeyForgeBurgerInsertsIcon from "./about-images/burger-inserts-icon.png"
import { AboutGridItem } from "./AboutPage"

@observer
export class ThirdPartyIntegrations extends React.Component {

    render() {
        return (
            <>
                <Grid item={true} xs={12}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div style={{display: "flex", flexDirection: "column", maxWidth: 800}}>
                            <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>Third Party Integrations</Typography>
                            <Typography variant={"subtitle1"} style={{marginBottom: spacing(2)}}>
                                Third party tools and sites that enhance DoK or use its data and APIs.
                            </Typography>
                            <HelperText color={"error"} style={{marginBottom: spacing(1)}}>Use these at your own risk!</HelperText>
                            <HelperText>
                                Decks of KeyForge does not verify the safety of these tools.
                                If you experience an issue, please contact the listed project maintainer. If you find that one of these projects is unmaintained
                                or abusive, please contact <a href="mailto:decksofkeyforge@gmail.com">decksofkeyforge@gmail.com</a>. Also, send me a message
                                if you have an awesome project you want included in this list! I will be selective in projects I accept, but feel
                                free to let me know about it.
                            </HelperText>
                        </div>
                    </div>
                </Grid>
                <DisplayIntegration
                    name={"KeyForge Burger Inserts"}
                    description={"Web application for printing paper inserts with deck information. This is based off the original Excel project."}
                    url={"https://keyforge-burger-inserts.herokuapp.com"}
                    discord={"Drallieiv#4274"}
                    contact={"github.com/drallieiv"}
                    icon={<img src={KeyForgeBurgerInsertsIcon}/>}
                />
                <DisplayIntegration
                    name={"KeyForge Deck Info Inserts"}
                    description={"Dynamic Excel Based template to print out decksofkeyforge.com stats in an insert formatted to fit BurgerTokens.com cases"}
                    url={"https://www.dropbox.com/s/vdh8c33tcc7pi58/Keyforge_Deck_Info_Inserts%20-%20FINAL.xlsx?dl=0"}
                    urlName={"Dropbox link to Excel sheet"}
                    discord={"GavinForge (Steve)#7647"}
                />
            </>
        )
    }
}

const DisplayIntegration = (props: { name: string, description: string, icon?: React.ReactNode, url?: string, urlName?: string, discord?: string, contact?: string }) => {
    const infos: React.ReactNode[] = [
        props.description
    ]
    if (props.url) {
        infos.push(<Link href={props.url} target={"_blank"} rel={"noopener noreferrer"} key={"url"}>{props.urlName ? props.urlName : props.url}</Link>)
    }
    if (props.discord) {
        infos.push(<DiscordUser discord={props.discord}/>)
    }
    if (props.contact) {
        infos.push(`Contact: ${props.contact}`)
    }
    return (
        <AboutGridItem>
            <InfoListCard
                title={props.name}
                infos={infos}
                icon={props.icon}
            />
        </AboutGridItem>
    )
}
