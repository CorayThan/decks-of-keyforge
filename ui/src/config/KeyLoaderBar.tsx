import { LinearProgress } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { teamStore } from "../teams/TeamStore"
import { userSearchStore } from "../user/search/UserSearchStore"

export const KeyLoaderBar = observer(() => {

    if (
        teamStore.loadingTeamPage ||
        userSearchStore.searching
    ) {
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

    return null
})