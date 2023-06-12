import { log, prettyJson, Utils } from "../config/Utils"
import { AllianceDeckFilters } from "../generated-src/AllianceDeckFilters"
import { AllianceDeckSortOptions } from "../generated-src/AllianceDeckSortOptions"
import { SortDirection } from "../generated-src/SortDirection"
import { isEqual } from "lodash"
import { queryParamsFromObject, SearchFiltersBuilder } from "../config/SearchFiltersBuilder"

export class AllianceDeckFiltersUtils {

    static rehydrateFromQuery = (params: string): AllianceDeckFilters => {
        log.debug(`Rehydrating alliance deck filters from : ${prettyJson(params)}`)

        const built = new SearchFiltersBuilder(params, {} as AllianceDeckFilters)
            .stringArrayValue("excludeHouses")
            .numberArrayValue("expansions")
            .stringArrayValue("houses")
            .value("invalidOnly")
            .stringArrayValue("owners")
            .value("page")
            .value("sort")
            .value("sortDirection")
            .value("teamDecks")
            .value("title")
            .value("validOnly")
            .build()

        // log.debug(`Rehydrated to2222: ${prettyJson(built)}`)
        return built
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

    static deckFiltersToQueryString = (filters: AllianceDeckFilters) => {
        const copied = Utils.jsonCopy(filters)

        Object.keys(copied).forEach((key: string) => {
            if (isEqual(copied[key], AllianceDeckFiltersUtils.empty[key])) {
                delete copied[key]
            }
        })

        return queryParamsFromObject(copied)
    }

}