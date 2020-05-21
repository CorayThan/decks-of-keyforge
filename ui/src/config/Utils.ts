import * as Bowser from "bowser"
import { getMinutes, setMinutes, startOfMinute } from "date-fns"
import format from "date-fns/format"
import parse from "date-fns/parse"
import * as loglevel from "loglevel"
import { v4 as uuidv4 } from "uuid"

export const log = loglevel
log.setDefaultLevel("debug")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prettyJson = (write: any): string => JSON.stringify(write, null, 2)

export const roundToTens = (round: number) => Math.round(round * 10) / 10
export const roundToHundreds = (round: number) => Math.round(round * 100) / 100
export const roundToThousands = (round: number) => Math.round(round * 1000) / 1000

export class Utils {

    private static readonly readableDateFormat = "MMM d, yyyy"
    static readonly localDateFormat = "yyyy-MM-dd"
    static readonly zonedDateTimeFormat = "yyyy-MM-dd'T'HH:mm'Z'"
    static readonly bowser = Bowser.getParser(window.navigator.userAgent)

    static uuid = () => {
        return uuidv4()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static enumValues<T extends EnumType>(enunn: any): T[] {
        return Object.keys(enunn).filter(key => isNaN(+key)).map(name => enunn[name]) as T[]
    }

    static arrPlus = <T, O>(array: T[], add: O): (T | O)[] => {
        const newArr: (T | O)[] = array.slice()
        newArr.push(add)
        return newArr
    }

    static validateEmail = (email: string) => {
        // eslint-disable-next-line
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    }

    static formatZonedDateTimeToDate = (date: string) => {
        return format(Utils.parseZonedDateTime(date), Utils.readableDateFormat)
    }

    static formatDate = (date: string) => {
        try {
            return format(Utils.parseLocalDate(date), Utils.readableDateFormat)
        } catch (e) {
            log.warn("Couldn't parse date from " + date)
            return "bad date"
        }
    }

    static parseLocalDate = (date: string) => parse(date, Utils.localDateFormat, new Date())
    static parseZonedDateTime = (date: string) => parse(date, Utils.zonedDateTimeFormat, new Date())

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

    static shareUrl = (url: string, title?: string) => {
        try {
            // @ts-ignore
            navigator.share({
                title,
                url
            })
        } catch (e) {
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

export type SortOrder = "desc" | "asc"
