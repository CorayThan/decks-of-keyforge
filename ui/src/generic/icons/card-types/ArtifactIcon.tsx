import * as React from "react"
import Artifact from "./artifact.svg"

export const ArtifactIcon = (props: { width?: number, style?: React.CSSProperties }) => {
    return (
        <img src={Artifact} style={{height: props.width ? props.width : 24, ...props.style}}/>
    )
}
