import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import * as React from "react"
import { HttpConfig } from "../../config/HttpConfig"
import { MyDokSubPaths } from "../../config/Routes"
import { Utils } from "../../config/Utils"
import { SaleNotificationQueryDto } from "../../generated-src/SaleNotificationQueryDto"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { prepareDeckFiltersForQueryString } from "../search/DeckFilters"

export class ForSaleNotificationsStore {

    static readonly CONTEXT = HttpConfig.API + "/for-sale-notifications"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/for-sale-notifications/secured"

    @observable
    queries?: SaleNotificationQueryDto[]

    @observable
    queriesCount?: number

    addQuery = (query: SaleNotificationQueryDto) => {
        query.cards = query.cards.filter((card) => card.cardNames.length > 0)

        axios.post(`${ForSaleNotificationsStore.SECURE_CONTEXT}/add-query`, query)
            .then(() => {
                messageStore.setMessage(
                    `Created deck notification "${query.name}". See it on your `,
                    "Success",
                    <LinkButton
                        color={"secondary"}
                        href={MyDokSubPaths.notifications}
                        key={"notifications"}
                    >
                        Notifications
                    </LinkButton>
                )
                userStore.loadLoggedInUser()
            })
    }

    deleteQuery = (queryId: number) => {
        axios.delete(`${ForSaleNotificationsStore.SECURE_CONTEXT}/${queryId}`)
            .then(() => {
                messageStore.setSuccessMessage(`Deleted deck notification filter.`)
                this.findAllForUser()
            })
    }

    findAllForUser = () => {
        axios.get(`${ForSaleNotificationsStore.SECURE_CONTEXT}`)
            .then((response: AxiosResponse) => {
                this.queries = response.data
            })
    }

    findCountForUser = () => {
        axios.get(`${ForSaleNotificationsStore.SECURE_CONTEXT}/count`)
            .then((response: AxiosResponse<number>) => {
                this.queriesCount = response.data
            })
    }
}

export const prepareForSaleQueryForQueryString = (filters: SaleNotificationQueryDto) => {
    const copied = Utils.jsonCopy(filters)
    delete copied.name
    return prepareDeckFiltersForQueryString(copied)
}

export const forSaleNotificationsStore = new ForSaleNotificationsStore()