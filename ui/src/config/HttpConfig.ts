import axios, { AxiosError, AxiosResponse } from "axios"
import { MessageStore } from "../ui/MessageStore"
import { keyLocalStorage } from "./KeyLocalStorage"
import { log } from "./Utils"

export const axiosWithoutInterceptors = axios.create()
export const axiosWithoutErrors = axios.create()

export class HttpConfig {

    static API = "/api"

    static setupAxios = () => {
        axios.interceptors.response.use(HttpConfig.responseInterceptor, HttpConfig.errorInterceptor)
        axiosWithoutErrors.interceptors.response.use(HttpConfig.responseInterceptor)
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
            MessageStore.instance.setErrorMessage("You are unauthorized to make this request.")
        } else {
            MessageStore.instance.setRequestErrorMessage()
        }

        return Promise.reject(error)
    }
}
