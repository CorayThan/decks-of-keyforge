import { Box, Link, Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useEffect } from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { DeckFilters } from "../decks/search/DeckFilters"
import { TagDto } from "../generated-src/TagDto"
import { SortableTable, SortableTableHeaderInfo } from "../generic/SortableTable"
import { Loader } from "../mui-restyled/Loader"
import { tagStore } from "./TagStore"

export const TagSearchPage = observer(() => {

    useEffect(() => {
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
            return <Link href={Routes.deckSearch(filters)}>{tag.name}</Link>
        }
    },
    {
        property: "creatorUsername",
        transform: (tag) => <Link href={Routes.userProfilePage(tag.creatorUsername)}>{tag.creatorUsername}</Link>
    },
    {property: "deckQuantity"},
    {property: "views"},
    {property: "viewsThisMonth"},
    {
        property: "created",
        transform: (tag) => Utils.formatDateTimeToDate(tag.created)
    },
]
