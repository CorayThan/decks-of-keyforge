import { log } from "../config/Utils";
import { AllianceDeckFilters } from "../generated-src/AllianceDeckFilters";
import { DeckFilters } from "../decks/search/DeckFilters";

export class AllianceDeckFiltersUtils {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static rehydrateFromQuery = (queryObject: any): AllianceDeckFilters => {
        log.debug(`Rehydrating alliance deck filters`)
        return DeckFilters.rehydrateFromQuery(queryObject) as AllianceDeckFilters
    }

}