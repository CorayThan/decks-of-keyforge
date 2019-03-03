import { Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import chainsImg from "../imgs/chains.png"

export const ChainsView = (props: { chains: number, style?: React.CSSProperties }) => (
    <>
        {props.chains > 0 ? (
            <div style={{display: "flex", alignItems: "center", ...props.style}}>
                <Typography variant={"h5"}>{props.chains}</Typography>
                <img src={chainsImg} style={{width: 24, height: 24, marginLeft: spacing(1)}} alt={"chains"}/>
            </div>
        ) : null}
    </>
)
