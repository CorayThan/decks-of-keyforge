import { Dialog, Link, Paper, Tooltip, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import IconButton from "@material-ui/core/IconButton/IconButton"
import { Delete } from "@material-ui/icons"
import Image from "@material-ui/icons/Image"
import imageCompression from "browser-image-compression"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { TimeUtils } from "../../config/TimeUtils"
import { log, Utils } from "../../config/Utils"
import { HelperText } from "../../generic/CustomTypographies"
import { FileUploadButton, FileUploadType } from "../../mui-restyled/FileUploadButton"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { Loader, LoaderSize } from "../../mui-restyled/Loader"
import { messageStore } from "../../ui/MessageStore"
import { screenStore } from "../../ui/ScreenStore"
import { userStore } from "../../user/UserStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { deckOwnershipStore } from "./DeckOwnershipStore"
import { DeckIdentifyingInfo } from "../models/DeckSearchResult";

interface DeckOwnershipButtonsProps {
    deck: DeckIdentifyingInfo
    hasVerification: boolean
    forceVerification?: boolean
    style?: React.CSSProperties
    buttonSize?: "small" | "medium"
}

@observer
export class DeckOwnershipButton extends React.Component<DeckOwnershipButtonsProps> {
    @observable
    open = false

    handleClose = () => this.open = false
    handleOpen = () => {
        deckOwnershipStore.verificationDetails = undefined
        deckOwnershipStore.findDetailsForDeck(this.props.deck.id)
        this.open = true
    }

    constructor(props: DeckOwnershipButtonsProps) {
        super(props)
        makeObservable(this)
    }

    render() {
        const {deck, hasVerification, forceVerification, style, buttonSize} = this.props

        const details = deckOwnershipStore.verificationDetails
        const ownedByMe = userDeckStore.ownedByMe(deck)

        let imageColor: "primary" | "secondary" | undefined
        if (forceVerification || deckOwnershipStore.ownedDecks.includes(deck.id)) {
            imageColor = "primary"
        } else if (hasVerification) {
            imageColor = "secondary"
        }

        return (
            <div>
                <Tooltip title={"View or add deck ownership images."}>
                    <div style={style}>
                        <IconButton
                            onClick={this.handleOpen}
                            size={buttonSize}
                        >
                            <Image color={imageColor}/>
                        </IconButton>
                    </div>
                </Tooltip>
                <Dialog
                    open={this.open}
                    onClose={this.handleClose}
                    style={{zIndex: screenStore.zindexes.cardsDisplay}}
                >
                    <DialogTitle disableTypography={true} style={{display: "flex", justifyContent: "center"}}>
                        <Typography variant={"h5"}>{deck.name}'s Verified Owners</Typography>
                    </DialogTitle>
                    <DialogContent>
                        {details == null ? (
                            <Loader/>
                        ) : (
                            <div>
                                {details.length === 0 && (
                                    <Typography variant={"subtitle1"} style={{marginBottom: spacing(2)}}>
                                        No deck verification images have been submitted.
                                    </Typography>
                                )}
                                {details.map(detail => (
                                    <Paper key={detail.id} style={{
                                        marginBottom: spacing(2),
                                        backgroundColor: themeStore.lightBackgroundColor
                                    }}>
                                        <div style={{overflowX: "auto"}}>
                                            <Link href={detail.url} target={"_blank"}>
                                                <img src={detail.url} style={{width: 552}}/>
                                            </Link>
                                        </div>
                                        <div style={{display: "flex", padding: spacing(1), alignItems: "center"}}>
                                            <KeyLink
                                                style={{color: themeStore.defaultTextColor, flexGrow: 1}}
                                                noStyle={true}
                                                to={Routes.decksForUser(detail.username)}
                                            >
                                                <Typography variant={"subtitle1"}>{detail.username}</Typography>
                                            </KeyLink>
                                            <Typography
                                                variant={"subtitle1"}>{TimeUtils.formatDate(detail.uploadDate)}</Typography>
                                            {detail.username === userStore.username && (
                                                <IconButton
                                                    size={"small"}
                                                    style={{marginLeft: spacing(2)}}
                                                    onClick={() => deckOwnershipStore.deleteOwnership(deck.id)}
                                                >
                                                    <Delete fontSize={"small"}/>
                                                </IconButton>
                                            )}
                                        </div>
                                    </Paper>
                                ))}
                                {ownedByMe ? (
                                    <>
                                        <HelperText style={{marginBottom: spacing(1)}}>
                                            Upload a jpg image of a deck's Archon card to verify possession. For Mass
                                            Mutation decks you may include enhanced
                                            cards in the image.
                                        </HelperText>
                                        <HelperText>
                                            We recommend you cover the QR code and write your username and the date next
                                            to
                                            the deck. The image will be automatically reduced in quality.
                                        </HelperText>
                                    </>
                                ) : (
                                    <HelperText>
                                        These images can help provide evidence that a user is in possession of a deck
                                        and its contents.
                                        Beware they could be falsified and are not proof of ownership!
                                    </HelperText>
                                )}
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions style={{display: "flex", justifyContent: "flex-end"}}>
                        <Tooltip
                            title={ownedByMe ? "" : "Mark a deck as owned to add an ownership verification image."}>
                            <div>
                                <FileUploadButton
                                    id={deck.id.toString()}
                                    fileType={FileUploadType.IMAGE}
                                    disabled={deckOwnershipStore.addingDeckVerificationImage || !ownedByMe}
                                    handleUpload={async (event) => {

                                        log.info("file upload clicked")
                                        if (event.target.files != null) {
                                            deckOwnershipStore.addingDeckVerificationImage = true
                                            const imgFile = event.target.files[0]
                                            try {
                                                const compressedImg = await imageCompression(imgFile, {
                                                    maxSizeMB: 0.25,
                                                    maxWidthOrHeight: 2048,
                                                    useWebWorker: true
                                                })
                                                await deckOwnershipStore.saveDeckVerificationImage(compressedImg, deck.id, Utils.filenameExtension(imgFile))
                                            } catch (e) {
                                                messageStore.setWarningMessage("Couldn't upload image. Please try a different image.")
                                            }
                                        } else {
                                            messageStore.setWarningMessage("No file added to upload.")
                                        }
                                    }}
                                >
                                    Add Ownership Image
                                    {deckOwnershipStore.addingDeckVerificationImage &&
                                        <Loader size={LoaderSize.SMALL} style={{marginLeft: spacing(2)}}/>}
                                </FileUploadButton>
                            </div>
                        </Tooltip>
                        <KeyButton onClick={this.handleClose}>Close</KeyButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
