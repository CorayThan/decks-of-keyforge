import { Dialog, IconButton, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import { Save } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { KeyButton } from "../mui-restyled/KeyButton"
import { Loader } from "../mui-restyled/Loader"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { userDeckStore } from "./UserDeckStore"

interface DeckNoteProps {
    id: number
    name: string
    onClick: () => void
}

@observer
export class DeckNote extends React.Component<DeckNoteProps> {

    render() {
        const {id, name, onClick} = this.props

        if (userStore.loginInProgress || userDeckStore.loadingDecks) {
            return <Loader/>
        }
        if (!userStore.loggedIn()) {
            return null
        }
        const deck = userDeckStore.userDeckByDeckId(id)

        return <DeckNoteLoaded id={id} name={name} notes={deck == null || deck.notes == null ? "" : deck.notes} onClick={onClick}/>
    }
}

interface DeckNoteLoadedProps {
    id: number
    name: string
    notes: string
    onClick: () => void
}

@observer
class DeckNoteLoaded extends React.Component<DeckNoteLoadedProps> {

    @observable
    open = false

    @observable
    notes = ""

    @observable
    spinner = false

    handleClose = () => this.open = false
    handleOpen = () => {
        this.spinner = false
        this.open = true
        this.notes = this.props.notes
        this.props.onClick()
    }

    save = async () => {
        const {name, id} = this.props
        this.spinner = true
        await userDeckStore.updateNotes(this.notes.trim(), id, name)
        this.handleClose()
        this.spinner = false
    }

    render() {
        const {name} = this.props
        return (
            <>
                <MenuItem
                    onClick={this.handleOpen}
                >
                    My Notes
                </MenuItem>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                    style={{minWidth: 320, zIndex: screenStore.zindexes.cardsDisplay}}
                >
                    <DialogTitle disableTypography={true} style={{display: "flex", justifyContent: "center"}}>
                        <Typography variant={"h5"}>{name}</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            value={this.notes}
                            onChange={(event) => this.notes = event.target.value}
                            multiline={true}
                            fullWidth={true}
                            helperText={"Only you can see these notes, but you can share searches using their contents."}
                            placeholder={"Notes ..."}
                        />
                    </DialogContent>
                    <DialogActions>
                        <KeyButton onClick={this.handleClose}>Close</KeyButton>
                        <KeyButton color={"primary"} onClick={this.save} loading={this.spinner}>Save</KeyButton>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

interface InlineDeckNoteProps {
    id: number
}

@observer
export class InlineDeckNote extends React.Component<InlineDeckNoteProps> {

    render() {
        const {id} = this.props

        if (userStore.loginInProgress || !userStore.loggedIn() || userDeckStore.userDecks == null || !keyLocalStorage.genericStorage.viewNotes) {
            return null
        }
        const notesForDeck = userDeckStore.userDecks?.get(id)?.notes ?? ""
        return <InlineDeckNoteLoaded id={id} notes={notesForDeck}/>
    }
}

interface InlineDeckNoteLoadedProps {
    id: number
    notes?: string
}

@observer
class InlineDeckNoteLoaded extends React.Component<InlineDeckNoteLoadedProps> {

    @observable
    notes = ""

    componentDidMount(): void {
        this.notes = this.props.notes ?? ""
    }

    componentDidUpdate(prevProps: Readonly<InlineDeckNoteLoadedProps>) {
        if (prevProps.notes !== this.props.notes) {
            this.notes = this.props.notes ?? ""
        }
    }

    save = () => {
        const {id} = this.props
        userDeckStore.updateNotes(this.notes.trim(), id)
    }

    render() {
        return (
            <div
                style={{marginTop: spacing(2), display: "flex"}}
            >
                <TextField
                    multiline={true}
                    rows={3}
                    value={this.notes}
                    variant={"filled"}
                    fullWidth={true}
                    label={"Notes"}
                    onChange={(event) => this.notes = event.target.value}
                    style={{marginRight: spacing(2)}}
                />
                <div>
                    <IconButton
                        onClick={this.save}
                    >
                        <Save fontSize={"small"}/>
                    </IconButton>
                </div>
            </div>
        )
    }
}
