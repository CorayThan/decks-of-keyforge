import { log, Utils } from "../config/Utils";
import { AllianceDeckFilters } from "../generated-src/AllianceDeckFilters";
import { DeckFilters } from "../decks/search/DeckFilters";
import { AllianceDeckSortOptions } from "../generated-src/AllianceDeckSortOptions";
import { SortDirection } from "../generated-src/SortDirection";
import { isEqual } from "lodash";

export class AllianceDeckFiltersUtils {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static rehydrateFromQuery = (queryObject: any): AllianceDeckFilters => {
        log.debug(`Rehydrating alliance deck filters`)
        return DeckFilters.rehydrateFromQuery(queryObject) as unknown as AllianceDeckFilters
    }

    static createEmpty = (): AllianceDeckFilters => {
        return {
            houses: [],
            excludeHouses: [],
            title: "",
            page: 0,
            expansions: [],
            teamDecks: false,
            owners: [],
            pageSize: 20,
            sort: AllianceDeckSortOptions.SAS_RATING,
            sortDirection: SortDirection.DESC,
            validOnly: false,
            invalidOnly: false,
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static empty: any = AllianceDeckFiltersUtils.createEmpty()

    static prepareDeckFiltersForQueryString = (filters: AllianceDeckFilters) => {
        const copied = Utils.jsonCopy(filters)

        Object.keys(copied).forEach((key: string) => {
            if (isEqual(copied[key], AllianceDeckFiltersUtils.empty[key])) {
                delete copied[key]
            }
        })

        return copied
    }

}