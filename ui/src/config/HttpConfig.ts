import axios, { AxiosError, AxiosResponse } from "axios"
import { messageStore } from "../ui/MessageStore"
import { keyLocalStorage } from "./KeyLocalStorage"
import { log } from "./Utils"

export let axiosWithoutErrors = axios.create()

export class HttpConfig {

    static API = "/api"

    static setupAxios = () => {
        let timezoneOffset = new Date().getTimezoneOffset() * -1
        if (timezoneOffset == null || isNaN(timezoneOffset)) {
            log.warn("No timezone offset available.")
            timezoneOffset = 0
        }
        axios.defaults.headers.common.Timezone = timezoneOffset

        const token = keyLocalStorage.findAuthKey()
        if (token) {
            axios.defaults.headers.common.Authorization = token
        }

        axiosWithoutErrors = axios.create()
        axios.interceptors.response.use(HttpConfig.responseInterceptor, HttpConfig.responseErrorInterceptor)
        axiosWithoutErrors.interceptors.response.use(HttpConfig.responseInterceptor)
    }

    private static responseInterceptor = (response: AxiosResponse) => {
        const authHeader = response.headers.authorization
        if (authHeader) {
            keyLocalStorage.saveAuthKey(authHeader)
            HttpConfig.setupAxios()
        }
        return response
    }

    private static responseErrorInterceptor = (error: AxiosError) => {

        const code = error.response && error.response.status

        if (code !== 304) {
            log.error(`There was an error completing the request. ${error.message}`)
        }
        if (axios.isCancel(error)) {
            log.info("Canceled request")
            return
        } else if (code === 401) {
            messageStore.setErrorMessage("You are unauthorized to make this request.")
        } else if (code === 413 && error.config.url?.includes("read-deck-image")) {
            messageStore.setErrorMessage("Your image is too large, please reduce its size.")
        } else if (code === 417) {
            const message = error.response && error.response.data && error.response.data.message
            messageStore.setErrorMessage(message)
        } else {
            messageStore.setRequestErrorMessage()
        }

        log.debug(`Reject the error with code ${code} message: ${error.message}`)

        return Promise.reject(error)
    }
}
