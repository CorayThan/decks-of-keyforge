import * as Sentry from "@sentry/browser"
import { KeyUserDto } from "../generated-src/KeyUserDto"
import { CheckBrowser } from "./CheckBrowser"
import { clientVersion } from "./ClientVersion"
import { Utils } from "./Utils"

const runSentry = !Utils.isDev() && CheckBrowser.check()

class Monitoring {

    initialize = () => {
        if (runSentry) {
            Sentry.init({
                dsn: "https://a5837898c7064942aeedad8a70803b0f@o394170.ingest.sentry.io/5243978",
                ignoreErrors: [
                    "Request failed with status code 401",
                    "Request failed with status code 404",
                    "Non-Error promise rejection captured with keys: message",
                    "AbortError: Share canceled",
                    "AbortError: Abort due to cancellation of share ",
                ],
                whitelistUrls: [
                    "decksofkeyforge.com"
                ]
            })
            Sentry.setTag("client-version", clientVersion.toString())
        }
    }

    setUser = (user: KeyUserDto) => {
        if (runSentry) {
            Sentry.setTag("username", user.username)
            Sentry.setContext("user", {
                username: user.username,
                patreonTier: user.patreonTier,
            })
        }
    }

    setApiVersionTag = (apiVersion: string) => {
        if (runSentry) {
            Sentry.setTag("api-version", apiVersion)
            Sentry.setTag("version-match", (clientVersion.toString() === apiVersion).toString())
        }
    }

}

export const monitoring = new Monitoring()
