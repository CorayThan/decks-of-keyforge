package coraythan.keyswap.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import coraythan.keyswap.auctions.DeckListing
import coraythan.keyswap.auctions.purchases.Purchase
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generic.Country
import coraythan.keyswap.nowLocal
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.tags.KTag
import coraythan.keyswap.userdeck.UserDeck
import coraythan.keyswap.users.search.UserSearchResult
import java.time.LocalDateTime
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

        @JsonIgnoreProperties("creator")
        @OneToMany(mappedBy = "creator", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
        val tags: List<KTag> = listOf(),

        @JsonIgnoreProperties("boughtWithBuyItNow")
        @OneToMany(mappedBy = "boughtWithBuyItNow", fetch = FetchType.LAZY)
        val buyItNows: List<DeckListing> = listOf(),

        val lastVersionSeen: String?,

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        val apiKey: String? = null,

        val patreonId: String? = null,

        @Enumerated(EnumType.STRING)
        val patreonTier: PatreonRewardsTier? = null,

        val lifetimeSupportCents: Int = 0,

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
        val storeIconKey: String? = null,
        val storeBannerKey: String? = null,

        @JsonIgnoreProperties("seller")
        @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
        val auctions: List<DeckListing> = listOf(),

        @JsonIgnoreProperties("buyer")
        @OneToMany(mappedBy = "buyer", fetch = FetchType.LAZY)
        val purchases: List<Purchase> = listOf(),

        @JsonIgnoreProperties("seller")
        @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
        val sales: List<Purchase> = listOf(),

        val teamId: UUID? = null,

        val updateStats: Boolean = false,

        val autoRenewListings: Boolean = false,

        val created: LocalDateTime? = nowLocal(),

        val agreedToTermsOfService: Boolean = true,

        // Stats values
        val rating: Double = 0.0,
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
            sellerEmail = sellerEmail,
            discord = discord,
            publicContactInfo = publicContactInfo,
            allowUsersToSeeDeckOwnership = allowUsersToSeeDeckOwnership,
            country = country,
            preferredCountries = preferredCountries,
            lastVersionSeen = lastVersionSeen,
            searchResult = if (allowUsersToSeeDeckOwnership) generateSearchResult() else null
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
            storeIconKey = storeIconKey,
            storeBannerKey = storeBannerKey,
            forSaleCount = forSaleCount,
            shippingCost = shippingCost,
            teamId = teamId,
            autoRenewListings = autoRenewListings,
            contributedOrManual = contributedOrManual(),
            agreedToTerms = agreedToTermsOfService
    )

    fun generateSearchResult(): UserSearchResult {
        val owned = this.decks.filter { userDeck -> userDeck.ownedBy != null }.map { it.deck }
        val sasRatings = owned.map { deck -> deck.sasRating }.sortedDescending()
        return UserSearchResult(
                this.id,
                this.username,
                this.rating,
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
                this.manualPatreonTier,
                this.teamId,
                !this.allowUsersToSeeDeckOwnership
        )
    }

    fun minimalSearchResult(): UserSearchResult {
        return UserSearchResult(
                this.id,
                this.username,
                this.rating,
                if (this.allowUsersToSeeDeckOwnership) deckCount else 0,
                forSaleCount,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                this.type,
                null,
                null,
                null,
                this.allowUsersToSeeDeckOwnership
        )
    }

    fun realPatreonTier(): PatreonRewardsTier? {
        if (username == "Coraythan") return PatreonRewardsTier.ALWAYS_GENEROUS
        if (patreonTier == null && manualPatreonTier == null) return null
        if (patreonTier != null && manualPatreonTier == null) return patreonTier
        if (patreonTier == null && manualPatreonTier != null) return manualPatreonTier
        return if (patreonTier!!.ordinal > manualPatreonTier!!.ordinal) {
            patreonTier
        } else {
            manualPatreonTier
        }
    }

    fun contributedOrManual(): Boolean {
        return username == "Coraythan"
                || manualPatreonTier != null
                || lifetimeSupportCents > 99
    }

    override fun equals(other: Any?): Boolean {
        if (other is KeyUser) {
            return id == other.id
        }
        return false
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}

@GenerateTs
data class KeyUserDto(
        val id: UUID,

        val username: String,

        val email: String,

        val emailVerified: Boolean,
        val sellerEmailVerified: Boolean,

        val type: UserType,

        val agreedToTerms: Boolean,

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
        val storeIconKey: String? = null,
        val storeBannerKey: String? = null,

        val forSaleCount: Int,

        val shippingCost: String? = null,

        val teamId: UUID? = null,

        val autoRenewListings: Boolean = false,

        val contributedOrManual: Boolean = false
)
