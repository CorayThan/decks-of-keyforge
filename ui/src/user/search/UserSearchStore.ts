import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { UserSearchResults } from "../../generated-src/UserSearchResults"

export class UserSearchStore {
    static readonly CONTEXT = HttpConfig.API + "/user-search"

    @observable
    results?: UserSearchResults

    @observable
    searching = false

    searchUsers = () => {
        this.searching = true
        axios.get(`${UserSearchStore.CONTEXT}`)
            .then((response: AxiosResponse<UserSearchResults>) => {
                this.searching = false
                this.results = response.data
            })
    }

    searchAllUsers = () => {
        this.searching = true
        axios.get(`${UserSearchStore.CONTEXT}/with-hidden`)
            .then((response: AxiosResponse<UserSearchResults>) => {
                this.searching = false
                this.results = response.data
            })
    }

    constructor() {
        makeObservable(this)
    }
}

export const userSearchStore = new UserSearchStore()
