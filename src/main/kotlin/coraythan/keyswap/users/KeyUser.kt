package coraythan.keyswap.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import coraythan.keyswap.auctions.Auction
import coraythan.keyswap.auctions.AuctionStatus
import coraythan.keyswap.auctions.purchases.Purchase
import coraythan.keyswap.decks.salenotifications.ForSaleQueryEntity
import coraythan.keyswap.generic.Country
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.userdeck.UserDeck
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.*

@Entity
data class KeyUser(

        @Id
        val id: UUID,

        @Column(unique = true)
        val username: String,

        @Column(unique = true)
        val email: String,

        val emailVerified: Boolean = false,

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        val password: String?,

        @Enumerated(EnumType.STRING)
        val type: UserType,

        val publicContactInfo: String? = null,
        val allowUsersToSeeDeckOwnership: Boolean,

        val currencySymbol: String,

        @Enumerated(EnumType.STRING)
        val country: Country? = null,

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val preferredCountries: List<Country>? = null,

        @JsonIgnoreProperties("user")
        @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
        val decks: List<UserDeck> = listOf(),

        @JsonIgnoreProperties("user")
        @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
        val forSaleQueries: List<ForSaleQueryEntity> = listOf(),

        @JsonIgnoreProperties("boughtWithBuyItNow")
        @OneToMany(mappedBy = "boughtWithBuyItNow", fetch = FetchType.LAZY)
        val buyItNows: List<Auction> = listOf(),

        val lastVersionSeen: String?,

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        val apiKey: String? = null,

        val patreonId: String? = null,

        @Enumerated(EnumType.STRING)
        val patreonTier: PatreonRewardsTier? = null,

        @Enumerated(EnumType.STRING)
        val manualPatreonTier: PatreonRewardsTier? = null,
        val removeManualPatreonTier: ZonedDateTime? = null,

        val mostRecentDeckListing: ZonedDateTime? = null,

        val sellerEmail: String? = null,
        val discord: String? = null,
        val storeName: String? = null,
        val shippingCost: String? = null,
        val allowsTrades: Boolean = false,

        val displayCrucibleTrackerWins: Boolean? = false,

        @JsonIgnoreProperties("seller")
        @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
        val auctions: List<Auction> = listOf(),

        @JsonIgnoreProperties("buyer")
        @OneToMany(mappedBy = "buyer", fetch = FetchType.LAZY)
        val purchases: List<Purchase> = listOf(),

        @JsonIgnoreProperties("seller")
        @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
        val sales: List<Purchase> = listOf()

) {
    val primaryEmail: String
        get() = sellerEmail ?: email

    fun toProfile(isUser: Boolean) = UserProfile(
            id = id,
            username = username,
            email = if (isUser) email else null,
            publicContactInfo = publicContactInfo,
            allowUsersToSeeDeckOwnership = allowUsersToSeeDeckOwnership,
            country = country,
            preferredCountries = preferredCountries,
            lastVersionSeen = lastVersionSeen
    )

    fun toDto() = KeyUserDto(
            id = id,
            username = username,
            email = email,
            emailVerified = emailVerified,
            type = type,
            publicContactInfo = publicContactInfo,
            allowUsersToSeeDeckOwnership = allowUsersToSeeDeckOwnership,
            currencySymbol = currencySymbol,
            country = country,
            preferredCountries = preferredCountries,
            lastVersionSeen = lastVersionSeen,
            patreonId = patreonId,
            patreonTier = realPatreonTier(),
            sellerEmail = sellerEmail,
            discord = discord,
            storeName = storeName,
            displayCrucibleTrackerWins = displayCrucibleTrackerWins == true,
            auctionCount = auctions.filter { it.status == AuctionStatus.ACTIVE }.count()
    )

    fun realPatreonTier(): PatreonRewardsTier? {
        if (patreonTier == null && manualPatreonTier == null) return null
        if (patreonTier != null && manualPatreonTier == null) return patreonTier
        if (patreonTier == null && manualPatreonTier != null) return manualPatreonTier
        if (patreonTier!!.ordinal > manualPatreonTier!!.ordinal) {
            return patreonTier
        } else {
            return manualPatreonTier
        }
    }
}

data class KeyUserDto(
        val id: UUID,

        val username: String,

        val email: String,

        val emailVerified: Boolean,

        val type: UserType,

        val publicContactInfo: String? = null,
        val allowUsersToSeeDeckOwnership: Boolean,

        val currencySymbol: String = "$",
        val country: Country? = null,

        val preferredCountries: List<Country>? = null,

        val lastVersionSeen: String?,

        val patreonId: String?,
        val patreonTier: PatreonRewardsTier?,

        val sellerEmail: String? = null,
        val discord: String? = null,
        val storeName: String? = null,

        val auctionCount: Int,

        val displayCrucibleTrackerWins: Boolean
)
