import { IconButton } from "@material-ui/core"
import { Share } from "@material-ui/icons"
import React from "react"
import { Utils } from "../config/Utils"
import { userStore } from "../user/UserStore"

export const ShareButton = () => {

    if (userStore.username?.toLowerCase() !== "coraythan") {
        return null
    }

    return (
        <IconButton
            onClick={() => Utils.shareUrl("http://google.com")}
            color={"inherit"}
        >
            <Share/>
        </IconButton>
    )
}