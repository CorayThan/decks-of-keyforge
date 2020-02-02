import { Divider, IconButton, Link, Paper, Typography } from "@material-ui/core"
import { ChevronLeft, ChevronRight } from "@material-ui/icons"
import { observer } from "mobx-react"
import React from "react"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { BulletList } from "../generic/BulletList"
import { decksOfKeyForgeDiscord, DiscordNamedButton } from "../thirdpartysites/discord/DiscordButton"

@observer
export class SpoilerKudos extends React.Component {

    render() {
        const open = !keyLocalStorage.genericStorage.hideSpoilerKudosTwo
        return (
            <Paper
                style={{
                    maxWidth: open ? 240 : undefined,
                    padding: spacing(open ? 2 : 1),
                    position: "fixed",
                    right: 0,
                    bottom: spacing(2),
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0
                }}
            >
                {open ? (
                    <div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Typography variant={"h5"} style={{flexGrow: 1}}>
                                Kudos and Contributing
                            </Typography>
                            <IconButton size={"small"} onClick={() => keyLocalStorage.updateGenericStorage({hideSpoilerKudosTwo: true})}>
                                {open ? <ChevronRight/> : <ChevronLeft/>}
                            </IconButton>
                        </div>
                        <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                        <Typography variant={"body2"}>
                            Thank you everyone who has helped, including:
                        </Typography>
                        <BulletList
                            items={[
                                (
                                    <div key={"example"}>
                                        <Typography variant={"body2"}>
                                            <Link
                                                target={"_blank"}
                                                href={"https://google.com"}
                                            >
                                                Example contributor
                                            </Link>
                                            {" & stuff"}
                                        </Typography>
                                    </div>
                                ),
                            ]}
                        />
                        <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                        <Typography variant={"body2"}>
                            To contribute and get your name in the kudos please contact Coraythan on the DoK discord:
                        </Typography>
                        <DiscordNamedButton name={"DoK"} link={decksOfKeyForgeDiscord} style={{marginTop: spacing(1)}}/>
                    </div>) : (
                    <IconButton size={"small"} onClick={() => keyLocalStorage.updateGenericStorage({hideSpoilerKudosTwo: false})}>
                        {open ? <ChevronRight/> : <ChevronLeft/>}
                    </IconButton>
                )}
            </Paper>
        )
    }
}