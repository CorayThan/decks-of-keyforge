import { LinearProgress } from "@material-ui/core"
import { computed, makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { teamStore } from "../teams/TeamStore"
import { userSearchStore } from "../user/search/UserSearchStore"
import { Utils } from "./Utils"

export const KeyLoaderBar = observer(() => {

    if (
        globalLoaderStore.anythingTracked ||
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

class GlobalLoaderStore {
    @observable
    trackingIds: string[] = []

    trackRequest = () => {
        const requestId = Utils.pseudoUuid()
        this.trackingIds.push(requestId)
        return requestId
    }

    untrackRequest = (requestId: string) => {
        this.trackingIds = this.trackingIds.filter(id => id !== requestId)
    }

    constructor() {
        makeObservable(this)
    }

    @computed
    get anythingTracked() {
        return this.trackingIds.length > 0
    }
}

export const globalLoaderStore = new GlobalLoaderStore()