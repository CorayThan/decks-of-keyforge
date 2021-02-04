import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, Utils } from "../config/Utils"
import { PatreonRewardsTier } from "../generated-src/PatreonRewardsTier"
import { userImgStore } from "../imgs/UserImgStore"
import { FileUploadButton, FileUploadType } from "../mui-restyled/FileUploadButton"
import { KeyButton } from "../mui-restyled/KeyButton"
import { Loader, LoaderSize } from "../mui-restyled/Loader"
import { PatreonRequired } from "../thirdpartysites/patreon/PatreonRequired"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"

export const SelectEventImage = observer((props: { selectedImg?: string, setImage: (imgName: string) => void }) => {
    const {selectedImg, setImage} = props
    const [store] = useState(new SelectEventImageStore())

    const availableImages = userImgStore.myEventBannerImgs
    const canUse = userStore.patronLevelEqualToOrHigher(PatreonRewardsTier.SUPPORT_SOPHISTICATION)

    return (
        <>
            <KeyButton
                loading={userImgStore.loadingMyEventBannerImgs}
                onClick={async () => {
                    await userImgStore.findMyEventBannerImgs()
                    store.open = true
                }}
            >
                {selectedImg == null ? "Add Image" : "Change Image"}
            </KeyButton>
            <Dialog open={store.open}>
                <DialogContent>
                    <PatreonRequired requiredLevel={PatreonRewardsTier.SUPPORT_SOPHISTICATION}/>
                    <Typography>Please make sure your images are landscape. They will be displayed 320px wide by 160px high.</Typography>
                    <Box mb={2} mt={2}>
                        {availableImages.length === 0 ? (
                            <Typography>You have no event images yet. Please upload one.</Typography>
                        ) : (
                            <Box display={"flex"} style={{overflowX: "auto"}}>
                                {availableImages.map(image => (
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} key={image.id}>
                                        <img
                                            alt={"Event Banner Image"}
                                            src={Routes.userContent(image.imgName)}
                                            style={{
                                                width: 200,
                                                marginRight: spacing(2),
                                                cursor: "pointer",
                                                border: store.selected === image.imgName ? `8px solid ${blue["A200"]}` : undefined,
                                            }}
                                            onClick={() => store.selected = image.imgName}
                                        />
                                        <Box display={"flex"} mt={2}>
                                            <Button
                                                style={{marginRight: spacing(2)}}
                                                onClick={() => store.selected = image.imgName}
                                            >
                                                Select
                                            </Button>
                                            {store.reallyDelete === image.id ? (
                                                <Button
                                                    onClick={async () => {
                                                        if (store.selected === image.imgName) {
                                                            store.selected = undefined
                                                        }
                                                        await userImgStore.deleteUserImg(image.id)
                                                        await userImgStore.findMyEventBannerImgs()
                                                        store.reallyDelete = undefined
                                                    }}
                                                >
                                                    Really feed it to Infurnace?
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => store.reallyDelete = image.id}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => store.open = false}>Cancel</Button>
                    <FileUploadButton
                        id={"event image"}
                        color={"primary"}
                        fileType={FileUploadType.IMAGE}
                        disabled={!canUse || userImgStore.uploading}
                        handleUpload={async (event) => {
                            if (event.target.files != null) {
                                userImgStore.uploading = true
                                const imgFile = event.target.files[0]
                                await userImgStore.saveEventBannerImg(imgFile, Utils.filenameExtension(imgFile))
                            } else {
                                messageStore.setWarningMessage("No file added to upload.")
                            }
                            await userImgStore.findMyEventBannerImgs()
                            log.info("file upload clicked")
                        }}
                    >
                        Upload New Image
                        {userImgStore.uploading && <Loader size={LoaderSize.SMALL} style={{marginLeft: spacing(2)}}/>}
                    </FileUploadButton>
                    <Button
                        color={"primary"}
                        disabled={!canUse || userImgStore.uploading || store.selected == null}
                        onClick={() => {
                            setImage(store.selected!)
                            store.open = false
                        }}
                    >
                        Add To Event
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
})


class SelectEventImageStore {

    @observable
    open = false

    @observable
    selected?: string

    @observable
    reallyDelete?: string
}
