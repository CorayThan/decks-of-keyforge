import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@material-ui/core"
import { addMinutes, format, isValid, subMinutes } from "date-fns"
import { startCase } from "lodash"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { spacing } from "../config/MuiConfig"
import { TimeUtils } from "../config/TimeUtils"
import { Utils } from "../config/Utils"
import { KeyForgeEventDto } from "../generated-src/KeyForgeEventDto"
import { KeyForgeFormat } from "../generated-src/KeyForgeFormat"
import { PatreonRewardsTier } from "../generated-src/PatreonRewardsTier"
import { KeyButton } from "../mui-restyled/KeyButton"
import { PatreonRequired } from "../thirdpartysites/patreon/PatreonRequired"
import { userStore } from "../user/UserStore"
import { keyForgeEventStore } from "./KeyForgeEventStore"
import { SelectEventImage } from "./SelectEventImage"

export const CreateKeyForgeEvent = observer((props: { initialEvent?: KeyForgeEventDto, copy?: boolean }) => {
    const {initialEvent, copy} = props

    const [store] = useState(new CreateKeyForgeEventStore(initialEvent, copy))

    const kfEvent = store.event

    const isPatron = userStore.patron

    let buttonName = "Create an Event"
    if (initialEvent != null) {
        buttonName = copy ? "Copy" : "Update"
    }

    return (
        <>
            <Button
                onClick={() => store.open = true}
                variant={initialEvent == null ? "outlined" : undefined}
                color={initialEvent == null ? "primary" : undefined}
            >
                {buttonName}
            </Button>
            <Dialog
                open={store.open}
            >
                <DialogTitle>{initialEvent == null ? "Create a new Event" : "Update an Event"}</DialogTitle>
                <DialogContent>
                    <PatreonRequired
                        requiredLevel={PatreonRewardsTier.NOTICE_BARGAINS}
                        message={"Please become a Patron of the site to list upcoming KeyForge events!"}
                        style={{marginBottom: spacing(2)}}
                    />
                    <Grid container={true} spacing={2}>
                        <Grid item={true} xs={9}>
                            <TextField
                                label={"Name"}
                                value={kfEvent.name}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => kfEvent.name = event.target.value}
                                required={true}
                                fullWidth={true}
                                error={!store.nameValid() && store.saveAttempted}
                                helperText={kfEvent.name.trim().length > store.maxNameLength ? `Name must be ${store.maxNameLength} characters or less. Current length: ${kfEvent.name.trim().length}` : undefined}
                            />
                        </Grid>
                        <Grid item={true} xs={3}>
                            <SelectEventImage selectedImg={kfEvent.banner} setImage={(imgName: string) => kfEvent.banner = imgName}/>
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <TextField
                                label={"Start Date Time"}
                                type={"datetime-local"}
                                value={kfEvent.startDateTime}
                                onChange={(event) => kfEvent.startDateTime = event.target.value}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required={true}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                    Time in {store.timeInUTC ? "UTC" : TimeUtils.readableTimeZoneOffset()}
                                </Typography>
                                <Button
                                    style={{marginLeft: spacing(2)}}
                                    size={"small"}
                                    variant={"outlined"}
                                    onClick={() => store.timeInUTC = !store.timeInUTC}
                                >
                                    Switch to {store.timeInUTC ? TimeUtils.readableTimeZoneOffset() : "UTC"}
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <TextField
                                label={"Description"}
                                value={kfEvent.description}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => kfEvent.description = event.target.value}
                                required={true}
                                multiline={true}
                                rows={3}
                                fullWidth={true}
                                error={!store.descriptionValid() && store.saveAttempted}
                                helperText={kfEvent.description.trim().length > store.maxDescriptionLength ? `Description must be 1000 characters or less. Current length: ${kfEvent.description.trim().length}` : undefined}
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <TextField
                                label={"Signup Link"}
                                value={kfEvent.signupLink}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => kfEvent.signupLink = event.target.value}
                                helperText={"Required url, e.g. https://coolkeyforge.com/my-event"}
                                fullWidth={true}
                                required={true}
                                error={!store.signupLinkValid() && store.saveAttempted}
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <TextField
                                label={"Event Discord"}
                                value={kfEvent.discordServer}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => kfEvent.discordServer = event.target.value}
                                helperText={"Invite to discord server, e.g. https://discord.gg/sNkHD7k"}
                                fullWidth={true}
                                error={!store.discordServerValid()}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <FormControl
                                fullWidth={true}
                            >
                                <InputLabel id="demo-simple-select-label">Variant</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={kfEvent.format}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => kfEvent.format = event.target.value as KeyForgeFormat}
                                >
                                    {Utils.enumValues(KeyForgeFormat).map(format => (
                                        <MenuItem key={format} value={format}>{startCase((format as string).toLowerCase())}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={kfEvent.sealed}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => kfEvent.sealed = event.target.checked}
                                        name={"Sealed Event"}
                                    />
                                }
                                label={"Sealed Event"}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <TextField
                                label={"Entry Fee"}
                                value={kfEvent.entryFee}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => kfEvent.entryFee = event.target.value}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={6}>
                            <TextField
                                label={"Expected Duration"}
                                value={kfEvent.duration}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => kfEvent.duration = event.target.value}
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <KeyButton
                        onClick={store.toggleOpen}
                        disabled={keyForgeEventStore.savingEvent}
                    >
                        Cancel
                    </KeyButton>
                    <KeyButton
                        onClick={() => store.reset(false)}
                        disabled={keyForgeEventStore.savingEvent}
                    >
                        Reset
                    </KeyButton>
                    <KeyButton
                        color={"primary"}
                        loading={keyForgeEventStore.savingEvent}
                        disabled={!isPatron}
                        onClick={async () => {
                            if (!store.valid()) {
                                store.saveAttempted = true
                            } else {
                                store.saveAttempted = false
                                const eventToSend = store.cleanEvent()
                                keyForgeEventStore.saveEvent(eventToSend)
                                store.toggleOpen()
                            }
                        }}
                    >
                        Save
                    </KeyButton>
                </DialogActions>
            </Dialog>
        </>
    )
})

