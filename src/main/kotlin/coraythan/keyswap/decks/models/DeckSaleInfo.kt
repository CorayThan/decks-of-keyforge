package coraythan.keyswap.decks.models

import coraythan.keyswap.auctions.Auction
import coraythan.keyswap.auctions.AuctionStatus
import coraythan.keyswap.generic.Country
import coraythan.keyswap.toLocalDateWithOffsetMinutes
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.userdeck.DeckCondition
import coraythan.keyswap.userdeck.UserDeck
import coraythan.keyswap.users.KeyUser
import java.time.LocalDate
import java.util.*

data class DeckSaleInfo(
        val forSale: Boolean,
        val forTrade: Boolean,
        val forAuction: Boolean,

        val forSaleInCountry: Country?,
        val currencySymbol: String,
        val language: DeckLanguage? = null,

        val askingPrice: Double?,

        val highestBid: Int? = null,
        val startingBid: Int? = null,
        val buyItNow: Int? = null,
        val auctionEndDateTime: String? = null,
        val auctionId: UUID? = null,
        val nextBid: Int? = null,
        val youAreHighestBidder: Boolean? = null,
        val yourMaxBid: Int? = null,
        val bidIncrement: Int? = null,
        val auctionStatus: AuctionStatus? = null,
        val boughtBy: String? = null,
        val boughtWithBuyItNow: Boolean? = null,
        val boughtNowOn: String? = null,

        val listingInfo: String?,
        val externalLink: String?,
        val condition: DeckCondition,
        val dateListed: LocalDate,
        val expiresAt: LocalDate?,

        val username: String,
        val publicContactInfo: String?,
        val discord: String?
) {
    companion object {
        fun fromUserDeck(offsetMinutes: Int, userDeck: UserDeck): DeckSaleInfo? {
            return if (!userDeck.availableToBuy) {
                null
            } else {
                DeckSaleInfo(
                        forSale = userDeck.forSale,
                        forTrade = userDeck.forTrade,
                        forAuction = false,
                        forSaleInCountry = userDeck.forSaleInCountry,
                        language = userDeck.language,
                        currencySymbol = userDeck.currencySymbol ?: "$",
                        askingPrice = userDeck.askingPrice,
                        listingInfo = userDeck.listingInfo,
                        externalLink = userDeck.externalLink,
                        condition = userDeck.condition!!,
                        dateListed = userDeck.dateListed?.toLocalDateWithOffsetMinutes(offsetMinutes) ?: LocalDate.parse("2019-04-07"),
                        expiresAt = userDeck.expiresAt?.toLocalDateWithOffsetMinutes(offsetMinutes),
                        username = userDeck.user.username,
                        publicContactInfo = userDeck.user.publicContactInfo,
                        discord = userDeck.user.discord
                )
            }
        }
        
        fun fromAuction(offsetMinutes: Int, auction: Auction, currentUser: KeyUser?): DeckSaleInfo {
            val youAreHighest = auction.highestBidderUsername == currentUser?.username && currentUser != null

            return DeckSaleInfo(
                    forSale = false,
                    forTrade = false,
                    forAuction = true,
                    forSaleInCountry = auction.forSaleInCountry,
                    language = auction.language,
                    currencySymbol = auction.currencySymbol,
                    askingPrice = null,
                    listingInfo = auction.listingInfo,
                    externalLink = auction.externalLink,
                    condition = auction.condition!!,
                    dateListed = auction.dateListed.toLocalDateWithOffsetMinutes(offsetMinutes),
                    expiresAt = null,
                    username = auction.seller.username,
                    publicContactInfo = auction.seller.publicContactInfo,
                    discord = auction.seller.discord,

                    highestBid = auction.highestBid,
                    buyItNow = auction.buyItNow,
                    startingBid = auction.startingBid,
                    auctionEndDateTime = auction.endDateTime.toReadableStringWithOffsetMinutes(offsetMinutes),
                    auctionId = auction.id,
                    nextBid = auction.nextBid,
                    youAreHighestBidder = youAreHighest,
                    yourMaxBid = if (youAreHighest) auction.realMaxBid() else null,
                    bidIncrement = auction.bidIncrement,
                    auctionStatus = auction.status,
                    boughtBy = auction.boughtWithBuyItNow?.username ?: if (auction.status == AuctionStatus.COMPLETE) auction.highestBidder()?.username else null,
                    boughtNowOn = auction.boughtNowOn?.toReadableStringWithOffsetMinutes(offsetMinutes)
            )
        }
    }
}
