import { log } from "./Utils"

export class KeyLocalStorage {

    static saveAuthKey = (token: string) => KeyLocalStorage.localStorage.setItem(Keys.AUTH, token)
    static findAuthKey = (): string | undefined => {
        const key = KeyLocalStorage.localStorage.getItem(Keys.AUTH)
        if (key === null) {
            log.debug("No auth key in local storage.")
            return undefined
        }
        log.debug("Found auth key in local storage.")
        return key
    }
    static clear = () => {
        log.debug("Clearing local storage.")
        KeyLocalStorage.localStorage.clear()
    }

    private static localStorage = window.localStorage
}

enum Keys {
    AUTH = "AUTH",
}
