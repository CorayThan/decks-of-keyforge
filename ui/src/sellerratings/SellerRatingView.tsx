import { Box, Button, Dialog, Divider, Link, TextField, Tooltip, Typography } from "@material-ui/core"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import { Rating } from "@material-ui/lab"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { spacing, theme } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { HelperText } from "../generic/CustomTypographies"
import { KeyButton } from "../mui-restyled/KeyButton"
import { Loader } from "../mui-restyled/Loader"
import { WhiteSpaceTypography } from "../mui-restyled/WhiteSpaceTypography"
import { userStore } from "../user/UserStore"
import { sellerRatingsStore } from "./SellerRatingsStore"

type RatingValue = 0 | 1 | 2 | 3 | 4 | 5

class UserRatingStore {

    @observable
    writingReview = false

    @observable
    open = false

    @observable
    rating: RatingValue = 0

    @observable
    review = ""

    @observable
    title = ""

    @observable
    saving = false

    @observable
    maybeDelete = false

    @observable
    error = false

    deleteReview = async (sellerId: string) => {
        if (this.maybeDelete) {
            this.saving = true
            await sellerRatingsStore.deleteReview(sellerId)
            this.saving = false
        } else {
            this.maybeDelete = true
        }
    }

    openReviews = (sellerId: string) => {
        this.open = true
        sellerRatingsStore.findReviewsForSeller(sellerId)
    }

    beginReview = () => {
        this.writingReview = true
    }

    cancelReview = () => {
        this.writingReview = false
    }

    closeReviews = () => {
        this.writingReview = false
        this.open = false
        this.rating = 0
    }

    submitReview = async (sellerId: string) => {
        this.saving = true
        await sellerRatingsStore.createReview({
            sellerId,
            review: this.review.trim(),
            rating: this.rating,
            title: this.title.trim()
        })
        this.saving = false
        this.writingReview = false
    }
    reviewIsValid = () => this.rating >= 1 && this.rating <= 5 && this.review.trim().length > 0 && this.review.trim().length < 2500
        && this.title.trim().length < 81 && this.title.trim().length > 0
}

interface UserRatingProps {
    sellerId: string
    sellerName: string
    countOnly?: boolean
    style?: React.CSSProperties
}

interface UserRatingDialogProps extends UserRatingProps {
    rating: number
    reviewsCount: number
    store: UserRatingStore
}

export const SellerRatingView = observer((props: UserRatingProps) => {
    const {sellerId, countOnly, style} = props
    const ratingForSeller = sellerRatingsStore.ratings.find(rating => rating.sellerId === sellerId)
    const rating = ratingForSeller?.rating ?? 0
    const reviewsCount = ratingForSeller?.reviews ?? 0
    const [store] = useState(new UserRatingStore())
    let reviewsText = `${reviewsCount} review`
    if (countOnly) {
        reviewsText = `(${reviewsCount})`
    } else if (reviewsCount !== 1) {
        reviewsText += "s"
    }

    return (
        <div style={style}>
            <Box
                display={"flex"}
                alignItems={"flex-end"}
                onClick={() => store.openReviews(sellerId)}
                style={{cursor: "pointer"}}
            >
                <Rating
                    name={"seller ratings"}
                    value={rating}
                    readOnly={true}
                    precision={0.1}
                    size={"small"}
                    style={{marginRight: spacing(2)}}
                />
                <Link
                    variant={"subtitle2"}
                    style={{height: 18, paddingTop: 1, fontSize: "0.812rem"}}
                >
                    {reviewsText}
                </Link>
            </Box>
            {store.open && (
                <Dialog
                    open={store.open}
                    onClose={store.closeReviews}
                >
                    <Box
                        style={{minWidth: 400}}
                    >
                        {store.writingReview ? (
                            <CreateReviewDialog {...props} store={store} rating={rating} reviewsCount={reviewsCount}/>
                        ) : (
                            <DisplayReviewsDialog {...props} store={store} rating={rating} reviewsCount={reviewsCount}/>
                        )}
                    </Box>
                </Dialog>
            )}
        </div>
    )
})

