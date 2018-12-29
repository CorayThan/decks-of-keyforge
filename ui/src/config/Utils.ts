import * as format from "date-fns/format"
import * as parse from "date-fns/parse"
import * as loglevel from "loglevel"

export const log = loglevel
log.setDefaultLevel("debug")

// tslint:disable-next-line
export const prettyJson = (write: any): string => JSON.stringify(write, null, 2)

export class Utils {
    // tslint:disable-next-line
    static enumValues<T extends EnumType>(enunn: any): T[] {
        return Object.keys(enunn).filter(key => isNaN(+key)).map(name => enunn[name]) as T[]
    }

    static validateEmail = (email: string) => {
        // tslint:disable-next-line
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    }

    static formatDate = (date: string) => format(parse(date), "MMM D, YYYY")
}

type EnumType = string | number
