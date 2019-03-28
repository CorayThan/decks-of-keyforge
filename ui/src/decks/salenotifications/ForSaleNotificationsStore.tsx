import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import * as React from "react"
import { HttpConfig } from "../../config/HttpConfig"
import { Routes } from "../../config/Routes"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { MessageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { ForSaleQuery } from "./ForSaleQuery"

export class ForSaleNotificationsStore {

    static readonly CONTEXT = HttpConfig.API + "/for-sale-notifications"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/for-sale-notifications/secured"

    @observable
    queries?: ForSaleQuery[]

    addQuery = (query: ForSaleQuery) => {
        query.cards = query.cards.filter((card) => card.cardName.length > 0)

        axios.post(`${ForSaleNotificationsStore.SECURE_CONTEXT}/add-query`, query)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setMessage(
                    `Created deck notification "${query.queryName}". See it on your `,
                    "Success",
                    <LinkButton
                        color={"inherit"}
                        to={Routes.myProfile}
                    >
                        Profile
                    </LinkButton>
                    )
                userStore.loadLoggedInUser()
            })
    }

    deleteQuery = (queryId: string) => {
        axios.delete(`${ForSaleNotificationsStore.SECURE_CONTEXT}/${queryId}`)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setSuccessMessage(`Deleted deck notification filter.`)
                this.findAllForUser()
            })
    }

    findAllForUser = () => {
        axios.get(`${ForSaleNotificationsStore.SECURE_CONTEXT}`)
            .then((response: AxiosResponse) => {
                this.queries = response.data
            })
    }
}

export const forSaleNotificationsStore = new ForSaleNotificationsStore()