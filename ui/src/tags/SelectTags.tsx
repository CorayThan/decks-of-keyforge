import TextField from "@material-ui/core/TextField/TextField"
import { Autocomplete } from "@material-ui/lab"
import { observer } from "mobx-react"
import * as React from "react"
import { ChangeEvent } from "react"
import { spacing } from "../config/MuiConfig"
import { tagStore } from "./TagStore"

interface SelectTagsProps {
    label: string
    selectedTagIds: number[]
    handleTagsUpdate: (tagIds: number[]) => void
}

@observer
export class SelectTags extends React.Component<SelectTagsProps> {

    render() {
        const {label, selectedTagIds, handleTagsUpdate} = this.props

        const myTags = tagStore.myTags
        if (myTags == null) {
            return null
        }

        const selectedTagNames = selectedTagIds
            .map(tagId => myTags.find(tag => tag.id === tagId)?.name ?? undefined)
            .filter(tagName => tagName != null) as string[]

        return (
            <Autocomplete
                multiple={true}
                options={myTags.map(tag => tag.name)}
                value={selectedTagNames}
                renderInput={(params) => <TextField label={label} {...params}/>}
                onChange={(event: ChangeEvent<{}>, newTagNames: string[]) => {
                    const tagIds = newTagNames
                        .map(name => myTags?.find(tag => tag.name === name)?.id)
                        .filter(tagId => tagId != null) as number[]
                    handleTagsUpdate(tagIds)
                }}
                style={{marginTop: spacing(1)}}
            />
        )
    }
}
