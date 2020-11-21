import { Expansion } from "../generated-src/Expansion"

export class ExtendedExpansionUtils {

    static allowsEnhancements = (expansion: Expansion): boolean => {
        return expansion !== Expansion.CALL_OF_THE_ARCHONS
            && expansion !== Expansion.AGE_OF_ASCENSION
            && expansion !== Expansion.WORLDS_COLLIDE
    }
}