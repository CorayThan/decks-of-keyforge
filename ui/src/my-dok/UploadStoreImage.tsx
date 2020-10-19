import { Box, Link } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import imageCompression from "browser-image-compression"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { useState } from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, Utils } from "../config/Utils"
import { HelperText } from "../generic/CustomTypographies"
import { FileUploadButton, FileUploadType } from "../mui-restyled/FileUploadButton"
import { KeyButton } from "../mui-restyled/KeyButton"
import { Loader, LoaderSize } from "../mui-restyled/Loader"
import { sellerStore } from "../sellers/SellerStore"
import { messageStore } from "../ui/MessageStore"

interface UploadStoreImageProps {
    icon: boolean
    imageKey?: string
}

class StoreImageStore {
    @observable
    width = 0

    @observable
    height = 0
}

export const UploadStoreImage = observer((props: UploadStoreImageProps) => {

    const {icon, imageKey} = props

    const [store] = useState(new StoreImageStore())

    const type = icon ? "Icon" : "Banner"
    log.info("It's a " + type)

    const name = `${imageKey != null ? "Update" : "Add"} Store ${type}`

    let firstHelper = "Your store's icon is a small image placed next to your store name."
    let secondHelper = "For best results please use a 48 x 48 pixel PNG image with transparency. Max width and height is 512px."

    if (!icon) {
        firstHelper = "Your store's banner is a short, wide image placed at the top of searches for your decks for sale."
        secondHelper = "800 x 120 pixels is an example of a good banner size. " +
            "Please ensure the image is wide and short for good presentation."
    }

    const loading = icon ? sellerStore.addingStoreIcon : sellerStore.addingStoreBanner

    log.info("icon key: " + imageKey)

    let valid = true
    if (!icon && store.width !== 0) {
        if ((store.width / store.height) < 3) {
            valid = false
        }
    }

    return (
        <Box display={"flex"} flexDirection={"column"} maxWidth={480}>
            <Typography variant={"h6"}>Store {type}</Typography>
            <HelperText style={{marginTop: spacing(2)}}>
                {firstHelper}
            </HelperText>
            <HelperText style={{marginTop: spacing(2), marginBottom: spacing(2)}}>
                {secondHelper}
            </HelperText>
            {!valid && (
                <Typography color={"error"} style={{marginBottom: spacing(2)}}>
                    This banner image is too tall! Please upload another image with lower height.
                </Typography>
            )}
            {imageKey != null && (
                <Box mb={2}>
                    <Link href={Routes.userContent(imageKey)} target={"_blank"}>
                        <img
                            onLoad={(event) => {
                                store.height = event.currentTarget.offsetHeight
                                store.width = event.currentTarget.offsetWidth
                            }}
                            src={Routes.userContent(imageKey)}
                            style={{height: icon ? 48 : undefined, maxWidth: 400}}
                            alt={icon ? "Store Icon" : "Store Banner"}
                        />
                    </Link>
                </Box>
            )}
            <Box display={"flex"}>
                <FileUploadButton
                    id={type}
                    variant={"outlined"}
                    color={"primary"}
                    fileType={FileUploadType.IMAGE}
                    disabled={loading}
                    handleUpload={async (event) => {

                        if (event.target.files != null) {
                            if (icon) {
                                log.info("It's an icon")
                                sellerStore.addingStoreIcon = true
                            } else {
                                log.info("It's a banner")
                                sellerStore.addingStoreBanner = true
                            }
                            const imgFile = event.target.files[0]

                            try {
                                const compressedImg = await imageCompression(imgFile, {
                                    maxSizeMB: icon ? 0.25 : 1.0,
                                    maxWidthOrHeight: icon ? 512 : 2000,
                                    useWebWorker: true
                                })
                                await sellerStore.saveStoreImage(compressedImg, icon, Utils.filenameExtension(imgFile))
                            } catch (e) {

                                messageStore.setWarningMessage("Couldn't upload image.")
                            }
                        } else {
                            messageStore.setWarningMessage("No file added to upload.")
                        }
                        log.info("file upload clicked")
                    }}
                >
                    {name}
                    {loading && <Loader size={LoaderSize.SMALL} style={{marginLeft: spacing(2)}}/>}
                </FileUploadButton>
                {imageKey != null && (
                    <KeyButton
                        disabled={loading}
                        onClick={icon ? sellerStore.deleteStoreIcon : sellerStore.deleteStoreBanner}
                        variant={"outlined"}
                        style={{marginLeft: spacing(2)}}
                    >
                        Remove
                    </KeyButton>
                )}
            </Box>
        </Box>
    )
})