import { Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { CardSets } from "../cards/CardSimpleView"
import { spacing } from "../config/MuiConfig"
import { Expansion } from "../expansions/Expansions"
import { GraySidebar } from "../generic/GraySidebar"
import { screenStore } from "../ui/ScreenStore"
import { Spoiler } from "./Spoiler"

export const SpoilerView = (props: { spoiler: Spoiler }) => {
    const spoiler = props.spoiler
    const {cardTitle, cardType, cardText, amber, frontImage} = spoiler

    const sidebarProps = screenStore.screenSizeXs() ? {
        vertical: true,
        width: 300,
    } : {
        width: 624,
    }

    return (
        <GraySidebar {...sidebarProps} >
            {frontImage && (
                <div>
                    <img alt={cardTitle} src={frontImage}/>
                </div>
            )}
            <div style={{padding: spacing(2), width: "100%"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <Typography color={"textPrimary"} variant={"h6"} style={{marginLeft: spacing(1), flexGrow: 1}}>{cardTitle}</Typography>
                    <CardSets set={Expansion.WC}/>
                </div>
                <div style={{display: "flex"}}>
                    <Typography variant={"subtitle1"}>{cardType}</Typography>
                    <div style={{flexGrow: 1}}/>
                    {amber > 0 ? <Typography variant={"subtitle1"}>{amber} aember</Typography> : null}
                </div>
                <Typography>{cardText}</Typography>
                <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
            </div>
        </GraySidebar>
    )
}
