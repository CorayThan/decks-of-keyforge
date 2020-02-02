package coraythan.keyswap.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import coraythan.keyswap.auctions.DeckListing
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.auctions.purchases.Purchase
import coraythan.keyswap.decks.salenotifications.ForSaleQueryEntity
import coraythan.keyswap.generic.Country
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.userdeck.UserDeck
import coraythan.keyswap.users.search.UserSearchResult
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.*
import kotlin.math.roundToInt

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
        val buyItNows: List<DeckListing> = listOf(),

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
        val sellerEmailVerified: Boolean = false,
        val discord: String? = null,
        val storeName: String? = null,
        val shippingCost: String? = null,
        val allowsTrades: Boolean = false,

        val displayCrucibleTrackerWins: Boolean? = false,

        @JsonIgnoreProperties("seller")
        @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
        val auctions: List<DeckListing> = listOf(),

        @JsonIgnoreProperties("buyer")
        @OneToMany(mappedBy = "buyer", fetch = FetchType.LAZY)
        val purchases: List<Purchase> = listOf(),

        @JsonIgnoreProperties("seller")
        @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
        val sales: List<Purchase> = listOf(),

        val updateStats: Boolean = false,

        // Stats values
        val deckCount: Int = 0,
        val forSaleCount: Int = 0,
        val topSasAverage: Int = 0,
        val highSas: Int = 0,
        val lowSas: Int = 0,
        val totalPower: Int = 0,
        val totalChains: Int = 0,
        val mavericks: Int = 0,
        val anomalies: Int = 0
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
            sellerEmailVerified = sellerEmailVerified,
            type = type,
            publicContactInfo = publicContactInfo,
            allowsTrades = allowsTrades,
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
            auctionCount = auctions.filter { it.status == DeckListingStatus.ACTIVE }.count(),
            shippingCost = shippingCost
    )

    fun toSearchResult() = UserSearchResult(
            username, deckCount, forSaleCount, topSasAverage, highSas, lowSas,
            totalPower, totalChains, mavericks, anomalies, type, patreonTier, manualPatreonTier
    )

    fun generateSearchResult(): UserSearchResult {
        val owned = this.decks.filter { userDeck -> userDeck.ownedBy != null }.map { it.deck }
        val sasRatings = owned.map { deck -> deck.sasRating }.sortedDescending()
        return UserSearchResult(
                this.username,
                owned.count(),
                this.auctions.count { listing -> listing.isActive },
                if (owned.size < 10) 0 else sasRatings.take(10).average().roundToInt(),
                sasRatings.firstOrNull() ?: 0,
                sasRatings.lastOrNull() ?: 0,
                owned.map { deck -> deck.powerLevel }.sum(),
                owned.map { deck -> deck.chains }.sum(),
                owned.map { deck -> deck.maverickCount }.sum(),
                owned.map { deck -> deck.anomalyCount ?: 0 }.sum(),
                this.type,
                this.patreonTier,
                this.manualPatreonTier
        )
    }

    fun realPatreonTier(): PatreonRewardsTier? {
        if (patreonTier == null && manualPatreonTier == null) return null
        if (patreonTier != null && manualPatreonTier == null) return patreonTier
        if (patreonTier == null && manualPatreonTier != null) return manualPatreonTier
        return if (patreonTier!!.ordinal > manualPatreonTier!!.ordinal) {
            patreonTier
        } else {
            manualPatreonTier
        }
    }
}

data class KeyUserDto(
        val id: UUID,

        val username: String,

        val email: String,

        val emailVerified: Boolean,
        val sellerEmailVerified: Boolean,

        val type: UserType,

        val publicContactInfo: String? = null,
        val allowsTrades: Boolean,
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

        val displayCrucibleTrackerWins: Boolean,

        val shippingCost: String? = null
)
