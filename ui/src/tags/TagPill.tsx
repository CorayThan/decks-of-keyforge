import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from "@material-ui/core"
import { Archive, Delete, Unarchive } from "@material-ui/icons"
import * as React from "react"
import { useState } from "react"
import { PublicityType } from "../generated-src/PublicityType"
import { TagDto } from "../generated-src/TagDto"
import { KeyButton } from "../mui-restyled/KeyButton"
import { tagStore } from "./TagStore"

export const TagPillSimple = (props: { tag: TagDto, style?: React.CSSProperties }) => {
    const {tag, style} = props
    return (
        <Chip
            label={tag.name}
            style={style}
        />
    )
}

export const TagPill = (props: { tag: TagDto, active: boolean, deckId: number, style?: React.CSSProperties }) => {
    const {tag, active, deckId, style} = props
    let avatar = undefined
    if (tag.publicityType === PublicityType.NOT_SEARCHABLE) {
        avatar = <Avatar>SP</Avatar>
    } else if (tag.publicityType === PublicityType.PUBLIC) {
        avatar = <Avatar>P</Avatar>
    }
    return (
        <Chip
            label={tag.name}
            avatar={avatar}
            color={active ? "primary" : undefined}
            onClick={() => {
                active ? tagStore.untagDeck(deckId, tag.id) : tagStore.tagDeck(deckId, tag.id)
            }}
            style={style}
        />

    )
}

export const DeleteTagButton = (props: { tag: TagDto }) => {
    const {tag} = props
    const [open, setOpen] = useState(false)
    return (
        <>
            <Tooltip title={"Delete"}>
                <IconButton
                    onClick={() => setOpen(true)}
                >
                    <Delete/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>Delete?</DialogTitle>
                <DialogContent>
                    <Typography>This tag will be permanently deleted and removed from all decks.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <KeyButton
                        onClick={async () => {
                            await tagStore.deleteTag(tag.id)
                            setOpen(false)
                        }}
                        loading={tagStore.loadingMyTags}
                    >
                        Delete
                    </KeyButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export const ArchiveTagButton = (props: { tag: TagDto }) => {
    const {tag} = props
    return (
        <Tooltip title={tag.archived ? "Unarchive" : "Archive. Archived tags will only show on decks if the deck is tagged with them."}>
            <IconButton
                onClick={() => tagStore.archiveTag(tag.id)}
                disabled={tagStore.loadingMyTags}
            >
                {tag.archived ? (
                    <Unarchive/>
                ) : (
                    <Archive/>
                )}
            </IconButton>
        </Tooltip>
    )
}
