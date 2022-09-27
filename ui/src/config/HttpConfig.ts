import axios, { AxiosError, AxiosResponse } from "axios"
import { messageStore } from "../ui/MessageStore"
import { clientVersion } from "./ClientVersion"
import { keyLocalStorage } from "./KeyLocalStorage"
import { monitoring } from "./Monitoring"
import { TimeUtils } from "./TimeUtils"
import {log, Utils} from "./Utils"

export let axiosWithoutErrors = axios.create()

let apiVersion: string | undefined

export class HttpConfig {

    static API = "/api"

    static setupAxios = () => {
        axios.defaults.headers.common.Timezone = TimeUtils.currentTimeZoneOffset()

        if (!Utils.isDev()) {
            axios.defaults.baseURL = "https://api.decksofkeyforge.com"
        }

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
        const newApiVersion = response.headers["api-version"]
        if (newApiVersion != null && newApiVersion != apiVersion) {
            log.info("client version " + clientVersion)
            log.info("api version " + newApiVersion)
            apiVersion = newApiVersion
            monitoring.setApiVersionTag(newApiVersion)
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
        } else {
            let message = error.response?.data?.message?.trim() ?? ""
            if (message === "") {
                message = undefined
            }
            if (code === 401) {
                messageStore.setErrorMessage("You are unauthorized to make this request.")
            } else if (message === undefined) {
                messageStore.setRequestErrorMessage()
            } else {
                messageStore.setErrorMessage(message)
            }
        }

        log.debug(`Reject the error with code ${code} message: ${error.message}`)

        return Promise.reject(error)
    }
}