class CreateKeyForgeEventStore {

    maxNameLength = 40
    maxDescriptionLength = 1000

    @observable
    saveAttempted = false

    @observable
    open = false

    @observable
    timeInUTC = false

    @observable
        // @ts-ignore
    event: KeyForgeEventDto

    toggleOpen = () => {
        this.open = !this.open
    }

    valid = () => {
        return this.nameValid() &&
            this.descriptionValid() &&
            this.signupLinkValid() &&
            this.discordServerValid() &&
            isValid(new Date(this.event.startDateTime))
    }

    descriptionValid = () => {
        return this.event.description.trim().length > 3 && this.event.description.trim().length <= this.maxDescriptionLength
    }

    nameValid = () => {
        return this.event.name.length > 3 && this.event.name.trim().length <= this.maxNameLength
    }

    signupLinkValid = () => {
        return Utils.validateUrl(this.event.signupLink)
    }

    discordServerValid = () => {
        return this.event.discordServer == null || this.event.discordServer.trim().length === 0 || Utils.validateDiscordServer(this.event.discordServer.trim())
    }

    cleanEvent = () => {
        const event = {...this.event}
        event.signupLink = event.signupLink.trim()
        event.name = event.name.trim()
        event.description = event.description.trim()
        event.signupLink = event.signupLink?.trim()
        event.discordServer = event.discordServer?.trim()
        event.entryFee = event.entryFee?.trim()
        event.duration = event.duration?.trim()
        if (event.discordServer?.length === 0) {
            event.discordServer = undefined
        }
        if (event.entryFee?.length === 0) {
            event.entryFee = undefined
        }
        if (event.duration?.length === 0) {
            event.duration = undefined
        }

        if (!this.timeInUTC) {
            const modifiedDateTime = subMinutes(TimeUtils.parseDateTime(event.startDateTime), TimeUtils.currentTimeZoneOffset())
            event.startDateTime = format(modifiedDateTime, TimeUtils.dateTimeFormat)
        }

        return event
    }

    reset = (copy?: boolean) => {
        if (this.originalEvent == null) {
            this.event = {
                name: "",
                description: "",
                signupLink: "",
                format: KeyForgeFormat.ARCHON,
                online: true,
                sealed: false,
                startDateTime: TimeUtils.nowPlus1WeekDateTimeString(),
                hasTournament: false
            }
        } else {
            this.event = Utils.jsonCopy(this.originalEvent)
            if (copy) {
                this.event.id = undefined
            }
            const modifiedDateTime = addMinutes(TimeUtils.parseDateTime(this.event.startDateTime), TimeUtils.currentTimeZoneOffset())
            this.event.startDateTime = format(modifiedDateTime, TimeUtils.dateTimeFormat)
            if (this.event.discordServer == null) {
                this.event.discordServer = ""
            }
            if (this.event.entryFee == null) {
                this.event.entryFee = ""
            }
            if (this.event.duration == null) {
                this.event.duration = ""
            }
        }
        this.saveAttempted = false
    }

    constructor(private originalEvent?: KeyForgeEventDto, private copy?: boolean) {
        makeObservable(this)
        this.reset(copy)
    }

}