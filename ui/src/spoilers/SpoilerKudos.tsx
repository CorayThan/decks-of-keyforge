import { Divider, IconButton, Paper, Typography } from "@material-ui/core"
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
        const open = !keyLocalStorage.genericStorage.hideSpoilerKudos
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
                            <IconButton size={"small"} onClick={() => keyLocalStorage.updateGenericStorage({hideSpoilerKudos: true})}>
                                {open ? <ChevronRight/> : <ChevronLeft/>}
                            </IconButton>
                        </div>
                        <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                        <Typography variant={"body2"}>
                            Thank you everyone who has helped, including:
                        </Typography>
                        <BulletList
                            items={[
                                "The Sanctumonius Discord",
                                "C.Æ.N.D.L.E. Bot",
                                "The Reddit spoiler list",
                                "Arkonos"
                            ]}
                        />
                        <Divider style={{marginTop: spacing(2), marginBottom: spacing(2)}}/>
                        <Typography variant={"body2"}>
                            To contribute, please share cards on the Sanctumonius or Decks of KeyForge
                            discord
                        </Typography>
                        <DiscordNamedButton name={"Sanctumonius"} link={"https://discord.gg/3dSVb6v"} style={{marginTop: spacing(1)}}/>
                        <DiscordNamedButton name={"DoK"} link={decksOfKeyForgeDiscord} style={{marginTop: spacing(1)}}/>
                    </div>) : (
                    <IconButton size={"small"} onClick={() => keyLocalStorage.updateGenericStorage({hideSpoilerKudos: false})}>
                        {open ? <ChevronRight/> : <ChevronLeft/>}
                    </IconButton>
                )}
            </Paper>
        )
    }
}