import { Divider } from "@material-ui/core"
import * as React from "react"
import { CardRatingBox } from "../cards/CardSimpleView"
import { spacing } from "../config/MuiConfig"
import { AmberIcon } from "../generic/icons/AmberIcon"
import { ArtifactIcon } from "../generic/icons/ArtifactIcon"
import { CreatureIcon } from "../generic/icons/CreatureIcon"
import { FistIcon } from "../generic/icons/FistIcon"

interface TraitsViewProps {
    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number
}

export const TraitsView = (props: TraitsViewProps) => {
    const {expectedAmber, amberControl, creatureControl, artifactControl} = props
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <div>
                <CardRatingBox
                    firstIcon={<AmberIcon/>}
                    value={expectedAmber}
                    tooltip={"Expected Aember"}
                />
                <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                <CardRatingBox
                    firstIcon={<AmberIcon/>}
                    secondIcon={<FistIcon/>}
                    value={amberControl}
                    tooltip={"Aember Control"}
                />
            </div>
            <div
                style={{borderLeft: "1px solid rgb(0, 0, 0, 0.12)", marginLeft: spacing(2), paddingLeft: spacing(2)}}
            >
                <CardRatingBox
                    firstIcon={<CreatureIcon/>}
                    secondIcon={<FistIcon/>}
                    value={creatureControl}
                    tooltip={"Creature Control"}
                />
                <Divider style={{marginTop: spacing(1), marginBottom: spacing(1)}}/>
                <CardRatingBox
                    firstIcon={<ArtifactIcon/>}
                    secondIcon={<FistIcon/>}
                    value={artifactControl}
                    tooltip={"Artifact Control"}
                />
            </div>
        </div>
    )
}