const DisplayReviewsDialog = observer((props: UserRatingDialogProps) => {
    const {sellerName, rating, reviewsCount, sellerId, store} = props
    const sellersReviews = sellerRatingsStore.sellerReviews
    return (

        <>
            <DialogTitle>
                Reviews for {sellerName}
            </DialogTitle>
            <DialogContent>
                <Typography variant={"subtitle1"}>Overall Rating</Typography>
                <Box display={"flex"} alignItems={"flex-end"} mt={1}>
                    <Rating
                        name={"seller ratings big"}
                        value={rating}
                        readOnly={true}
                        precision={0.1}
                        size={"large"}
                        style={{marginRight: spacing(2)}}
                    />
                    {rating > 0 && (
                        <Typography variant={"subtitle1"} style={{marginRight: spacing(2)}}>
                            {rating.toFixed(1)}
                        </Typography>
                    )}
                    <Typography variant={"subtitle1"}>
                        {reviewsCount} reviews
                    </Typography>
                </Box>
                <HelperText style={{margin: theme.spacing(1, 0, 2, 0)}}>
                    {sellerRatingsStore.summaryMessageForRating(rating)}
                </HelperText>
                {sellersReviews != null && sellersReviews.length === 0 && (
                    <Typography>This seller has not yet been reviewed.</Typography>
                )}
                {sellersReviews == null ? <Loader/> : (
                    <div>
                        {sellersReviews.map(review => {
                            return (
                                <div key={review.reviewerUsername}>
                                    <Divider style={{margin: spacing(2, 0)}}/>
                                    <Typography variant={"h6"} style={{marginBottom: spacing(1)}}>{review.title}</Typography>
                                    <Rating
                                        name={"seller ratings"}
                                        value={review.rating}
                                        readOnly={true}
                                        precision={0.1}
                                    />
                                    <WhiteSpaceTypography style={{marginTop: spacing(1)}}>{review.review}</WhiteSpaceTypography>
                                    <HelperText style={{margin: spacing(1, 0)}}>
                                        Reviewed by <Link href={Routes.userProfilePage(review.reviewerUsername)}>
                                        {review.reviewerUsername}</Link> on {Utils.formatDate(review.created)}
                                    </HelperText>
                                    {review.reviewerUsername === userStore.username && (
                                        <Box display={"flex"}>
                                            <Typography variant={"body2"} style={{margin: spacing(0.5, 1, 0, 0)}}>You wrote this review</Typography>
                                            <KeyButton
                                                size={"small"}
                                                onClick={() => store.deleteReview(sellerId)}
                                                loading={store.saving}
                                            >
                                                {store.maybeDelete ? "Really delete it?" : "Delete"}
                                            </KeyButton>
                                        </Box>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Tooltip
                    title={userStore.contributedOrManual ? "" : "You must have contributed at least $1 as a Patron to leave reviews. Patrons are charged on the 1st of the month."}
                >
                    <div>
                        <Button
                            component={"button"}
                            onClick={store.beginReview}
                            variant={"outlined"}
                            color={"primary"}
                            size={"small"}
                            disabled={
                                !(sellerId != userStore.userId && userStore.contributedOrManual && sellersReviews != null
                                    && sellersReviews.find(review => review.reviewerUsername === userStore.username) == null)
                            }
                        >
                            Write Review
                        </Button>
                    </div>
                </Tooltip>
                <Box flexGrow={1}/>
                <KeyButton onClick={store.closeReviews}>Close</KeyButton>
            </DialogActions>
        </>
    )
})

const CreateReviewDialog = observer((props: UserRatingDialogProps) => {
    const {sellerName, sellerId, store} = props
    return (
        <>
            <DialogTitle>
                Write Review for {sellerName}
            </DialogTitle>
            <DialogContent>
                <TextField
                    label={"Title"}
                    fullWidth={true}
                    variant={"outlined"}
                    onChange={event => store.title = event.target.value}
                />
                <Box display={"flex"} alignItems={"flex-end"} mt={2}>
                    <Rating
                        name={"seller ratings make"}
                        value={store.rating}
                        size={"large"}
                        onChange={(event, newValue) => {
                            store.rating = newValue as RatingValue
                        }}
                    />
                </Box>
                <HelperText style={{margin: theme.spacing(1, 0, 2, 0)}}>
                    {sellerRatingsStore.summaryMessageForRating(store.rating)}
                </HelperText>
                <TextField
                    label={"Review"}
                    fullWidth={true}
                    multiline={true}
                    rows={5}
                    rowsMax={20}
                    variant={"outlined"}
                    onChange={event => store.review = event.target.value}
                />
                <HelperText style={{margin: theme.spacing(2, 0, 0, 0)}}>
                    You must include a rating and review. Please include
                    information like the seller's responsiveness, shipping speed, and whether you successfully bought a deck from them.
                </HelperText>
            </DialogContent>
            <DialogActions>
                <Button onClick={store.cancelReview}>Cancel</Button>
                <KeyButton
                    component={"button"}
                    onClick={() => store.submitReview(sellerId)}
                    variant={"contained"}
                    color={"primary"}
                    disabled={!store.reviewIsValid() || store.saving}
                    loading={store.saving}
                >
                    Submit
                </KeyButton>
            </DialogActions>
        </>
    )
})

