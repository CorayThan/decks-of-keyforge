import { LinearProgress } from "@material-ui/core"
import CircularProgress from "@material-ui/core/CircularProgress"
import * as React from "react"

export enum LoaderSize {
    SMALL,
    MEDIUM
}

export const Loader = (props: { show?: boolean, size?: LoaderSize, style?: React.CSSProperties }) => {
    const hide = props.show === false
    const size = props.size ?? LoaderSize.MEDIUM
    let sizePx: number | undefined
    if (size === LoaderSize.SMALL) {
        sizePx = 24
    }
    if (hide) {
        return null
    }

    return (
        <div style={{display: "flex", justifyContent: "center", ...props.style}}><CircularProgress size={sizePx}/></div>
    )
}

export const LoaderBar = (props: { show?: boolean, style?: React.CSSProperties }) => {
    const hide = props.show === false
    if (hide) {
        return null
    }
    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                bottom: 0,
                width: "100%"
            }}
        >
            <LinearProgress/>
        </div>
    )
}
