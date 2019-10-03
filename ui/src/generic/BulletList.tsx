import { Typography } from "@material-ui/core"
import React from "react"
import { spacing } from "../config/MuiConfig"

interface BulletListProps {
    items: string[]
}

export const BulletList = (props: BulletListProps) => {
    return (
        <>
            {props.items.map((item, idx) => (
                <div key={idx} style={{display: "flex", paddingLeft: spacing(1), marginTop: spacing(1), alignItems: "center"}}>
                    <div style={{backgroundColor: "#555", borderRadius: "50%", height: 8, width: 8, marginRight: spacing(1)}}/>
                    <Typography variant={"body2"}>{item}</Typography>
                </div>
            ))}
        </>
    )
}