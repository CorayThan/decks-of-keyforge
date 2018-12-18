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
}

type EnumType = string | number
