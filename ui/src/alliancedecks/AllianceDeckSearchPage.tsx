import * as QueryString from "query-string"
import * as React from "react"
import { useEffect } from "react"
import { DeckSearchContainer } from "../decks/search/DeckSearchPage";
import { useHistory, useLocation } from "react-router-dom";
import { AllianceDeckFiltersUtils } from "./AllianceDeckFiltersUtils";
import { allianceFiltersStore } from "./AllianceFiltersStore";
import { allianceDeckStore } from "./AllianceDeckStore";

export const AllianceDeckSearchPage = () => {
    const location = useLocation()
    const history = useHistory()
    const queryValues = QueryString.parse(location.search)

    useEffect(() => {
        const filters = AllianceDeckFiltersUtils.rehydrateFromQuery(queryValues)
        allianceFiltersStore.updateFilters(filters)
        allianceDeckStore.searchDecks(filters)
    }, [queryValues])

    return (
        <DeckSearchContainer
            history={history}
            location={location}
            queryParams={location.search}
        />
    )
}
