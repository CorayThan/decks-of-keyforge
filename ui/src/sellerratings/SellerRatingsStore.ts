import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { CreateRating } from "../generated-src/CreateRating"
import { SellerRatingDetails } from "../generated-src/SellerRatingDetails"
import { SellerRatingSummary } from "../generated-src/SellerRatingSummary"
import { messageStore } from "../ui/MessageStore"


export class SellerRatingsStore {
    static readonly CONTEXT = HttpConfig.API + "/seller-ratings"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/seller-ratings/secured"

    @observable
    ratings: SellerRatingSummary[] = []

    @observable
    sellerReviews?: SellerRatingDetails[]

    private overallRatingMessages = [
        "It's a win-win.", // 5
        "Those with nothing to hide have nothing to fear.", // 4.75
        "Heckuva deal.", // 4.5
        "It's a fair trade, boss. I don't mind.", // 4.25
        "A murmook that's blue is a friend to you.", // 4
        "He's a real fun guy if you get to know him.", // 3.75
        "It scans as 'mostly harmless.'", // 3.5
        "The Enlightened are above haggling. Me on the other hand ...", // 3.25
        "Look out for the pincers and don't make it crabby.", // 3
        "Redemption is a journey, not a destination", // 2.75
        "There's no such thing as a free hug.", // 2.5
        "I put it down for just a second...", // 2.25
        "One civilization's trash is... nope, still trash.", // 2
        "...time back turn could I if", // 1.75
        "I tell you, the garbage I deal with every day...", // 1.5
        "Dark of night, thieve's delight.", // 1.25
        "Don't feed it, it'll go away." // 1
    ]

    createReview = async (review: CreateRating) => {
        await axios.post(SellerRatingsStore.SECURE_CONTEXT, review)
        await this.findReviewsForSeller(review.sellerId)
        await this.findSellerRatings()
        messageStore.setSuccessMessage("Thanks for leaving a review!")
    }

    findSellerRatings = async () => {
        const response: AxiosResponse<SellerRatingSummary[]> = await axios.get(SellerRatingsStore.CONTEXT)
        this.ratings = response.data
    }

    findReviewsForSeller = async (sellerId: string) => {
        const response: AxiosResponse<SellerRatingDetails[]> = await axios.get(SellerRatingsStore.CONTEXT + `/${sellerId}`)
        this.sellerReviews = response.data
    }

    summaryMessageForRating = (rating: number): string => {
        if (rating === 0) {
            return "If they come, they will build it."
        }
        const zeroBased = rating - 1
        const multiplyFactor = (this.overallRatingMessages.length - 1) / 4
        const idx = this.overallRatingMessages.length - Math.round(zeroBased * multiplyFactor) - 1
        return this.overallRatingMessages[idx]
    }

    deleteReview = async (sellerId: string) => {
        await axios.delete(`${SellerRatingsStore.SECURE_CONTEXT}/${sellerId}`)
        await this.findReviewsForSeller(sellerId)
        await this.findSellerRatings()
        messageStore.setSuccessMessage("Your review has been deleted.")
    }

    constructor() {
        makeObservable(this)
    }
}

export const sellerRatingsStore = new SellerRatingsStore()
