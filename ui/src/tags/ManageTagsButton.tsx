import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@material-ui/core"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { PublicityType } from "../generated-src/PublicityType"
import { KeyButton } from "../mui-restyled/KeyButton"
import { TagDeletePill } from "./TagPill"
import { tagStore } from "./TagStore"

@observer
export class ManageTagsButton extends React.Component {

    @observable
    open = false

    @observable
    name = ""

    @observable
    publicityType = PublicityType.PRIVATE

    reset = () => {
        this.open = false
        this.resetNoClose()
    }

    resetNoClose = () => {
        this.name = ""
        this.publicityType = PublicityType.PRIVATE
    }

    valid = () => {
        return this.name.trim().length !== 0
    }

    create = async () => {
        await tagStore.createTag({
            name: this.name,
            public: this.publicityType
        })
        this.resetNoClose()
    }

    render() {

        const nameError = tagStore.myTags?.find(tag => tag.name === this.name.trim()) != null

        return (
            <>
                <Button
                    onClick={() => this.open = true}
                    size={"small"}
                    variant={"outlined"}
                >
                    Manage Tags
                </Button>
                {this.open && (
                    <Dialog
                        open={this.open}
                        onClose={this.reset}
                    >
                        <DialogTitle>Manage Tags</DialogTitle>
                        <DialogContent>
                            <Typography variant={"subtitle1"} style={{marginBottom: spacing(1)}}>Delete Tags</Typography>
                            <Box display={"flex"} flexWrap={"wrap"}>
                                {tagStore.myTags?.map(tag => {
                                    return (
                                        <TagDeletePill key={tag.id} tag={tag} style={{marginRight: spacing(2)}}/>
                                    )
                                })}
                            </Box>

                            <Typography variant={"subtitle1"} style={{marginTop: spacing(2), marginBottom: spacing(1)}}>Create Tag</Typography>
                            <TextField
                                value={this.name}
                                onChange={event => this.name = event.target.value}
                                variant={"outlined"}
                                label={"Name"}
                                error={nameError}
                                helperText={nameError ? "Unique tag name required" : undefined}
                                style={{marginBottom: spacing(2), width: 400}}
                            />
                            <FormControl fullWidth={true}>
                                <FormLabel>Tag Type</FormLabel>
                                <RadioGroup
                                    name="tag type"
                                    value={this.publicityType}
                                    onChange={(event) => {
                                        this.publicityType = event.target.value as PublicityType
                                    }}
                                    row={true}
                                >
                                    <FormControlLabel
                                        value={PublicityType.PRIVATE}
                                        control={<Radio/>}
                                        label="Private"
                                    />
                                    <FormControlLabel
                                        value={PublicityType.NOT_SEARCHABLE}
                                        control={<Radio/>}
                                        label="Semi-Private"
                                    />
                                    <FormControlLabel
                                        value={PublicityType.PUBLIC}
                                        control={<Radio/>}
                                        label="Public"
                                    />
                                </RadioGroup>
                                <FormHelperText>Semi-Private tags can be seen with direct links, but not publicly searched.</FormHelperText>
                            </FormControl>
                            <KeyButton
                                color={"primary"}
                                onClick={this.create}
                                disabled={!this.valid()}
                                loading={tagStore.loadingMyTags}
                                variant={"outlined"}
                                style={{marginTop: spacing(2)}}
                            >
                                Create Tag
                            </KeyButton>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.reset}>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </>
        )
    }
}
