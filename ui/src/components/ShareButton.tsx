import { IconButton } from "@material-ui/core"
import { Share } from "@material-ui/icons"
import { observer } from "mobx-react"
import React from "react"
import { Utils } from "../config/Utils"

export const ShareButton = observer((props: { url: string, title?: string, style?: React.CSSProperties }) => {

    if (!Utils.canWriteToClipboard && !Utils.canShare()) {
        return null
    }

    const {url, title, style} = props

    return (
        <IconButton
            onClick={() => Utils.shareUrl(url, title)}
            color={"inherit"}
            style={style}
        >
            <Share/>
        </IconButton>
    )
})
