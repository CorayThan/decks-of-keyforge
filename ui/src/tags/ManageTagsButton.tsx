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
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from "@material-ui/core"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../config/MuiConfig"
import { TimeUtils } from "../config/TimeUtils"
import { PublicityType } from "../generated-src/PublicityType"
import { TagDto } from "../generated-src/TagDto"
import { SortableTable } from "../generic/SortableTable"
import { KeyButton } from "../mui-restyled/KeyButton"
import { Loader } from "../mui-restyled/Loader"
import { ArchiveTagButton, DeleteTagButton } from "./TagPill"
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

    constructor(props: {}) {
        super(props)
        makeObservable(this)
    }

    render() {

        const myTags: TagDto[] = tagStore.myTags ?? []
        const nameError = myTags.find(tag => tag.name === this.name.trim()) != null

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
                            {(tagStore.updatingTags || tagStore.loadingMyTags) && <Loader/>}
                            <SortableTable
                                headers={[
                                    {
                                        property: "name",
                                    },
                                    {
                                        title: "Publicity",
                                        transform: tag => (
                                            <FormControl fullWidth={true}>
                                                <Select
                                                    value={tag.publicityType}
                                                    onChange={event => tagStore.updateTagPublicity(tag.id, event.target.value as PublicityType)}
                                                    disabled={tag.publicityType === PublicityType.BULK_SALE}
                                                >
                                                    <MenuItem value={PublicityType.PUBLIC}>Public</MenuItem>
                                                    <MenuItem value={PublicityType.NOT_SEARCHABLE}>Semi-Private</MenuItem>
                                                    <MenuItem value={PublicityType.PRIVATE}>Private</MenuItem>
                                                    {tag.publicityType === PublicityType.BULK_SALE && (
                                                        <MenuItem value={PublicityType.BULK_SALE} disabled={true}>Bulk Sale</MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        )
                                    },
                                    {
                                        property: "created",
                                        transform: tag => TimeUtils.formatDateTimeToDate(tag.created)
                                    },
                                    {
                                        transform: tag => (
                                            <Box display={"flex"}>
                                                <ArchiveTagButton tag={tag} disabled={tag.publicityType === PublicityType.BULK_SALE}/>
                                                <DeleteTagButton tag={tag}/>
                                            </Box>
                                        ),
                                        sortable: false,
                                    },
                                ]}
                                data={myTags}
                                defaultSort={"created"}
                            />

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
                                color={themeStore.darkMode ? "secondary" : "primary"}
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
