import { Tooltip, Typography } from "@material-ui/core"
import { amber, blue, teal } from "@material-ui/core/colors"
import Home from "@material-ui/icons/Home"
import { startCase } from "lodash"
import * as React from "react"
import { CardType } from "../cards/CardType"
import { spacing } from "../config/MuiConfig"
import { AntiIcon } from "../generic/icons/AntiIcon"
import { SynergyEffectIcon } from "../generic/icons/SynergyEffectIcon"
import { SynTraitHouse } from "./SynTraitHouse"
import { SynTraitPlayer, SynTraitValue } from "./SynTraitValue"

export const TraitBubbleFromTrait = (props: {traitValue: SynTraitValue, trait?: boolean}) => (
    <TraitBubble
        name={props.traitValue.trait}
        positive={props.traitValue.rating > 0}
        synTraitHouse={props.traitValue.house}
        cardTypes={props.traitValue.cardTypes}
        player={props.traitValue.player}
        cardName={props.traitValue.cardName}
        rating={props.traitValue.rating}
        trait={props.trait}
    />
)

export const TraitBubble = (props: {
    name: string,
    positive: boolean,
    synTraitHouse?: SynTraitHouse,
    cardTypes?: CardType[],
    player?: SynTraitPlayer,
    trait?: boolean,
    cardName?: string,
    rating?: number,
    synergyWith?: string[]
}) => {
    const color = props.positive && !props.trait ? "#FFFFFF" : undefined
    let title
    if (props.trait) {
        title = "Trait"
    } else if (props.positive) {
        title = "Synergy"
    } else {
        title = "Antisynergy"
    }
    let name = props.name
    let nameEnhancer = ""
    if (props.player && props.player != SynTraitPlayer.ANY) {
        nameEnhancer += ` ${startCase(props.player.toLowerCase())}`
    }
    if (props.cardTypes && props.cardTypes.length > 0) {
        if (props.cardTypes.length === 1) {
            nameEnhancer += ` ${props.cardTypes[0]}s`
        } else {
            nameEnhancer += ` ${props.cardTypes.map(type => type + "s").join(" ")}`
        }
    }
    if (name.includes("_R_")) {
        name = name.replace("_R_", nameEnhancer)
    } else {
        name += " " + nameEnhancer
    }
    return (
        <span
            style={{
                borderRadius: 20,
                backgroundColor: props.trait ? teal.A400 : (props.positive ? blue.A400 : amber.A400),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: spacing(1),
                paddingLeft: spacing(2),
                paddingRight: spacing(2),
                margin: 4,
            }}
        >
            {props.rating ? (
                <SynergyEffectIcon effect={props.rating}/>
            ) : null}
            {props.synTraitHouse === SynTraitHouse.house ? (
                <Tooltip title={"Synergizes with house traits only"}>
                    <Home style={{color, marginRight: spacing(1), height: 18}}/>
                </Tooltip>
            ) : null}
            {props.synTraitHouse === SynTraitHouse.outOfHouse ? (
                <Tooltip title={"Synergizes with out of house traits only"}>
                    <div style={{width: 18, height: 18, marginLeft: spacing(1), marginRight: spacing(1)}}>
                        <div style={{position: "absolute", paddingLeft: 2, paddingTop: 1}}>
                            <Home style={{color, width: 14, height: 14}}/>
                        </div>
                        <AntiIcon style={{position: "absolute"}}/>
                    </div>
                </Tooltip>
            ) : null}
            <Tooltip
                title={(
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography variant={"body2"}>{title}</Typography>
                        {props.synergyWith != null && (
                            <>
                                {props.synergyWith.map((synergy) => (
                                    <Typography key={synergy} variant={"body2"}>{synergy}</Typography>
                                ))}
                            </>
                        )}
                    </div>
                )}
            >
                <Typography variant={"body2"} style={{fontSize: "0.8125rem", color}}>
                    {startCase(props.cardName == null ? name : props.cardName)}
                </Typography>
            </Tooltip>
        </span>
    )
}
