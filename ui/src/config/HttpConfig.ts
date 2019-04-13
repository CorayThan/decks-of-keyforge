import axios, { AxiosError, AxiosResponse } from "axios"
import { messageStore } from "../ui/MessageStore"
import { keyLocalStorage } from "./KeyLocalStorage"
import { log } from "./Utils"

export const axiosWithoutInterceptors = axios.create()
export const axiosWithoutErrors = axios.create()

export class HttpConfig {

    static API = "/api"

    static setupAxios = () => {
        axios.interceptors.response.use(HttpConfig.responseInterceptor, HttpConfig.errorInterceptor)
        axiosWithoutErrors.interceptors.response.use(HttpConfig.responseInterceptor)
        let timezoneOffset = new Date().getTimezoneOffset() * -1
        if (timezoneOffset == null || isNaN(timezoneOffset)) {
            log.warn("No timezone offset available.")
            timezoneOffset = 0
        } else {
            log.debug(`Time zone offset is ${timezoneOffset}`)
        }
        axios.defaults.headers.common.Timezone = timezoneOffset
    }

    static setAuthHeader = (authHeader?: string) => {
        axios.defaults.headers.common.Authorization = authHeader
    }

    static setAuthHeaders = () => {
        const token = keyLocalStorage.findAuthKey()
        if (token) {
            HttpConfig.setAuthHeader(token)
        }
    }

    static clearAuthHeaders = () => {
        HttpConfig.setAuthHeader(undefined)
    }

    private static responseInterceptor = (response: AxiosResponse) => {
        const authHeader = response.headers.authorization
        if (authHeader) {
            keyLocalStorage.saveAuthKey(authHeader)
            HttpConfig.setAuthHeaders()
        }
        return response
    }

    private static errorInterceptor = (error: AxiosError) => {

        log.error(`There was an error completing the request. ${error.code} ${error.message}`)

        if (error.code === "401") {
            messageStore.setErrorMessage("You are unauthorized to make this request.")
        } else {
            messageStore.setRequestErrorMessage()
        }

        return Promise.reject(error)
    }
}
