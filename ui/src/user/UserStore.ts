import { AxiosError, AxiosResponse } from "axios"
import { observable } from "mobx"
import { axiosWithoutErrors, axiosWithoutInterceptors, HttpConfig } from "../config/HttpConfig"
import { KeyLocalStorage } from "../config/KeyLocalStorage"
import { MessageStore } from "../config/MessageStore"
import { log, prettyJson } from "../config/Utils"
import { KeyUser, UserLogin, UserRegistration } from "./KeyUser"

export class UserStore {

    static readonly PUBLIC_CONTEXT = HttpConfig.API + "/users/public"
    static readonly CONTEXT = HttpConfig.API + "/users"
    private static innerInstance: UserStore

    @observable
    user?: KeyUser

    @observable
    loginInProgress = false

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    loadLoggedInUser = () => {
        if (!KeyLocalStorage.findAuthKey()) {
            return
        }
        HttpConfig.setAuthHeaders()
        this.loginInProgress = true
        axiosWithoutErrors
            .get(UserStore.CONTEXT + "/your-user")
            .then((response: AxiosResponse) => {
                log.debug(`Got logged in user: ${prettyJson(response.data)}`)
                this.user = response.data
                this.loginInProgress = false
            })
            .catch((error: AxiosError) => {
                // 401 or 403 means there is no logged in user, so logout!
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    this.logout()
                } else {
                    log.error(`Error loading logged in user ${error}`)
                    MessageStore.instance.setRequestErrorMessage()
                }
                this.loginInProgress = false
            })
    }

    registerAccount = (user: UserRegistration) => {
        log.debug(`Posting user: ${prettyJson(user)} api is: ${HttpConfig.API}`)
        this.loginInProgress = true
        axiosWithoutErrors
            .post(UserStore.PUBLIC_CONTEXT + "/register", user)
            .then((response: AxiosResponse) => {
                log.info("Registered!")
                this.login({...user})
            })
            .catch((error: AxiosError) => {
                const message = error.response && error.response.data.message
                log.debug(`Registration error ${message}`)
                if (message === "This email is already taken.") {
                    MessageStore.instance.setMessage("This email is already in use.", "Error")
                } else if (message === "This username is already taken.") {
                    MessageStore.instance.setMessage("This username is already in use.", "Error")
                } else {
                    MessageStore.instance.setRequestErrorMessage()
                }
                this.loginInProgress = false
            })
    }

    login = (userLogin: UserLogin) => {
        this.loginInProgress = true
        axiosWithoutInterceptors
            .post(UserStore.CONTEXT + "/login", userLogin)
            .then((response: AxiosResponse) => {
                log.info("Logged in!")
                KeyLocalStorage.saveAuthKey(response.headers.authorization)
                this.loadLoggedInUser()
            })
            .catch((error: AxiosError) => {
                this.loginInProgress = false
                log.error(`Error loggin in ${error}`)
                MessageStore.instance.setRequestErrorMessage()
            })
    }

    logout = () => {
        this.loginInProgress = false
        this.user = undefined
        KeyLocalStorage.clear()
        HttpConfig.setAuthHeaders()
    }

    loggedIn = () => !!this.user
}
