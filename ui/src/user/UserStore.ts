import axios, { AxiosError, AxiosResponse } from "axios"
import { computed, observable } from "mobx"
import { latestVersion } from "../about/ReleaseNotes"
import { etagResponseErrorInterceptor } from "../config/EtagCache"
import { axiosWithoutErrors, axiosWithoutInterceptors, HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log, prettyJson } from "../config/Utils"
import { deckStore } from "../decks/DeckStore"
import { findPatronRewardLevel, patronAuctionLimit } from "../thirdpartysites/patreon/PatreonRewardsTier"
import { messageStore } from "../ui/MessageStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { KeyUserDto, UserLogin, UserRegistration, UserType } from "./KeyUser"
import { UserProfile, UserProfileUpdate } from "./UserProfile"

export class UserStore {

    static readonly CONTEXT = HttpConfig.API + "/users"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/users/secured"

    @observable
    user?: KeyUserDto

    @observable
    userProfile?: UserProfile

    @observable
    loginInProgress = false

    @observable
    changingPassword = false

    @observable
    verifyingEmail = false

    @observable
    emailVerificationSuccessful?: boolean

    loadLoggedInUser = () => {
        if (!keyLocalStorage.hasAuthKey()) {
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
                this.checkLastSeenVersion()
            })
            .catch((error: AxiosError) => {
                let logout = true
                if (error.response && error.response.status === 304) {
                    logout = false
                    etagResponseErrorInterceptor(error)
                } else if (
                    // 401 or 403 means there is no logged in user
                    (error.response && (error.response.status === 401 || error.response.status === 403)) ||
                    (error.message && error.message.includes("JWT signature does not match "))
                ) {
                    log.info("Logging user out and displaying warning message to log back in.")
                    messageStore.setWarningMessage("Please log back in to the DoK.")
                } else {
                    log.error(`Error loading logged in user ${error}`)
                    messageStore.setRequestErrorMessage()
                }
                if (logout) {
                    this.logout()
                }
                this.loginInProgress = false
            })
    }

    checkLastSeenVersion = () => {
        const lastSeenVersion = this.user!.lastVersionSeen
        if (lastSeenVersion !== latestVersion) {
            axiosWithoutErrors
                .post(`${UserStore.SECURE_CONTEXT}/version/${latestVersion}`)
                .then(() => {
                    messageStore.setReleaseMessage(latestVersion)
                })
        }
    }

    registerAccount = (user: UserRegistration) => {
        log.debug(`Posting user: ${prettyJson(user)} api is: ${HttpConfig.API}`)
        this.loginInProgress = true
        axiosWithoutErrors
            .post(UserStore.CONTEXT + "/register", user)
            .then(() => {
                log.info("Registered!")
                messageStore.setSuccessMessage("Welcome to decks of keyforge! You are now being logged in.")
                this.login({...user})
            })
            .catch((error: AxiosError) => {
                const message = error.response && error.response.data.message
                log.debug(`Registration error ${message}`)
                if (message === "This email is already taken.") {
                    messageStore.setMessage("This email is already in use.", "Error")
                } else if (message === "This username is already taken.") {
                    messageStore.setMessage("This username is already in use.", "Error")
                } else {
                    messageStore.setRequestErrorMessage()
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
                userDeckStore.findAllForUser()
            })
            .catch((error: AxiosError) => {
                this.loginInProgress = false

                if (error.message === "Request failed with status code 401") {
                    messageStore.setErrorMessage("Your email or password was incorrect.")
                } else {
                    log.error(`Error loggin in ${error}`)
                    messageStore.setRequestErrorMessage()
                }
            })
    }

    findUserProfile = (username: string) => {
        axios.get(`${UserStore.CONTEXT}/${username}`)
            .then((response: AxiosResponse) => {
                log.debug("Got the user profile.")
                if (!response.data) {
                    messageStore.setErrorMessage(`Couldn't find a user with the username ${username}.`)
                } else {
                    this.userProfile = response.data
                }
            })
    }

    updateUserProfile = (updateUserProfile: UserProfileUpdate) => {
        axios.post(`${UserStore.SECURE_CONTEXT}/update`, updateUserProfile)
            .then(() => {
                if (updateUserProfile.email) {
                    this.logout()
                    messageStore.setInfoMessage("Updated your profile! Please sign back in.")
                } else {
                    messageStore.setInfoMessage("Updated your profile!")
                    this.loadLoggedInUser()
                }
            })
    }

    changePassword = (resetCode: string, newPassword: string) => {
        this.changingPassword = true
        axiosWithoutErrors.post(`${UserStore.CONTEXT}/change-password`, {resetCode, newPassword})
            .then(() => {
                this.changingPassword = false
                messageStore.setInfoMessage("Your password has been changed!")
            })
            .catch(() => {
                this.changingPassword = false
                messageStore.setErrorMessage("Your password could not be changed. Try sending another reset request.")
            })
    }

    verifyEmail = (verificationCode: string) => {
        this.verifyingEmail = true
        axiosWithoutErrors.post(`${UserStore.CONTEXT}/verify-email/${verificationCode}`)
            .then(() => {
                this.verifyingEmail = false
                this.emailVerificationSuccessful = true
                messageStore.setInfoMessage("We've verified your email!")
                this.loadLoggedInUser()
            })
            .catch(() => {
                this.verifyingEmail = false
                this.emailVerificationSuccessful = false
                messageStore.setErrorMessage("We couldn't verify your email.")
            })
    }

    logout = () => {
        this.loginInProgress = false
        this.setUser(undefined)
        userDeckStore.userDecks = undefined
        deckStore.refreshDeckSearch()
        keyLocalStorage.clear()
        HttpConfig.clearAuthHeaders()
    }

    loggedIn = () => !!this.user

    setUser = (user?: KeyUserDto) => {
        this.user = user
    }

    @computed
    get username(): string | undefined {
        if (this.user) {
            return this.user.username
        }
        return undefined
    }

    @computed
    get email(): string | undefined {
        if (this.user) {
            return this.user.email
        }
        return undefined
    }

    @computed
    get emailVerified(): boolean {
        if (this.user) {
            return this.user.emailVerified
        }
        return false
    }

    @computed
    get country(): string | undefined {
        if (this.user && this.user.country) {
            return this.user.country
        }
        return undefined
    }

    // TODO delete this when $1 tier works
    @computed
    get hasPatronId(): boolean {
        if (this.user) {
            return !!this.user.patreonId
        }
        return false
    }

    @computed
    get patron(): boolean {
        if (this.user) {
            return !!this.user.patreonTier
        }
        return false
    }

    @computed
    get deckNotificationsAllowed(): boolean {
        if (this.user) {
            return findPatronRewardLevel(this.user.patreonTier) > 0
        }
        return false
    }

    @computed
    get auctionsListed(): number {
        if (this.user) {
            return this.user.auctionCount
        }
        return 0
    }

    @computed
    get auctionsAllowed(): number | undefined {
        if (this.user) {
            return patronAuctionLimit(this.user.patreonTier)
        }
        return 0
    }

    @computed
    get canListMoreAuctions(): boolean {
        if (this.email === "coraythan@gmail.com") {
            return true
        }
        return this.auctionsAllowed == null || this.auctionsAllowed > this.auctionsListed
    }

    @computed
    get featuredSeller(): boolean {
        if (this.user) {
            return findPatronRewardLevel(this.user.patreonTier) > 1
        }
        return false
    }

    @computed
    get contentCreator(): boolean {
        if (this.user) {
            return this.user.type === UserType.ADMIN || this.user.type === UserType.CONTENT_CREATOR
        }
        return false
    }

    @computed
    get isAdmin(): boolean {
        if (this.user) {
            return this.user.type === UserType.ADMIN
        }
        return false
    }

    @computed
    get displayCrucibleTrackerWins(): boolean {
        if (this.user) {
            return this.user.displayCrucibleTrackerWins
        }
        return false
    }
}

export const userStore = new UserStore()
