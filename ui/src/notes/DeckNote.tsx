import { IconButton } from "@material-ui/core"
import MenuItem from "@material-ui/core/MenuItem"
import { VisibilityOff } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { AutoSaveTextField } from "../components/AutoSaveTextField"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { userStore } from "../user/UserStore"
import { userDeckStore } from "../userdeck/UserDeckStore"

@observer
export class ToggleDeckNotesMenuItem extends React.Component<{onClick: () => void}> {

    render() {
        const notesVisible = keyLocalStorage.genericStorage.viewNotes
        return (
            <>
                <MenuItem
                    onClick={() => {
                        keyLocalStorage.updateGenericStorage({viewNotes: !notesVisible})
                        this.props.onClick()
                    }}
                >
                    {notesVisible ? "Hide Notes" : "Show Notes"}
                </MenuItem>
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
    notes: string
}

@observer
class InlineDeckNoteLoaded extends React.Component<InlineDeckNoteLoadedProps> {

    render() {
        return (
            <div
                style={{marginTop: spacing(2), display: "flex"}}
            >
                <AutoSaveTextField
                    multiline={true}
                    rows={3}
                    value={this.props.notes}
                    variant={"filled"}
                    fullWidth={true}
                    label={"Notes"}
                    style={{marginRight: spacing(2)}}
                    onSave={(notes) => userDeckStore.updateNotes(notes.trim(), this.props.id)}
                />
                <div>
                    <IconButton
                        onClick={() => keyLocalStorage.updateGenericStorage({viewNotes: false})}
                    >
                        <VisibilityOff fontSize={"small"}/>
                    </IconButton>
                </div>
            </div>
        )
    }
}
