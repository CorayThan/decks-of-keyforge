export class KeyLocalStorage {

    static saveAuthKey = (token: string) => KeyLocalStorage.localStorage.setItem(Keys.AUTH, token)
    static findAuthKey = (): string | undefined => {
        const key = KeyLocalStorage.localStorage.getItem(Keys.AUTH)
        if (key === null) {
            return undefined
        }
        return key
    }
    static clear = () => KeyLocalStorage.localStorage.clear()

    private static localStorage = window.localStorage
}

enum Keys {
    AUTH = "AUTH",
}
