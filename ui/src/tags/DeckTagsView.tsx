import { Box } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { TagPill } from "./TagPill"
import { tagStore } from "./TagStore"

interface TagsViewProps {
    deckId: number
}

@observer
export class DeckTagsView extends React.Component<TagsViewProps> {

    render() {
        const {deckId} = this.props

        const myTags = tagStore.myTags
        const tagIdsOnDeck = tagStore.myTaggedDecks?.get(deckId) ?? []
        if (myTags == null) {
            return null
        }

        return (
            <Box display={"flex"} flexWrap={"wrap"}>
                {myTags.map(tag => {
                    const tagOnDeck = tagIdsOnDeck.includes(tag.id)
                    if (!tagOnDeck && tag.archived) {
                        return null
                    }
                    return (
                        <TagPill
                            key={tag.id}
                            tag={tag}
                            active={tagOnDeck}
                            deckId={deckId}
                            style={{margin: spacing(1, 1, 0, 0)}}
                        />
                    )
                })}
            </Box>
        )
    }
}
