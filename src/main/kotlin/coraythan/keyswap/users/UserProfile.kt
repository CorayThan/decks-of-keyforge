package coraythan.keyswap.users

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generic.Country
import coraythan.keyswap.users.search.UserSearchResult
import java.util.*

@GenerateTs
data class UserProfile(
        val id: UUID,
        val username: String,
        val email: String?,
        val sellerEmail: String?,
        val discord: String?,
        val publicContactInfo: String?,
        val allowUsersToSeeDeckOwnership: Boolean,
        val country: Country?,
        val preferredCountries: List<Country>? = null,
        val lastVersionSeen: String?,
        val searchResult: UserSearchResult?
)

@GenerateTs
data class UserProfileUpdate(
        val email: String?,
        val publicContactInfo: String?,
        val allowsTrades: Boolean,
        val allowUsersToSeeDeckOwnership: Boolean,
        val currencySymbol: String,
        val country: Country?,
        val preferredCountries: List<Country>? = null,
        val sellerEmail: String? = null,
        val discord: String? = null,
        val storeName: String? = null,
        val shippingCost: String? = null,
        val autoRenewListings: Boolean
)
