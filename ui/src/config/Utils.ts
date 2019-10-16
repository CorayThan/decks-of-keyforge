import { getMinutes, setMinutes, startOfMinute } from "date-fns"
import format from "date-fns/format"
import parse from "date-fns/parse"
import * as loglevel from "loglevel"

export const log = loglevel
log.setDefaultLevel("debug")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prettyJson = (write: any): string => JSON.stringify(write, null, 2)

export class Utils {

    static readonly localDateFormat = "yyyy-MM-dd"

    static roundToTens = (round: number) =>  Math.round(round * 10) / 10

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static enumValues<T extends EnumType>(enunn: any): T[] {
        return Object.keys(enunn).filter(key => isNaN(+key)).map(name => enunn[name]) as T[]
    }

    static validateEmail = (email: string) => {
        // eslint-disable-next-line
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    }

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
}

type EnumType = string | number
