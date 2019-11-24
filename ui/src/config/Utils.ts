import * as Bowser from "bowser"
import { fromUnixTime, getMinutes, setMinutes, startOfMinute } from "date-fns"
import format from "date-fns/format"
import parse from "date-fns/parse"
import * as loglevel from "loglevel"
import { observable } from "mobx"
import { messageStore } from "../ui/MessageStore"

export const log = loglevel
log.setDefaultLevel("debug")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prettyJson = (write: any): string => JSON.stringify(write, null, 2)

export const roundToTens = (round: number) => Math.round(round * 10) / 10
export const roundToHundreds = (round: number) => Math.round(round * 100) / 100

try {
    // @ts-ignore
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
            Utils.canWriteToClipboard = true
        }
    })
} catch (e) {
    log.warn("Can't write to clipboard due to " + e)
}

export class Utils {

    static readonly localDateFormat = "yyyy-MM-dd"
    static readonly bowser = Bowser.getParser(window.navigator.userAgent)

    @observable
    static canWriteToClipboard = false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static enumValues<T extends EnumType>(enunn: any): T[] {
        return Object.keys(enunn).filter(key => isNaN(+key)).map(name => enunn[name]) as T[]
    }

    static validateEmail = (email: string) => {
        // eslint-disable-next-line
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    }

    static epochSecondsToDate = (epochSeconds: number) => format(fromUnixTime(epochSeconds), "MMM d, yyyy")

    static formatDate = (date: string) => format(Utils.parseLocalDate(date), "MMM d, yyyy")

    static parseLocalDate = (date: string) => parse(date, Utils.localDateFormat, new Date())

    static nowDateString = () => format(new Date(), Utils.localDateFormat)

    static roundToNearestMinutes = (date: Date, interval: number) => {
        const roundedMinutes = Math.floor(getMinutes(date) / interval) * interval
        return setMinutes(startOfMinute(date), roundedMinutes)
    }

    static isDev = () => process.env.NODE_ENV === "development"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static jsonCopy = (toCopy: any) => {
        return JSON.parse(JSON.stringify(toCopy))
    }

    static valueFromPercentiles = (value: number, percentiles: { [key: number]: number }) => {
        const percentile = percentiles[Math.round(value)]
        if (percentile != null) {
            return Math.round(percentile)
        }
        return 0
    }

    static copyToClipboard = (url: string) => {
        if (Utils.canWriteToClipboard) {
            try {
                navigator.clipboard.writeText(url)
                    .then(() => {
                        messageStore.setSuccessMessage("Copied URL", 3000)
                    }, () => {
                        messageStore.setWarningMessage("Couldn't copy URL", 3000)
                    })
            } catch (e) {
                messageStore.setWarningMessage("Couldn't copy URL", 3000)
            }
        } else {
            log.warn("Can't write to clipboard in this case!")
        }
    }

    static shareUrl = (url: string, title?: string) => {
        try {
            // @ts-ignore
            navigator.share({
                title,
                url
            })
        } catch (e) {
            Utils.copyToClipboard(url)
            log.debug(`Couldn't share with bowser info ${prettyJson(Utils.bowser.getBrowser())} ` + e.toString())
        }
    }

    static canShare = () => {
        return Utils.bowser
            .satisfies({
                mobile: {
                    safari: ">=12.2",
                    chrome: ">=61"
                },
                macos: {
                    safari: ">=12.1"
                },
            })
    }
}

type EnumType = string | number
