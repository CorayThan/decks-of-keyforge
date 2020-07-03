package coraythan.keyswap.decks.models

import coraythan.keyswap.auctions.DeckListing
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.generic.Country
import coraythan.keyswap.toLocalDateWithOffsetMinutes
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.userdeck.DeckCondition
import coraythan.keyswap.users.KeyUser
import java.time.LocalDate
import java.util.*

data class DeckSaleInfo(
        val forTrade: Boolean,
        val forAuction: Boolean,
        val acceptingOffers: Boolean,

        val forSaleInCountry: Country?,
        val currencySymbol: String,
        val language: DeckLanguage? = null,

        val highestBid: Int? = null,
        val highestOffer: Int? = null,
        val buyItNow: Int? = null,
        val startingBid: Int? = null,
        val auctionEndDateTime: String? = null,
        val auctionId: UUID,
        val nextBid: Int? = null,
        val youAreHighestBidder: Boolean? = null,
        val yourMaxBid: Int? = null,
        val bidIncrement: Int? = null,
        val deckListingStatus: DeckListingStatus? = null,
        val boughtBy: String? = null,
        val boughtWithBuyItNow: Boolean? = null,
        val boughtNowOn: String? = null,
        val shippingCost: String? = null,

        val listingInfo: String?,
        val externalLink: String?,
        val condition: DeckCondition,
        val dateListed: LocalDate,
        val expiresAt: LocalDate?,

        val hasOwnershipVerification: Boolean,

        val username: String,
        val publicContactInfo: String?,
        val discord: String?
) {
    companion object {
        
        fun fromDeckListing(offsetMinutes: Int, auction: DeckListing, currentUser: KeyUser?): DeckSaleInfo {
            val youAreHighest = auction.highestBidderUsername == currentUser?.username && currentUser != null

            return DeckSaleInfo(
                    forTrade = auction.forTrade,
                    forAuction = auction.status == DeckListingStatus.AUCTION,
                    acceptingOffers = auction.acceptingOffers,
                    forSaleInCountry = auction.forSaleInCountry,
                    language = auction.language,
                    currencySymbol = auction.currencySymbol,
                    listingInfo = auction.listingInfo,
                    externalLink = auction.externalLink,
                    condition = auction.condition,
                    dateListed = auction.dateListed.toLocalDateWithOffsetMinutes(offsetMinutes),
                    expiresAt = auction.endDateTime.toLocalDateWithOffsetMinutes(offsetMinutes),
                    username = auction.seller.username,
                    publicContactInfo = auction.seller.publicContactInfo,
                    discord = auction.seller.discord,
                    shippingCost = if (auction.status != DeckListingStatus.AUCTION || auction.shippingCost.isNullOrBlank()) auction.seller.shippingCost else auction.shippingCost,

                    highestBid = auction.highestBid,
                    highestOffer = auction.highestOffer,
                    buyItNow = auction.buyItNow,
                    startingBid = auction.startingBid,
                    auctionEndDateTime = auction.endDateTime.toReadableStringWithOffsetMinutes(offsetMinutes),
                    auctionId = auction.id,
                    nextBid = auction.nextBid,
                    youAreHighestBidder = youAreHighest,
                    yourMaxBid = if (youAreHighest) auction.realMaxBid() else null,
                    bidIncrement = auction.bidIncrement,
                    deckListingStatus = auction.status,
                    boughtBy = auction.boughtWithBuyItNow?.username ?: if (auction.status == DeckListingStatus.COMPLETE) auction.highestBidder()?.username else null,
                    boughtNowOn = auction.boughtNowOn?.toReadableStringWithOffsetMinutes(offsetMinutes),
                    hasOwnershipVerification = auction.hasOwnershipVerification
            )
        }
    }
}
