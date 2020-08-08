import axios, { AxiosError, AxiosResponse } from "axios"
import { computed, observable } from "mobx"
import { latestVersion } from "../about/ReleaseNotes"
import { deckListingStore } from "../auctions/DeckListingStore"
import { axiosWithoutErrors, HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log, prettyJson } from "../config/Utils"
import { deckStore } from "../decks/DeckStore"
import { deckOwnershipStore } from "../decks/ownership/DeckOwnershipStore"
import { Country } from "../generated-src/Country"
import { KeyUserDto } from "../generated-src/KeyUserDto"
import { PatreonRewardsTier } from "../generated-src/PatreonRewardsTier"
import { UserLogin } from "../generated-src/UserLogin"
import { UserProfile } from "../generated-src/UserProfile"
import { UserProfileUpdate } from "../generated-src/UserProfileUpdate"
import { UserRegistration } from "../generated-src/UserRegistration"
import { UserType } from "../generated-src/UserType"
import { findPatronRewardLevel, patronForSaleLimit, patronNotificationLimit } from "../thirdpartysites/patreon/PatreonRewardsTier"
import { messageStore } from "../ui/MessageStore"
import { userDeckStore } from "../userdeck/UserDeckStore"

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

    @observable
    agreeingToTerms = false

    loadLoggedInUser = async () => {
        if (!keyLocalStorage.hasAuthKey()) {
            return
        }
        HttpConfig.setupAxios()
        this.loginInProgress = true

        try {
            const userResponse = await axiosWithoutErrors.get(UserStore.SECURE_CONTEXT + "/your-user")
            this.setUser(userResponse.data)
            this.loginInProgress = false
            this.checkLastSeenVersion()
        } catch (error) {
            let logout = true
            if (
                // 401 or 403 means there is no logged in user
                (error.response && (error.response.status === 401 || error.response.status === 403)) ||
                (error.message && error.message.includes("JWT signature does not match "))
            ) {
                log.info("Logging user out and displaying warning message to log back in.")
                messageStore.setWarningMessage("Please log back in to the DoK.")
            } else {
                logout = false
                log.error(`Error loading logged in user ${error}`)
                messageStore.setRequestErrorMessage()
            }
            if (logout) {
                this.logout()
            }
            this.loginInProgress = false
        }
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
                messageStore.setSuccessMessage("Welcome to DoK! You are now being logged in.")
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
        axiosWithoutErrors
            .post(UserStore.CONTEXT + "/login", userLogin)
            .then((response: AxiosResponse) => {
                log.info("Logged in!")
                keyLocalStorage.saveAuthKey(response.headers.authorization)
                this.loadLoggedInUser()
                userDeckStore.findAllForUser()
                deckListingStore.findListingsForUser(false)
                deckOwnershipStore.findOwnedDecks()
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

    agreedToTerms = () => {
        this.agreeingToTerms = true
        axios.post(`${UserStore.SECURE_CONTEXT}/agree-to-terms`)
            .then((response: AxiosResponse) => {
                this.agreeingToTerms = false
                if (this.user) {
                    this.user.agreedToTerms = true
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
                    messageStore.setSuccessMessage("Updated your profile! Please sign back in.")
                } else {
                    messageStore.setSuccessMessage("Updated your profile!")
                    this.loadLoggedInUser()
                }
            })
    }

    setUserRole = (username: string, role: UserType) => {
        axios.post(`${UserStore.SECURE_CONTEXT}/set-user-role/${username}/${role}`)
            .then(() => {
                messageStore.setSuccessMessage(`Set ${username} to ${role}`)
            })
    }

    removeManualPatreonTier = (username: string) => {
        axios.post(`${UserStore.SECURE_CONTEXT}/remove-patron/${username}`)
            .then(() => {
                messageStore.setSuccessMessage(`Removed manual patron from ${username}`)
            })
    }

    setManualPatreonTier = (username: string, tier: PatreonRewardsTier, expiresInDays?: number) => {
        axios.post(`${UserStore.SECURE_CONTEXT}/set-patron/${username}/${tier}/${expiresInDays == null ? "" : expiresInDays}`)
            .then(() => {
                messageStore.setSuccessMessage(`Set ${username} to ${tier} expires in ${expiresInDays}`)
            })
    }

    changePassword = (resetCode: string, newPassword: string) => {
        this.changingPassword = true
        axiosWithoutErrors.post(`${UserStore.CONTEXT}/change-password`, {resetCode, newPassword})
            .then(() => {
                this.changingPassword = false
                messageStore.setSuccessMessage("Your password has been changed!")
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
                messageStore.setSuccessMessage("We've verified your email!")
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
        HttpConfig.setupAxios()
    }

    loggedIn = () => !!this.user

    setUser = (user?: KeyUserDto) => {
        this.user = user
    }

    @computed
    get loggedInOrLoading(): boolean {
        return this.loginInProgress || this.loggedIn()
    }

    @computed
    get userId(): string | undefined {
        if (this.user) {
            return this.user.id
        }
        return undefined
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
    get sellerEmail(): string | undefined {
        if (this.user) {
            return this.user.sellerEmail
        }
        return undefined
    }

    /**
     * Checks seller email first, then normal
     */
    @computed
    get emailIsVerified(): boolean {
        if (this.user) {
            if (this.user.sellerEmail != null) {
                return this.user.sellerEmailVerified
            }
            return this.user.emailVerified
        }
        return false
    }

    @computed
    get country(): Country | undefined {
        if (this.user && this.user.country) {
            return this.user.country
        }
        return undefined
    }


    @computed
    get hasCountryAndShippingCost(): boolean {
        return this.country != null && this.shippingCost != null
    }

    @computed
    get canListForSale(): boolean {
        return this.emailIsVerified && this.hasCountryAndShippingCost && this.canListMoreSales
    }

    @computed
    get shippingCost(): string | undefined {
        if (this.user && this.user.shippingCost) {
            return this.user.shippingCost
        }
        return undefined
    }

    @computed
    get patron(): boolean {
        if (this.user) {
            return !!this.user.patreonTier || this.user.username === "Coraythan"
        }
        return false
    }

    @computed
    get hasTeam(): boolean {
        if (this.user) {
            return this.user.teamName != null
        }
        return false
    }

    @computed
    get patronTier(): PatreonRewardsTier | undefined {
        if (this.user) {
            return this.user.patreonTier
        }
        return undefined
    }

    patronLevelEqualToOrHigher = (tier: PatreonRewardsTier): boolean => {
        if (this.user) {
            return findPatronRewardLevel(this.user.patreonTier) >= findPatronRewardLevel(tier)
        }
        return false
    }

    @computed
    get theoreticalDecksAllowed(): boolean {
        if (this.user) {
            return findPatronRewardLevel(this.user.patreonTier) > 0
        }
        return false
    }

    @computed
    get deckNotificationsAllowed(): boolean {
        if (this.user) {
            return findPatronRewardLevel(this.user.patreonTier) > 1
        }
        return false
    }

    @computed
    get maxNotifications(): number {
        if (this.user) {
            if (this.user.username === "SweeperArias" && this.deckNotificationsAllowed) {
                return 100
            }
            return patronNotificationLimit(this.user.patreonTier)
        }
        return 0
    }

    @computed
    get forSaleCount(): number {
        if (this.user) {
            return this.user.forSaleCount
        }
        return 0
    }

    @computed
    get forSaleAllowed(): number | undefined {
        if (this.user) {
            return patronForSaleLimit(this.user.patreonTier)
        }
        return 0
    }

    @computed
    get canListMoreSales(): boolean {
        return this.forSaleAllowed == null || this.forSaleAllowed > this.forSaleCount
    }

    @computed
    get featuredSeller(): boolean {
        if (this.user) {
            return findPatronRewardLevel(this.user.patreonTier) > 1
        }
        return false
    }

    @computed
    get contributedOrManual(): boolean {
        return this.user?.contributedOrManual === true
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

}

export const userStore = new UserStore()
