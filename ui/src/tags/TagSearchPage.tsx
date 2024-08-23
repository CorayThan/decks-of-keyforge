import { Box, Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { TimeUtils } from "../config/TimeUtils"
import { DeckFilters } from "../decks/search/DeckFilters"
import { TagDto } from "../generated-src/TagDto"
import { SortableTable, SortableTableHeaderInfo } from "../generic/SortableTable"
import { Loader } from "../mui-restyled/Loader"
import { tagStore } from "./TagStore"
import { DokLink } from "../generic/DokLink"
import { uiStore } from "../ui/UiStore"

export const TagSearchPage = observer(() => {

    useEffect(() => {
        uiStore.setTopbarValues("Deck Tags", "Tags", "Publicly tagged decks")
        tagStore.findPublicTags()
    }, [])

    const publicTags = tagStore.publicTags

    if (publicTags == null) {
        return <Loader/>
    }

    return (
        <Box m={4} display={"flex"} justifyContent={"center"}>
            <Paper style={{maxWidth: 1200, overflowX: "auto"}}>
                <Typography color={"primary"} variant={"h4"} style={{padding: spacing(2)}}>
                    Public Deck Tags
                </Typography>
                <SortableTable
                    defaultSort={"viewsThisMonth"}
                    data={publicTags}
                    headers={tagsTableHeaders}
                />
            </Paper>
        </Box>
    )
})

const tagsTableHeaders: SortableTableHeaderInfo<TagDto>[] = [
    {
        property: "name",
        transform: (tag) => {
            const filters = new DeckFilters()
            filters.tags = [tag.id]
            return <DokLink href={Routes.deckSearch(filters)}>{tag.name}</DokLink>
        }
    },
    {
        property: "creatorUsername",
        transform: (tag) => <DokLink href={Routes.userProfilePage(tag.creatorUsername)}>{tag.creatorUsername}</DokLink>
    },
    {property: "deckQuantity"},
    {property: "views"},
    {property: "viewsThisMonth"},
    {
        property: "created",
        transform: (tag) => TimeUtils.formatDateTimeToDate(tag.created)
    },
]
