import { Divider } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import React from "react"
import { theme } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { LinkMenuItem } from "../mui-restyled/LinkMenuItem"
import { screenStore } from "../ui/ScreenStore"
import { CardSimpleView } from "./CardSimpleView"
import { KCard } from "./KCard"

export const FancyCardMenuItem = observer((props: { card: KCard, onClick: () => void }) => {
    const {card, onClick} = props

    if (screenStore.screenSizeXs()) {
        return (
            <LinkMenuItem
                to={Routes.cardPage(card.cardTitle)}
                onClick={onClick}
            >
                {card.cardTitle}
            </LinkMenuItem>
        )
    }

    return (
        <LinkMenuItem
            to={Routes.cardPage(card.cardTitle)}
            onClick={onClick}
        >
            <div style={{display: "flex"}}>
                <CardSimpleView card={card} size={80} noLink={true} style={{margin: 0, marginRight: theme.spacing(2)}}/>
                <div style={{flexGrow: 1}}>
                    <Typography variant={"subtitle1"}>
                        {card.cardTitle}
                    </Typography>
                    <Divider style={{marginBottom: theme.spacing(0.5)}}/>
                    <AercScore score={card.extraCardInfo.amberControl} name={"Aember Control"}/>
                    <AercScore score={card.extraCardInfo.expectedAmber} name={"Expected Aember"}/>
                    <AercScore score={card.extraCardInfo.artifactControl} name={"Artifact Control"}/>
                    <AercScore score={card.extraCardInfo.creatureControl} name={"Creature Control"}/>
                    <AercScore score={card.extraCardInfo.deckManipulation} name={"Deck Manipulation"}/>
                    <AercScore score={card.effectivePower} name={"Effective Power"}/>
                </div>
            </div>
        </LinkMenuItem>
    )
})

const AercScore = (props: { score: number, name: string }) => {
    const {score, name} = props
    if (score === 0) {
        return null
    }
    return <Typography variant={"body2"} color={"textSecondary"} style={{marginTop: theme.spacing(0.5)}}>{name}: {score}</Typography>
}
