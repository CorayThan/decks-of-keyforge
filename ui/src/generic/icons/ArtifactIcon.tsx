import * as React from "react"
import Artifact from "../imgs/artifact.svg"

export const ArtifactIcon = (props: { height?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Artifact} style={{color: "rgba(0, 0, 0, 0.87)", height: props.height ? props.height : 24, ...props.style}}/>
    )
}
