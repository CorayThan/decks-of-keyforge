package coraythan.keyswap.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import coraythan.keyswap.decks.salenotifications.ForSaleQueryEntity
import coraythan.keyswap.generic.Country
import coraythan.keyswap.userdeck.UserDeck
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

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        val password: String?,

        @Enumerated(EnumType.STRING)
        val type: UserType,

        val publicContactInfo: String? = null,
        val allowUsersToSeeDeckOwnership: Boolean,

        @Enumerated(EnumType.STRING)
        val country: Country? = null,

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val preferredCountries: List<Country>? = null,

        @JsonIgnoreProperties("user")
        @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
        val decks: List<UserDeck> = listOf(),

        @JsonIgnoreProperties("user")
        @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL])
        val forSaleQueries: List<ForSaleQueryEntity> = listOf(),

        val lastVersionSeen: String?,

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        val apiKey: String? = null
) {
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
            type = type,
            publicContactInfo = publicContactInfo,
            allowUsersToSeeDeckOwnership = allowUsersToSeeDeckOwnership,
            country = country,
            preferredCountries = preferredCountries,
            lastVersionSeen = lastVersionSeen
    )
}

data class KeyUserDto(
        val id: UUID,

        val username: String,

        val email: String,

        val type: UserType,

        val publicContactInfo: String? = null,
        val allowUsersToSeeDeckOwnership: Boolean,

        val country: Country? = null,

        val preferredCountries: List<Country>? = null,

        val lastVersionSeen: String?

)
