import axios, { AxiosError, AxiosResponse } from "axios"
import { computed, observable } from "mobx"
import { axiosWithoutErrors, axiosWithoutInterceptors, HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log, prettyJson } from "../config/Utils"
import { MessageStore } from "../ui/MessageStore"
import { UserDeck } from "../userdeck/UserDeck"
import { KeyUser, UserLogin, UserRegistration } from "./KeyUser"
import { UserProfile, UserProfileUpdate } from "./UserProfile"

export class UserStore {

    static readonly CONTEXT = HttpConfig.API + "/users"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/users/secured"
    private static innerInstance: UserStore

    @observable
    user?: KeyUser

    @observable
    userProfile?: UserProfile

    @observable
    userDecks?: Map<number, UserDeck>

    @observable
    loginInProgress = false

    @observable
    sendingReset = false

    @observable
    changingPassword = false

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    loadLoggedInUser = () => {
        if (!keyLocalStorage.findAuthKey()) {
            return
        }
        HttpConfig.setAuthHeaders()
        this.loginInProgress = true
        axiosWithoutErrors
            .get(UserStore.SECURE_CONTEXT + "/your-user")
            .then((response: AxiosResponse) => {
                // log.debug(`Got logged in user: ${prettyJson(response.data)}`)
                this.setUser(response.data)
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
            .post(UserStore.CONTEXT + "/register", user)
            .then((response: AxiosResponse) => {
                log.info("Registered!")
                MessageStore.instance.setSuccessMessage("Welcome to decks of keyforge! You are now being logged in.")
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
                keyLocalStorage.saveAuthKey(response.headers.authorization)
                this.loadLoggedInUser()
            })
            .catch((error: AxiosError) => {
                this.loginInProgress = false

                if (error.message === "Request failed with status code 401") {
                    MessageStore.instance.setErrorMessage("Your email or password was incorrect.")
                } else {
                    log.error(`Error loggin in ${error}`)
                    MessageStore.instance.setRequestErrorMessage()
                }
            })
    }

    findUserProfile = (username: string) => {
        axios.get(`${UserStore.CONTEXT}/${username}`)
            .then((response: AxiosResponse) => {
                log.debug("Got the user profile.")
                if (!response.data) {
                    MessageStore.instance.setErrorMessage(`Couldn't find a user with the username ${username}.`)
                } else {
                    this.userProfile = response.data
                }
            })
    }

    updateUserProfile = (updateUserProfile: UserProfileUpdate) => {
        axios.post(`${UserStore.SECURE_CONTEXT}/update`, updateUserProfile)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setSuccessMessage("Updated your profile!")
            })
    }

    sendReset = (email: string) => {
        this.sendingReset = true
        axios.post(`${UserStore.CONTEXT}/send-reset`, {email})
            .then((response: AxiosResponse) => {
                this.sendingReset = false
                MessageStore.instance.setSuccessMessage(`A reset email has been sent to ${email}`)
            })
    }

    changePassword = (resetCode: string, newPassword: string) => {
        this.changingPassword = true
        axiosWithoutErrors.post(`${UserStore.CONTEXT}/change-password`, {resetCode, newPassword})
            .then((response: AxiosResponse) => {
                this.changingPassword = false
                MessageStore.instance.setSuccessMessage("Your password has been changed!")
            })
            .catch((error: AxiosError) => {
                this.changingPassword = false
                MessageStore.instance.setErrorMessage("Your password could not be changed. Try sending another reset request.")
            })
    }

    logout = () => {
        this.loginInProgress = false
        this.setUser(undefined)
        keyLocalStorage.clear()
        HttpConfig.setAuthHeaders()
    }

    loggedIn = () => !!this.user

    setUser = (user?: KeyUser) => {
        this.user = user
        if (user) {
            this.userDecks = new Map()
            user.decks.forEach((userDeck) => this.userDecks!.set(userDeck.deck.id, userDeck))
        } else {
            this.userDecks = undefined
        }
    }

    userDeckByDeckId = (deckId: number) => this.userDecks ? this.userDecks.get(deckId) : undefined

    @computed
    get username(): string | undefined {
        if (this.user) {
            return this.user.username
        }
        return undefined
    }
}
