import { Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { spacing } from "../config/MuiConfig"
import { log, Utils } from "../config/Utils"
import { FileUploadButton, FileUploadType } from "../mui-restyled/FileUploadButton"
import { Loader, LoaderSize } from "../mui-restyled/Loader"
import { messageStore } from "../ui/MessageStore"
import { TeamIcon } from "./TeamIcon"
import { teamStore } from "./TeamStore"

export const UploadTeamImage = observer((props: { teamImg?: string, style?: React.CSSProperties }) => {
    const {teamImg, style} = props

    const [open, setOpen] = useState(false)

    return (
        <>
            {teamImg == null ? (
                <Button
                    style={style}
                    onClick={() => setOpen(true)}
                >
                    Add Team Image
                </Button>
            ) : (
                <ButtonBase
                    style={style}
                    onClick={() => setOpen(true)}
                >
                    <TeamIcon teamImg={teamImg} size={36}/>
                </ButtonBase>
            )}

            <Dialog open={open}>
                <DialogTitle>
                    Add or Update Team Icon
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Make your team icon 96 x 96 pixels for best quality.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <FileUploadButton
                        id={"team image"}
                        color={"primary"}
                        fileType={FileUploadType.IMAGE}
                        disabled={teamStore.uploadingImg}
                        handleUpload={async (event) => {
                            if (event.target.files != null) {
                                teamStore.uploadingImg = true
                                const imgFile = event.target.files[0]
                                await teamStore.addTeamImage(imgFile, Utils.filenameExtension(imgFile))
                                await teamStore.findTeamInfo()
                                teamStore.uploadingImg = false
                            } else {
                                messageStore.setWarningMessage("No file added to upload.")
                            }
                            setOpen(false)
                            log.info("file upload clicked")
                        }}
                    >
                        Upload
                        {teamStore.uploadingImg && <Loader size={LoaderSize.SMALL} style={{marginLeft: spacing(2)}}/>}
                    </FileUploadButton>
                </DialogActions>
            </Dialog>
        </>
    )
})