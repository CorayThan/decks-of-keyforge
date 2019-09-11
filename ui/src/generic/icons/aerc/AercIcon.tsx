import * as React from "react"
import AmberControl from "./amber-control.svg"
import AmberProtection from "./amber-protection.svg"
import ArtifactControl from "./artifact-control.svg"
import CreatureControl from "./creature-control.svg"
import Disruption from "./disruption.svg"
import Efficiency from "./efficiency.svg"
import ExpectedAmber from "./expected-amber.svg"
import HouseCheating from "./house-cheating.svg"
import Other from "./other.svg"
import Power from "./power.svg"

export enum AercType {
    A,
    E,
    R,
    C,
    F,
    D,
    O,
    S,
    P,
    H
}

export const AercIcon = (props: { type: AercType, width?: number, style?: React.CSSProperties }) => {

    let icon = Disruption
    switch (props.type) {
        case AercType.A:
            icon = AmberControl
            break
        case AercType.E:
            icon = ExpectedAmber
            break
        case AercType.R:
            icon = ArtifactControl
            break
        case AercType.C:
            icon = CreatureControl
            break
        case AercType.D:
            icon = Disruption
            break
        case AercType.F:
            icon = Efficiency
            break
        case AercType.P:
            icon = Power
            break
        case AercType.S:
            icon = AmberProtection
            break
        case AercType.H:
            icon = HouseCheating
            break
        case AercType.O:
            icon = Other
            break
    }

    return (
        <img src={icon} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
