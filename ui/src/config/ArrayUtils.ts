
export class ArrayUtils {
    static removeFromArray = <T>(array: T[], toRemove: T) => {
        const idx = array.indexOf(toRemove)
        array.splice(idx, 1)
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

    static arrayContains = <T>(array: T[], contains: T) => {
        for (const thing of array) {
            if (thing === contains) {
                return true
            }
        }
        return false
    }

    static removeIfContains = <T>(array: T[], toRemove: T) => {
        if (ArrayUtils.arrayContains(array, toRemove)) {
            const idx = array.indexOf(toRemove)
            array.splice(idx, 1)
        }
    }

    static addIfDoesntExist = <T>(array: T[], toAdd: T) => {
        if (!ArrayUtils.arrayContains(array, toAdd)) {
            array.push(toAdd)
        }
    }
}