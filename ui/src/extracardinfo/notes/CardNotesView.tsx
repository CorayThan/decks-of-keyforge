import { CardNotesDto } from "../../generated-src/CardNotesDto"
import { Box, Checkbox, Divider, Typography } from "@material-ui/core"
import { themeStore } from "../../config/MuiConfig"
import { UserLink } from "../../user/UserLink"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { userStore } from "../../user/UserStore"

export const CardNotesView = () => {

}

const IndividualCardNoteView = (props: { note: CardNotesDto }) => {
    const {note, approved, username, extraInfoVersion, created, updated} = props.note

    const isOwner = userStore.username === username

    return (
        <Box style={{backgroundColor: themeStore.aercViewBackground}} borderRadius={20} m={2}>
            <Box m={2}>
                <Typography variant={"body2"}>{note}</Typography>
                <Divider/>

                <Box display={"flex"}>
                    {username && <UserLink username={username}/>}
                    <Box ml={2}/>
                    <FormControlLabel
                        control={<Checkbox checked={approved} disabled={!isOwner}/>}
                        label="Approved"
                    />
                </Box>
                <Box display={"flex"}>
                    <Typography variant={"subtitle2"}>{created}</Typography>
                    {updated && (
                        <Box style={{fontStyle: "italic"}}>
                            <Typography variant={"subtitle2"}>{updated}</Typography>
                        </Box>
                    )}
                    <FormControlLabel
                        control={<Checkbox checked={approved} disabled={!isOwner}/>}
                        label="Approved"
                    />
                </Box>
            </Box>
        </Box>
    )
}
