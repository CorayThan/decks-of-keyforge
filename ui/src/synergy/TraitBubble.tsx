import { Tooltip, Typography } from "@material-ui/core"
import { amber, blue, teal } from "@material-ui/core/colors"
import Home from "@material-ui/icons/Home"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { SynTraitHouse } from "../generated-src/SynTraitHouse"
import { SynTraitValue } from "../generated-src/SynTraitValue"
import { OutOfHouseIcon } from "../generic/icons/OutOfHouseIcon"
import { SynergyEffectIcon } from "../generic/icons/SynergyEffectIcon"
import { synTraitName } from "./SynTraitValue"

interface TraitBubbleProps {
    traitValue: SynTraitValue
    trait?: boolean
    synergyWith?: string[]
}

export const TraitBubble = (props: TraitBubbleProps) => {
    const {traitValue, trait, synergyWith} = props
    const {rating, house, synergyGroup, synergyGroupMax, primaryGroup} = traitValue
    const positive = rating > 0
    const color = positive && !props.trait ? "#FFFFFF" : undefined
    let title
    if (trait) {
        title = "Trait"
    } else if (positive) {
        title = "Synergy"
    } else {
        title = "Antisynergy"
    }
    const name = synTraitName(traitValue)

    return (
        <span
            style={{
                borderRadius: 20,
                backgroundColor: trait ? teal.A400 : (traitValue.rating > 0 ? blue.A400 : amber.A400),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: spacing(1),
                paddingLeft: spacing(2),
                paddingRight: spacing(2),
                margin: 4,
            }}
        >
            {rating ? (
                <SynergyEffectIcon effect={rating}/>
            ) : null}
            {house === SynTraitHouse.house ? (
                <Tooltip title={"Synergizes with house traits only"}>
                    <Home style={{color, marginRight: spacing(1), height: 18}}/>
                </Tooltip>
            ) : null}
            {house === SynTraitHouse.outOfHouse ? (
                <Tooltip title={"Synergizes with out of house traits only"}>
                    <div>
                        <OutOfHouseIcon style={{color, marginRight: spacing(1), height: 18}}/>
                    </div>
                </Tooltip>
            ) : null}
            <Tooltip
                title={(
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography variant={"body2"}>{synergyGroup ? `Synergy Group ${synergyGroup}` : title}</Typography>
                        {primaryGroup && (
                            <Typography variant={"body2"} style={{marginBottom: spacing(1)}}>Primary Group (Other groups cannot exceed this one's value)</Typography>
                        )}
                        {synergyGroupMax && (
                            <Typography variant={"body2"} style={{marginBottom: spacing(1)}}>Group Max: {synergyGroupMax}%</Typography>
                        )}
                        {synergyWith != null && (
                            <>
                                {synergyWith.map((synergy) => (
                                    <Typography key={synergy} variant={"body2"}>{synergy}</Typography>
                                ))}
                            </>
                        )}
                    </div>
                )}
            >
                <Typography variant={"body2"} style={{fontSize: "0.8125rem", color}}>
                    {name}
                </Typography>
            </Tooltip>
        </span>
    )
}
