import { IconButton } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import InputLabel from "@material-ui/core/InputLabel"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { Delete } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { theme } from "../config/MuiConfig"
import { userStore } from "../user/UserStore"

interface NotesAndTagsSearchProps {
    notes: string
    notesUser: string
    handleNotesUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void
    notesNotLike: boolean
    handleNotesNotLikeUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void
    removeNotes: () => void
}

@observer
export class NotesAndTagsSearch extends React.Component<NotesAndTagsSearchProps> {
    render() {
        const {notes, notesUser, handleNotesUpdate, removeNotes, notesNotLike, handleNotesNotLikeUpdate} = this.props
        return (
            <div>
                {userStore.loggedIn() && (
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!keyLocalStorage.genericStorage.viewNotes}
                                    onChange={() => {
                                        keyLocalStorage.updateGenericStorage({viewNotes: !keyLocalStorage.genericStorage.viewNotes})
                                    }}
                                />
                            }
                            label={<Typography variant={"body2"} noWrap={true}>View Notes</Typography>}
                        />
                        {/*<FormControlLabel*/}
                        {/*    control={*/}
                        {/*        <Checkbox*/}
                        {/*            checked={notesNotLike}*/}
                        {/*            onChange={handleNotesNotLikeUpdate}*/}
                        {/*        />*/}
                        {/*    }*/}
                        {/*    label={<Typography variant={"body2"} noWrap={true}>Does Not Contain</Typography>}*/}
                        {/*/>*/}
                    </>
                )}
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
                                <div style={{display: "flex", alignItems: "center", marginBottom: theme.spacing(1)}}>
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