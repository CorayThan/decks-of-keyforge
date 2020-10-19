import { IconButton } from "@material-ui/core"
import InputLabel from "@material-ui/core/InputLabel"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { Delete } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, theme } from "../config/MuiConfig"
import { userStore } from "../user/UserStore"

interface NotesAndTagsSearchProps {
    notes: string
    notesUser: string
    handleNotesUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void
    removeNotes: () => void
}

@observer
export class NotesSearch extends React.Component<NotesAndTagsSearchProps> {
    render() {
        const {notes, notesUser, handleNotesUpdate, removeNotes} = this.props
        return (
            <div>
                {notes.length > 0 || userStore.loggedIn() ? (
                    <>
                        {notesUser.length === 0 || userStore.username === notesUser ? (
                            <TextField
                                label={"Search Notes"}
                                onChange={handleNotesUpdate}
                                multiline={true}
                                value={notes}
                                fullWidth={true}
                            />
                        ) : (
                            <div>
                                <div style={{display: "flex", alignItems: "center", marginBottom: spacing(1), marginTop: spacing(1)}}>
                                    <InputLabel>
                                        {notesUser}'s Notes
                                    </InputLabel>
                                    <IconButton onClick={removeNotes} size={"small"} style={{marginLeft: theme.spacing(1)}}>
                                        <Delete/>
                                    </IconButton>
                                </div>
                                <Typography variant={"body2"} color={"textSecondary"}>
                                    "{notes}"
                                </Typography>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        )
    }
}