import * as Bowser from "bowser"
import { getMinutes, setMinutes, startOfMinute } from "date-fns"
import format from "date-fns/format"
import parse from "date-fns/parse"
import { round } from "lodash"
import * as loglevel from "loglevel"

export const log = loglevel
log.setDefaultLevel("debug")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prettyJson = (write: any): string => JSON.stringify(write, null, 2)

export const roundToTens = (round: number) => Math.round(round * 10) / 10
export const roundToHundreds = (round?: number) => round == null ? 0 : Math.round(round * 100) / 100
export const roundToThousands = (round: number) => Math.round(round * 1000) / 1000

export class Utils {

    private static readonly readableDateFormat = "MMM d, yyyy"
    private static readonly readableDateTimeFormat = "MMM d, yyyy, h:mm a"
    static readonly localDateFormat = "yyyy-MM-dd"
    static readonly zonedDateTimeFormat = "yyyy-MM-dd'T'HH:mm'Z'"
    static readonly dateTimeFormat = "yyyy-MM-dd'T'HH:mm"
    static readonly bowser = Bowser.getParser(window.navigator.userAgent)

    static pseudoUuid = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static equals = (first: any, second: any): boolean => {
        return JSON.stringify(first) === JSON.stringify(second)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static enumValues<T extends EnumType>(enunn: any): T[] {
        return Object.keys(enunn).filter(key => isNaN(+key)).map(name => enunn[name]) as T[]
    }

    static arrPlus = <T, O>(array: T[], add: O | O[]): (T | O)[] => {
        const newArr: (T | O)[] = array.slice()
        if (Array.isArray(add)) {
            return newArr.concat(add)
        } else {
            newArr.push(add)
            return newArr
        }
    }

    static validateEmail = (email: string) => {
        // eslint-disable-next-line
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    }

    static formatZonedDateTimeToDate = (date: string) => {
        return format(Utils.parseZonedDateTime(date), Utils.readableDateFormat)
    }

    static formatDateTimeToDate = (date: string) => {
        return format(Utils.parseDateTime(date), Utils.readableDateFormat)
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
    static parseDateTime = (date: string) => parse(date, Utils.dateTimeFormat, new Date())
    static parseReadableLocalDateTime = (date: string) => parse(date, Utils.readableDateTimeFormat, new Date())

    static nowDateString = () => format(new Date(), Utils.localDateFormat)

    static roundToNearestMinutes = (date: Date, interval: number) => {
        const roundedMinutes = Math.floor(getMinutes(date) / interval) * interval
        return setMinutes(startOfMinute(date), roundedMinutes)
    }

    static toNumberOrUndefined = (num?: number | string) => num == null || num === 0 || num === "" || num === "0" ? undefined : Number(num)

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

    static roundToKs = (toRound: number) => {
        if (toRound < 1000) {
            return toRound
        }
        return round(toRound / 1000, 0) + "k"
    }

    static cardNameIncludes = (cardName: string, search: string) => {
        if (search.trim().length < 3) {
            return true
        }
        const cardNameClean = cardName
            .toLowerCase()
            .replace(/æ/g, "ae")
            .replace(/\W+/g, "")

        const searchTokenized = Utils.tokenizeCardSearch(search)

        let match = true
        searchTokenized.forEach(searchToken => {
            if (!cardNameClean.includes(searchToken)) {
                match = false
            }
        })
        return match
    }

    static tokenizeCardSearch = (search: string) => {
        return search
            .toLowerCase()
            .replace(/\W+/g, " ")
            .split(" ")
            .filter(token => token.length > 2)
    }

    static filenameExtension = (file: File) => {
        const filename = file.name
        if (!filename.includes(".")) {
            return ""
        }
        return filename.split(".").pop() ?? ""
    }

    static removeLineBreaks = (toModify: string) => {
        return toModify.replace(/(\r\n|\n|\r)/gm, " ")
    }
}

type EnumType = string | number

export type SortOrder = "desc" | "asc"
