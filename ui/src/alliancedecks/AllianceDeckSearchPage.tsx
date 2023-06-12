import * as React from "react"
import { useEffect } from "react"
import { DeckSearchContainer } from "../decks/search/DeckSearchPage"
import { useHistory, useLocation } from "react-router-dom"
import { AllianceDeckFiltersUtils } from "./AllianceDeckFiltersUtils"
import { allianceFiltersStore } from "./AllianceFiltersStore"
import { allianceDeckStore } from "./AllianceDeckStore"

export const AllianceDeckSearchPage = () => {
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        const filters = AllianceDeckFiltersUtils.rehydrateFromQuery(location.search)
        allianceFiltersStore.updateFilters(filters)
        allianceDeckStore.searchDecks(filters)
    }, [location.search])

    return (
        <DeckSearchContainer
            history={history}
            location={location}
            queryParams={location.search}
        />
    )
}
