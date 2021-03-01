import React from "react"
import { Routes } from "../config/Routes"

export const TeamIcon = (props: { teamImg?: string, size?: number, style?: React.CSSProperties }) => {
    const {teamImg, size, style} = props
    if (teamImg == null) {
        return null
    }
    const realSize = size ?? 24
    return (
        <img
            src={Routes.userContent(teamImg)}
            alt={"Team Image"}
            height={realSize}
            width={realSize}
            style={{
                borderRadius: 4,
                ...style
            }}
        />
    )
}
