import { Dialog, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
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

        return <DeckNoteLoaded id={id} name={name} notes={deck == null || deck.notes == null ? "" : deck.notes} onClick={onClick} />
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
        await userDeckStore.updateNotes(name, this.notes.trim(), id)
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
