package coraythan.keyswap.userdeck

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckLanguage
import coraythan.keyswap.generic.Country
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

        @Enumerated(EnumType.STRING)
        val forSaleInCountry: Country? = null,

        val currencySymbol: String? = null,

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
        get() = this.forSale || this.forTrade

    val dateListedLocalDate: LocalDate?
        get() = this.dateListed?.toLocalDate()

    val expiresAtLocalDate: LocalDate?
        get() = this.expiresAt?.toLocalDate()

    fun toDto(forAuction: Boolean = false) = UserDeckDto(
            wishlist = wishlist,
            funny = funny,
            ownedBy = ownedBy,
            creator = creator,
            forSale = forSale,
            forTrade = forTrade,
            forAuction = forAuction,
            forSaleInCountry = forSaleInCountry,
            language = language,
            askingPrice = askingPrice,
            listingInfo = listingInfo,
            condition = condition,
            redeemed = redeemed,
            externalLink = externalLink,
            dateListed = dateListed,
            expiresAt = expiresAt,
            id = id,
            deckId = deck.id,
            currencySymbol = currencySymbol ?: "$",

            username = user.username,
            publicContactInfo = user.publicContactInfo
    )
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
        val currencySymbol: String,

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
        val publicContactInfo: String?
) {
    val dateListedLocalDate: LocalDate?
        get() = this.dateListed?.toLocalDate()

    val expiresAtLocalDate: LocalDate?
        get() = this.expiresAt?.toLocalDate()
}
