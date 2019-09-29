import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { log } from "./Utils"

const cacheableEndpoints = [
    "/api/userdeck/secured/for-user",
    "/api/cards",
    "/api/stats",
    "/api/sellers/featured",
]

const isCacheableMethod = (config: AxiosRequestConfig) => {
    const method = config.method == null ? "" : config.method.toUpperCase()
    if (config.url == null || !cacheableEndpoints.includes(config.url)) {
        return false
    }
    return method === "GET" || method === "HEAD"
}

export const etagResponseErrorInterceptor = (error: AxiosError) => {
    if (error.response != null && error.response.status === 304 && error.config.url != null) {
        const getCachedResult = cache.get(error.config.url)
        if (!getCachedResult) {
            return Promise.reject(error)
        }
        const newResponse = error.response
        newResponse.status = 200
        newResponse.data = getCachedResult.value
        return Promise.resolve(newResponse)
    }
    return Promise.reject(error)
}

export const etagRequestInterceptor = (config: AxiosRequestConfig) => {
    if (isCacheableMethod(config)) {
        const url = config.url
        if (url != null) {
            const lastCachedResult = cache.get(url)
            if (lastCachedResult) {
                config.headers = {...config.headers, "If-None-Match": lastCachedResult.etag}
            }
        }
    }
    return config
}

export const etagResponseInterceptor = (response: AxiosResponse) => {
    // if (isCacheableMethod(response.config)) {
    //     const responseETAG = response.headers.etag
    //     if (responseETAG && response.config.url != null) {
    //         cache.set(response.config.url, responseETAG, response.data)
    //     }
    // }
    return response
}

interface CacheValue {
    etag: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}

class Cache {
    private static readonly ETAG_KEY = "ETAG"
    private storage = window.localStorage

    get = (url: string): CacheValue | undefined => {
        const result = this.storage.getItem(Cache.ETAG_KEY + url)
        if (result == null) {
            return undefined
        }
        return JSON.parse(result)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set = (url: string, etag: string, value: any) => {
        this.storage.setItem(Cache.ETAG_KEY + url, JSON.stringify({etag, value}))
    }

    clearBadEtags = () => {
        log.debug("Clearing bad etags! Delete me after a while.")
        Object.keys(this.storage).forEach((key) => {
            if (key.includes(Cache.ETAG_KEY) && !cacheableEndpoints.includes(key.replace(Cache.ETAG_KEY, ""))) {
                this.storage.removeItem(key)
            }
        })
    }
}

const cache = new Cache()
cache.clearBadEtags()
