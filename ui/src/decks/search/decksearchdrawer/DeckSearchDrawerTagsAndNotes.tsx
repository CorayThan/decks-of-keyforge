import { Box } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import Typography from "@material-ui/core/Typography"
import { isEqual } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { memo, useEffect } from "react"
import { SearchDrawerExpansionPanel } from "../../../components/SearchDrawerExpansionPanel"
import { spacing } from "../../../config/MuiConfig"
import { log } from "../../../config/Utils"
import { HelperText } from "../../../generic/CustomTypographies"
import { NotesSearch } from "../../../notes/NotesSearch"
import { ManageTagsButton } from "../../../tags/ManageTagsButton"
import { SelectTags } from "../../../tags/SelectTags"
import { TagPillSimple } from "../../../tags/TagPill"
import { tagStore } from "../../../tags/TagStore"

interface DeckSearchDrawerTagsAndNotesProps {
    initiallyOpen: boolean
    viewNotes: boolean
    loggedIn: boolean
    updateViewNotes: () => void
    selectedTagIds: number[]
    updateTagIds: (tagIds: number[]) => void
    selectedNotTagIds: number[]
    updateNotTagIds: (tagIds: number[]) => void
    notes: string
    notesUser: string
    handleNotesUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void
    removeNotes: () => void
}

const checkEquality = (prevProps: DeckSearchDrawerTagsAndNotesProps, nextProps: DeckSearchDrawerTagsAndNotesProps) => {
    return prevProps.initiallyOpen === nextProps.initiallyOpen &&
        prevProps.viewNotes === nextProps.viewNotes &&
        prevProps.loggedIn === nextProps.loggedIn &&
        isEqual(prevProps.selectedTagIds, nextProps.selectedTagIds) &&
        isEqual(prevProps.selectedNotTagIds, nextProps.selectedNotTagIds) &&
        prevProps.notes === nextProps.notes &&
        prevProps.notesUser === nextProps.notesUser
}

export const DeckSearchDrawerTagsAndNotes = memo((props: DeckSearchDrawerTagsAndNotesProps) => {
    const {
        initiallyOpen, viewNotes, loggedIn, updateViewNotes, selectedTagIds, updateTagIds, selectedNotTagIds,
        updateNotTagIds, notes, notesUser, handleNotesUpdate, removeNotes
    } = props

    log.info("selected tag ids: " + selectedTagIds)

    return (
        <SearchDrawerExpansionPanel
            initiallyOpen={initiallyOpen}
            title={"Tags & Notes"}
        >
            {loggedIn ? (
                <>
                    <Box display={"flex"} alignItems={"center"}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={viewNotes}
                                    onChange={updateViewNotes}
                                />
                            }
                            label={<Typography variant={"body2"} noWrap={true}>View Tags & Notes</Typography>}
                            style={{flexGrow: 1}}
                        />
                        <ManageTagsButton/>
                    </Box>
                    <SelectTags
                        selectedTagIds={selectedTagIds}
                        handleTagsUpdate={updateTagIds}
                        label={"Include Tags"}
                    />
                    <SelectTags
                        selectedTagIds={selectedNotTagIds}
                        handleTagsUpdate={updateNotTagIds}
                        label={"Do Not Include Tags"}
                    />
                    <NotesSearch
                        notesUser={notesUser}
                        notes={notes}
                        handleNotesUpdate={handleNotesUpdate}
                        removeNotes={removeNotes}

                    />
                </>
            ) : (
                <HelperText>Please login to search your tags</HelperText>
            )}
            {(selectedTagIds.length > 0 || selectedNotTagIds.length > 0) && (
                <PublicTagsSearched
                    tags={selectedTagIds}
                    notTags={selectedNotTagIds}
                />
            )}
        </SearchDrawerExpansionPanel>
    )
}, checkEquality)

const PublicTagsSearched = observer((props: { tags: number[], notTags: number[] }) => {

    const {tags, notTags} = props

    log.info("Search public tags render")
    useEffect(() => {
        log.info("Search public tags")
        tagStore.findSearchTags(tags.concat(notTags))
    }, [tags, notTags])

    const searchedTags = tagStore.searchTags

    const myTags = tagStore.myTags ?? []

    if (searchedTags == null) {
        return null
    }

    const filteredSearchedTags = searchedTags.filter(tag => myTags.find(myTag => myTag.id === tag.id) == null)

    if (filteredSearchedTags == null) {
        return null
    }

    const filteredIncludeTags = filteredSearchedTags.filter(tag => tags.find(includeTagId => tag.id === includeTagId) != null)
    const filteredNotIncludeTags = filteredSearchedTags.filter(tag => notTags.find(notIncludeTagId => tag.id === notIncludeTagId) != null)

    return (
        <Box mt={2}>
            {filteredIncludeTags.length > 0 && (
                <>
                    <Typography variant={"subtitle2"}>Found decks with tags:</Typography>
                    <Box display={"flex"} flexWrap={"wrap"}>
                        {filteredIncludeTags.map(tag => (
                            <TagPillSimple tag={tag} key={tag.id} style={{margin: spacing(2, 2, 0, 0)}}/>
                        ))}
                    </Box>
                </>
            )}
            {filteredNotIncludeTags.length > 0 && (
                <>
                    <Typography variant={"subtitle2"}>Found decks without tags:</Typography>
                    <Box display={"flex"} flexWrap={"wrap"}>
                        {filteredNotIncludeTags.map(tag => (
                            <TagPillSimple tag={tag} key={tag.id} style={{margin: spacing(2, 2, 0, 0)}}/>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    )

})
