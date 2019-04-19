package coraythan.keyswap.userdeck

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.auctions.Auction
import coraythan.keyswap.auctions.AuctionDto
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckLanguage
import coraythan.keyswap.decks.models.DeckSaleInfo
import coraythan.keyswap.generic.Country
import coraythan.keyswap.toLocalDateWithOffsetMinutes
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.users.KeyUser
import java.time.LocalDate
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.*

@Entity
data class UserDeck(

        @JsonIgnoreProperties("decks")
        @ManyToOne
        val user: KeyUser,

        @ManyToOne
        val deck: Deck,

        val wishlist: Boolean = false,
        val funny: Boolean = false,
        val ownedBy: String? = null,

        /**
         * Only for unregistered decks
         */
        val creator: Boolean = false,

        // Deck selling info below
        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val forAuction: Boolean = false,

        @OneToOne(cascade = [CascadeType.ALL])
        val auction: Auction? = null,

        @Enumerated(EnumType.STRING)
        val forSaleInCountry: Country? = null,

        val currencySymbol: String? = "$",

        @Enumerated(EnumType.STRING)
        val language: DeckLanguage? = null,

        val askingPrice: Double? = null,

        val listingInfo: String? = null,

        val condition: DeckCondition? = null,
        val redeemed: Boolean = true,
        val externalLink: String? = null,

        val dateListed: ZonedDateTime? = null,
        val expiresAt: ZonedDateTime? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) {

    val availableToBuy: Boolean
        get() = this.forSale || this.forAuction || this.forTrade

    val dateListedLocalDate: LocalDate?
        get() = this.dateListed?.toLocalDate()

    val expiresAtLocalDate: LocalDate?
        get() = this.expiresAt?.toLocalDate()

    fun toDto() = UserDeckDto(
            wishlist = wishlist,
            funny = funny,
            ownedBy = ownedBy,
            creator = creator,
            forSale = forSale,
            forTrade = forTrade,
            forAuction = forAuction,
            forSaleInCountry = forSaleInCountry,
            language = language,
            currencySymbol = currencySymbol,
            askingPrice = askingPrice,
            listingInfo = listingInfo,
            condition = condition,
            redeemed = redeemed,
            externalLink = externalLink,
            dateListed = dateListed,
            expiresAt = expiresAt,
            id = id,
            deckId = deck.id,

            username = user.username,
            publicContactInfo = user.publicContactInfo,

            auction = auction?.toDto()
    )
    
    fun toDeckSaleInfo(offsetMinutes: Int, currentUser: KeyUser? = null): DeckSaleInfo? {
        return if (!availableToBuy) {
            null
        } else {
            val youAreHighest = auction?.highestBidderUsername == currentUser?.username && currentUser != null
            DeckSaleInfo(
                    forSale = forSale,
                    forTrade = forTrade,
                    auction = forAuction,
                    buyItNow = auction?.buyItNow,
                    highestBid = auction?.highestBid,
                    startingBid = auction?.startingBid,
                    forSaleInCountry = forSaleInCountry,
                    language = language,
                    currencySymbol = currencySymbol,
                    askingPrice = askingPrice,
                    listingInfo = listingInfo,
                    externalLink = externalLink,
                    condition = condition!!,
                    dateListed = dateListed?.toLocalDateWithOffsetMinutes(offsetMinutes) ?: LocalDate.parse("2019-04-07"),
                    expiresAt = expiresAt?.toLocalDateWithOffsetMinutes(offsetMinutes),
                    auctionEndDateTime = auction?.endDateTime?.toReadableStringWithOffsetMinutes(offsetMinutes),
                    auctionId = auction?.id,
                    nextBid = auction?.nextBid,
                    youAreHighestBidder = youAreHighest,
                    yourMaxBid = if (youAreHighest) auction?.realMaxBid() else null,
                    username = user.username,
                    publicContactInfo = user.publicContactInfo,
                    discord = user.discord
            )
        }
    }
}

enum class DeckCondition {
    NEW_IN_PLASTIC,
    NEAR_MINT,
    PLAYED,
    HEAVILY_PLAYED
}

data class UserDeckDto(

        val wishlist: Boolean = false,
        val funny: Boolean = false,
        val ownedBy: String? = null,

        val creator: Boolean = false,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val forAuction: Boolean = false,

        val forSaleInCountry: Country? = null,
        val language: DeckLanguage? = DeckLanguage.ENGLISH,
        val currencySymbol: String? = "$",

        val askingPrice: Double? = null,

        val listingInfo: String? = null,

        val condition: DeckCondition? = null,
        val redeemed: Boolean = true,
        val externalLink: String? = null,

        val dateListed: ZonedDateTime? = null,
        val expiresAt: ZonedDateTime? = null,

        val id: UUID = UUID.randomUUID(),

        val deckId: Long,

        val username: String,
        val publicContactInfo: String?,

        val auction: AuctionDto?
) {
    val dateListedLocalDate: LocalDate?
        get() = this.dateListed?.toLocalDate()

    val expiresAtLocalDate: LocalDate?
        get() = this.expiresAt?.toLocalDate()
}
