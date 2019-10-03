import { Divider, IconButton, Paper, Typography } from "@material-ui/core"
import { ChevronLeft, ChevronRight } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { spacing } from "../config/MuiConfig"
import { BulletList } from "../generic/BulletList"
import { decksOfKeyForgeDiscord, DiscordNamedButton } from "../thirdpartysites/discord/DiscordButton"

@observer
export class SpoilerKudos extends React.Component {
    @observable
    open = true

    render() {
        return (
            <Paper
                style={{
                    maxWidth: this.open ? 240 : undefined,
                    padding: spacing(2),
                    position: "fixed",
                    right: 0,
                    top: "50%",
                    transform: "translate(0, -50%)",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0
                }}
            >
                {this.open ? (
                    <div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Typography variant={"h5"} style={{flexGrow: 1}}>
                                Kudos and Contributing
                            </Typography>
                            <IconButton size={"small"} onClick={() => this.open = !this.open}>
                                {this.open ? <ChevronRight/> : <ChevronLeft/>}
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
                        <DiscordNamedButton name={"Sanctumonius"} link={""} style={{marginTop: spacing(1)}}/>
                        <DiscordNamedButton name={"DoK"} link={decksOfKeyForgeDiscord} style={{marginTop: spacing(1)}}/>
                    </div>) : (
                    <IconButton size={"small"} onClick={() => this.open = !this.open}>
                        {this.open ? <ChevronRight/> : <ChevronLeft/>}
                    </IconButton>
                )}
            </Paper>
        )
    }
}