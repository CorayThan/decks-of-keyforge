import axios, { AxiosError, AxiosResponse } from "axios"
import { KeyLocalStorage } from "./KeyLocalStorage"
import { MessageStore } from "./MessageStore"
import { log } from "./Utils"

export const axiosWithoutInterceptors = axios.create()
export const axiosWithoutErrors = axios.create()

export class HttpConfig {

    static API = "/api"

    static setupAxios = () => {
        axios.interceptors.response.use(HttpConfig.responseInterceptor, HttpConfig.errorInterceptor)
    }

    static setAuthHeader = (authHeader?: string) => {
        axios.defaults.headers.common.Authorization = authHeader
    }

    static setAuthHeaders = () => {
        const token = KeyLocalStorage.findAuthKey()
        if (token) {
            HttpConfig.setAuthHeader(token)
        }
    }

    private static responseInterceptor = (response: AxiosResponse) => {
        const authHeader = response.headers.authorization
        if (authHeader) {
            KeyLocalStorage.saveAuthKey(authHeader)
            HttpConfig.setAuthHeaders()
        }
        return response
    }

    private static errorInterceptor = (error: AxiosError) => {

        log.error(`There was an error completing the request. ${error.code} ${error.message}`)
        MessageStore.instance.setRequestErrorMessage()

        return Promise.reject(error)
    }
}
