import { Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

interface TraitsViewProps {
    hasTraits: { amberControl: number, expectedAmber: number, artifactControl: number, creatureControl: number },
    compact?: boolean,
    color?: string
    round?: boolean
}

export const TraitsView = (props: TraitsViewProps) => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: props.compact ? "column" : undefined
        }}
    >
        <TraitValue
            name={"A"} value={props.hasTraits.amberControl} round={props.round} tooltip={"Aember Control"} color={props.color}
            style={{marginRight: spacing(2)}}
        />
        <TraitValue
            name={"E"} value={props.hasTraits.expectedAmber} round={props.round} tooltip={"Expected Aember"} color={props.color}
            style={{marginRight: spacing(2)}}
        />
        <TraitValue
            name={"R"} value={props.hasTraits.artifactControl} round={props.round} tooltip={"Artifact Control"} color={props.color}
            style={{marginRight: spacing(2)}}
        />
        <TraitValue
            name={"C"} value={props.hasTraits.creatureControl} round={props.round} tooltip={"Creature Control"} color={props.color}
        />
    </div>
)

const TraitValue = (props: { value: number, name: string, tooltip: string, color?: string, style?: React.CSSProperties, round?: boolean }) => {
    return (
        <Tooltip title={props.tooltip}>
            <div style={{display: "flex", alignItems: "flex-end", ...props.style}}>
                <div style={{display: "flex", width: 20, marginRight: spacing(1)}}>
                    <div style={{flexGrow: 1}}/>
                    <Typography variant={"body1"} style={{color: props.color ? props.color : "#FFFFFF"}}>
                        {props.round ? Math.round(props.value) : props.value}
                    </Typography>
                </div>
                <Typography
                    variant={"body2"}
                    style={{fontSize: 12, marginBottom: 1, color: props.color ? props.color : "#FFFFFF"}}
                >
                    {props.name}
                </Typography>
            </div>
        </Tooltip>
    )
}
